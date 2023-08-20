//! Compiles and runs a Cairo program.

use anyhow::{bail, Context, Result};
use cairo_felt::Felt252;
use cairo_lang_compiler::db::RootDatabase;
use cairo_lang_compiler::diagnostics::DiagnosticsReporter;
use cairo_lang_compiler::project::setup_project;
use cairo_lang_debug::DebugWithDb;
use cairo_lang_defs::ids::{FreeFunctionId, FunctionWithBodyId, ModuleItemId};
use cairo_lang_defs::plugin::{MacroPlugin, PluginDiagnostic, PluginResult};
use cairo_lang_diagnostics::ToOption;
use cairo_lang_filesystem::cfg::{Cfg, CfgSet};

use std::path::Path;
use std::sync::{Arc, Mutex};

use cairo_lang_filesystem::ids::CrateId;

use cairo_lang_lowering::ids::ConcreteFunctionWithBodyId;
use cairo_lang_runner::short_string::as_cairo_short_string;
use cairo_lang_runner::{RunResultValue, SierraCasmRunner};
use cairo_lang_semantic::db::SemanticGroup;
use cairo_lang_semantic::items::functions::GenericFunctionId;

use cairo_lang_semantic::{ConcreteFunction, FunctionLongId};
use cairo_lang_sierra::extensions::gas::CostTokenType;
use cairo_lang_sierra::ids::FunctionId;
use cairo_lang_sierra_generator::db::SierraGenGroup;
use cairo_lang_sierra_generator::replace_ids::{DebugReplacer, SierraIdReplacer};
use cairo_lang_sierra_to_casm::metadata::MetadataComputationConfig;
use cairo_lang_starknet::casm_contract_class::ENTRY_POINT_COST;
use cairo_lang_starknet::contract::{
    find_contracts, get_contracts_info, get_module_abi_functions, ContractInfo,
};
use cairo_lang_starknet::plugin::consts::{CONSTRUCTOR_MODULE, EXTERNAL_MODULE, L1_HANDLER_MODULE};
use cairo_lang_starknet::plugin::StarkNetPlugin;
use cairo_lang_syntax::attribute::structured::{
    Attribute, AttributeArg, AttributeArgVariant, AttributeListStructurize,
};

use cairo_lang_syntax::node::db::SyntaxGroup;
use cairo_lang_syntax::node::{ast, Token};
use cairo_lang_utils::ordered_hash_map::OrderedHashMap;
use cairo_lang_utils::OptionHelper;
use clap::Parser;
use colored::Colorize;
use itertools::{chain, Itertools};
use rayon::prelude::{IntoParallelIterator, ParallelIterator};

/// Command line args parser.
/// Exits with 0/1 if the input is formatted correctly/incorrectly.
#[derive(Parser, Debug)]
#[clap(version, verbatim_doc_comment)]
pub struct Args {
    /// The path to compile and run its tests.
    #[arg(short, long)]
    pub path: String,
    /// The filter for the tests, running only tests containing the filter string.
    #[arg(short, long, default_value_t = String::default())]
    pub filter: String,
    /// Should we run ignored tests as well.
    #[arg(long, default_value_t = false)]
    pub include_ignored: bool,
    /// Should we run only the ignored tests.
    #[arg(long, default_value_t = false)]
    pub ignored: bool,
    /// Should we add the starknet plugin to run the tests.
    #[arg(long, default_value_t = false)]
    pub starknet: bool,
}

/// The status of a ran test.
enum TestStatus {
    Success,
    Fail(RunResultValue),
    Ignore,
}

pub fn main() -> anyhow::Result<()> {
    let args = Args::parse();
    let runner = TestRunner::new(&args.path, "", false, false, true)?;
    if let Err(e) = runner.run() {
        eprintln!("{e}");
        std::process::exit(1);
    }
    Ok(())
}

pub struct TestRunner {
    pub db: RootDatabase,
    pub main_crate_ids: Vec<CrateId>,
    pub filter: String,
    pub include_ignored: bool,
    pub ignored: bool,
    pub starknet: bool,
}

impl TestRunner {
    /// Configure a new test runner
    ///
    /// # Arguments
    ///
    /// * `path` - The path to compile and run its tests
    /// * `filter` - Run only tests containing the filter string
    /// * `include_ignored` - Include ignored tests as well
    /// * `ignored` - Run ignored tests only
    /// * `starknet` - Add the starknet plugin to run the tests
    pub fn new(
        path: &str,
        filter: &str,
        include_ignored: bool,
        ignored: bool,
        starknet: bool,
    ) -> Result<Self> {
        let db = &mut {
            let mut b = RootDatabase::builder();
            b.detect_corelib();
            b.with_cfg(CfgSet::from_iter([Cfg::name("test")]));
            b.with_macro_plugin(Arc::new(TestPlugin::default()));

            if starknet {
                b.with_macro_plugin(Arc::new(StarkNetPlugin::default()));
            }

            b.build()?
        };

        let main_crate_ids = setup_project(db, Path::new(&path))?;

        if DiagnosticsReporter::stderr().check(db) {
            bail!("failed to compile: {}", path);
        }

        Ok(Self {
            db: db.snapshot(),
            main_crate_ids,
            filter: filter.into(),
            include_ignored,
            ignored,
            starknet,
        })
    }

    /// Runs the tests and process the results for a summary.
    pub fn run(&self) -> Result<String> {
        let db = &self.db;

        let all_entry_points = if self.starknet {
            find_contracts(db, &self.main_crate_ids)
                .iter()
                .flat_map(|contract| {
                    chain!(
                        get_module_abi_functions(db, contract, EXTERNAL_MODULE).unwrap(),
                        get_module_abi_functions(db, contract, CONSTRUCTOR_MODULE).unwrap(),
                        get_module_abi_functions(db, contract, L1_HANDLER_MODULE).unwrap()
                    )
                })
                .map(|func| ConcreteFunctionWithBodyId::from_semantic(db, func.value))
                .collect()
        } else {
            vec![]
        };
        let function_set_costs: OrderedHashMap<FunctionId, OrderedHashMap<CostTokenType, i32>> =
            all_entry_points
                .iter()
                .map(|func_id| {
                    (
                        db.function_with_body_sierra(*func_id).unwrap().id.clone(),
                        [(CostTokenType::Const, ENTRY_POINT_COST)].into(),
                    )
                })
                .collect();
        let all_tests = find_all_tests(db, self.main_crate_ids.clone());
        let sierra_program = self
            .db
            .get_sierra_program_for_functions(
                chain!(
                    all_entry_points.into_iter(),
                    all_tests.iter().flat_map(|(func_id, _cfg)| {
                        ConcreteFunctionWithBodyId::from_no_generics_free(db, *func_id)
                    })
                )
                .collect(),
            )
            .to_option()
            .with_context(|| "Compilation failed without any diagnostics.")?;
        let replacer = DebugReplacer { db };
        let sierra_program = replacer.apply(&sierra_program);
        let total_tests_count = all_tests.len();
        let named_tests = all_tests
            .into_iter()
            .map(|(func_id, mut test)| {
                // Un-ignoring all the tests in `include-ignored` mode.
                if self.include_ignored {
                    test.ignored = false;
                }
                (
                    format!(
                        "{:?}",
                        FunctionLongId {
                            function: ConcreteFunction {
                                generic_function: GenericFunctionId::Free(func_id),
                                generic_args: vec![]
                            }
                        }
                        .debug(db)
                    ),
                    test,
                )
            })
            .filter(|(name, _)| name.contains(&self.filter))
            // Filtering unignored tests in `ignored` mode.
            .filter(|(_, test)| !self.ignored || test.ignored)
            .collect_vec();
        let filtered_out = total_tests_count - named_tests.len();
        let contracts_info = get_contracts_info(db, self.main_crate_ids.clone(), &replacer)?;
        let TestsSummary {
            passed,
            failed,
            ignored,
            failed_run_results,
        } = run_tests(
            named_tests,
            sierra_program,
            function_set_costs,
            contracts_info,
        )?;

        let mut result_string = String::new();
        if failed.is_empty() {
            result_string.push_str(
                format!(
                "test result: {}. {} passed; {} failed; {} ignored; {filtered_out} filtered out;",
                "ok".bright_green(),
                passed.len(),
                failed.len(),
                ignored.len()
            )
                .as_str(),
            );
            Ok(result_string)
        } else {
            result_string.push_str("failures:".to_string().as_str());
            for (failure, run_result) in failed.iter().zip_eq(failed_run_results) {
                result_string.push_str(format!("   {failure} - ").as_str());
                match run_result {
                    RunResultValue::Success(_) => {
                        result_string.push_str(
                            "expected panic but finished successfully."
                                .to_string()
                                .as_str(),
                        );
                    }
                    RunResultValue::Panic(values) => {
                        result_string.push_str("panicked with [".to_string().as_str());
                        for value in &values {
                            match as_cairo_short_string(value) {
                                Some(as_string) => result_string
                                    .push_str(format!("{value} ('{as_string}'), ").as_str()),
                                None => result_string.push_str(format!("{value}, ").as_str()),
                            }
                        }
                        result_string.push_str("].".to_string().as_str());
                    }
                }
            }
            println!();
            bail!(
                "{}\n\
            test result: {}. {} passed; {} failed; {} ignored",
                result_string,
                "FAILED".bright_red(),
                passed.len(),
                failed.len(),
                ignored.len()
            )
        }
    }
}

/// Summary data of the ran tests.
pub struct TestsSummary {
    passed: Vec<String>,
    failed: Vec<String>,
    ignored: Vec<String>,
    failed_run_results: Vec<RunResultValue>,
}

/// Runs the tests and process the results for a summary.
fn run_tests(
    named_tests: Vec<(String, TestConfig)>,
    sierra_program: cairo_lang_sierra::program::Program,
    function_set_costs: OrderedHashMap<FunctionId, OrderedHashMap<CostTokenType, i32>>,
    contracts_info: OrderedHashMap<Felt252, ContractInfo>,
) -> anyhow::Result<TestsSummary> {
    let runner = SierraCasmRunner::new(
        sierra_program,
        Some(MetadataComputationConfig { function_set_costs }),
        contracts_info,
    )
    .with_context(|| "Failed setting up runner.")?;
    println!("running {} tests", named_tests.len());
    let wrapped_summary = Mutex::new(Ok(TestsSummary {
        passed: vec![],
        failed: vec![],
        ignored: vec![],
        failed_run_results: vec![],
    }));
    named_tests
        .into_par_iter()
        .map(|(name, test)| -> anyhow::Result<(String, TestStatus)> {
            if test.ignored {
                return Ok((name, TestStatus::Ignore));
            }
            let result = runner
                .run_function_with_starknet_context(
                    runner.find_function(name.as_str())?,
                    &[],
                    test.available_gas,
                    Default::default(),
                )
                .with_context(|| format!("Failed to run the function `{}`.", name.as_str()))?;
            Ok((
                name,
                match &result.value {
                    RunResultValue::Success(_) => match test.expectation {
                        TestExpectation::Success => TestStatus::Success,
                        TestExpectation::Panics(_) => TestStatus::Fail(result.value),
                    },
                    RunResultValue::Panic(value) => match test.expectation {
                        TestExpectation::Success => TestStatus::Fail(result.value),
                        TestExpectation::Panics(panic_expectation) => match panic_expectation {
                            PanicExpectation::Exact(expected) if value != &expected => {
                                TestStatus::Fail(result.value)
                            }
                            _ => TestStatus::Success,
                        },
                    },
                },
            ))
        })
        .for_each(|r| {
            let mut wrapped_summary = wrapped_summary.lock().unwrap();
            if wrapped_summary.is_err() {
                return;
            }
            let (name, status) = match r {
                Ok((name, status)) => (name, status),
                Err(err) => {
                    *wrapped_summary = Err(err);
                    return;
                }
            };
            let summary = wrapped_summary.as_mut().unwrap();
            let (res_type, status_str) = match status {
                TestStatus::Success => (&mut summary.passed, "ok".bright_green()),
                TestStatus::Fail(run_result) => {
                    summary.failed_run_results.push(run_result);
                    (&mut summary.failed, "fail".bright_red())
                }
                TestStatus::Ignore => (&mut summary.ignored, "ignored".bright_yellow()),
            };
            println!("test {name} ... {status_str}",);
            res_type.push(name);
        });
    wrapped_summary.into_inner().unwrap()
}
/// Expectation for a panic case.
pub enum PanicExpectation {
    /// Accept any panic value.
    Any,
    /// Accept only this specific vector of panics.
    Exact(Vec<Felt252>),
}

/// Expectation for a result of a test.
pub enum TestExpectation {
    /// Running the test should not panic.
    Success,
    /// Running the test should result in a panic.
    Panics(PanicExpectation),
}
/// The configuration for running a single test.
pub struct TestConfig {
    /// The amount of gas the test requested.
    pub available_gas: Option<usize>,
    /// The expected result of the run.
    pub expectation: TestExpectation,
    /// Should the test be ignored.
    pub ignored: bool,
}
/// Finds the tests in the requested crates.
fn find_all_tests(
    db: &dyn SemanticGroup,
    main_crates: Vec<CrateId>,
) -> Vec<(FreeFunctionId, TestConfig)> {
    let mut tests = vec![];
    for crate_id in main_crates {
        let modules = db.crate_modules(crate_id);
        for module_id in modules.iter() {
            let Ok(module_items) = db.module_items(*module_id) else {
                continue;
            };
            tests.extend(
                module_items.iter().filter_map(|item| {
                    let ModuleItemId::FreeFunction(func_id) = item else { return None };
                    let Ok(attrs) = db.function_with_body_attributes(FunctionWithBodyId::Free(*func_id)) else { return None };
                    Some((*func_id, try_extract_test_config(db.upcast(), attrs).unwrap()?))
                }),
            );
        }
    }
    tests
}

/// Extracts the configuration of a tests from attributes, or returns the diagnostics if the
/// attributes are set illegally.
pub fn try_extract_test_config(
    db: &dyn SyntaxGroup,
    attrs: Vec<Attribute>,
) -> Result<Option<TestConfig>, Vec<PluginDiagnostic>> {
    let test_attr = attrs.iter().find(|attr| attr.id.as_str() == "test");
    let ignore_attr = attrs.iter().find(|attr| attr.id.as_str() == "ignore");
    let available_gas_attr = attrs
        .iter()
        .find(|attr| attr.id.as_str() == "available_gas");
    let should_panic_attr = attrs.iter().find(|attr| attr.id.as_str() == "should_panic");
    let mut diagnostics = vec![];
    if let Some(attr) = test_attr {
        if !attr.args.is_empty() {
            diagnostics.push(PluginDiagnostic {
                stable_ptr: attr.id_stable_ptr.untyped(),
                message: "Attribute should not have arguments.".into(),
            });
        }
    } else {
        for attr in [ignore_attr, available_gas_attr, should_panic_attr]
            .into_iter()
            .flatten()
        {
            diagnostics.push(PluginDiagnostic {
                stable_ptr: attr.id_stable_ptr.untyped(),
                message: "Attribute should only appear on tests.".into(),
            });
        }
    }
    let ignored = if let Some(attr) = ignore_attr {
        if !attr.args.is_empty() {
            diagnostics.push(PluginDiagnostic {
                stable_ptr: attr.id_stable_ptr.untyped(),
                message: "Attribute should not have arguments.".into(),
            });
        }
        true
    } else {
        false
    };
    let available_gas = if let Some(attr) = available_gas_attr {
        if let [AttributeArg {
            variant:
                AttributeArgVariant::Unnamed {
                    value: ast::Expr::Literal(literal),
                    ..
                },
            ..
        }] = &attr.args[..]
        {
            literal.token(db).text(db).parse::<usize>().ok()
        } else {
            diagnostics.push(PluginDiagnostic {
                stable_ptr: attr.id_stable_ptr.untyped(),
                message: "Attribute should have a single value argument.".into(),
            });
            None
        }
    } else {
        None
    };
    let (should_panic, expected_panic_value) = if let Some(attr) = should_panic_attr {
        if attr.args.is_empty() {
            (true, None)
        } else {
            (
                true,
                extract_panic_values(db, attr).on_none(|| {
                    diagnostics.push(PluginDiagnostic {
                        stable_ptr: attr.args_stable_ptr.untyped(),
                        message: "Expected panic must be of the form `expected = <tuple of \
                                  felt252s>`."
                            .into(),
                    });
                }),
            )
        }
    } else {
        (false, None)
    };
    if !diagnostics.is_empty() {
        return Err(diagnostics);
    }
    Ok(if test_attr.is_none() {
        None
    } else {
        Some(TestConfig {
            available_gas,
            expectation: if should_panic {
                TestExpectation::Panics(if let Some(values) = expected_panic_value {
                    PanicExpectation::Exact(values)
                } else {
                    PanicExpectation::Any
                })
            } else {
                TestExpectation::Success
            },
            ignored,
        })
    })
}
/// Tries to extract the relevant expected panic values.
fn extract_panic_values(db: &dyn SyntaxGroup, attr: &Attribute) -> Option<Vec<Felt252>> {
    let [
    AttributeArg {
        variant: AttributeArgVariant::Named { name, value: panics, .. },
        ..
    }
    ] = &attr.args[..] else {
        return None;
    };
    if name != "expected" {
        return None;
    }
    let ast::Expr::Tuple(panics) = panics else { return None };
    panics
        .expressions(db)
        .elements(db)
        .into_iter()
        .map(|value| match value {
            ast::Expr::Literal(literal) => {
                Some(literal.numeric_value(db).unwrap_or_default().into())
            }
            ast::Expr::ShortString(literal) => {
                Some(literal.numeric_value(db).unwrap_or_default().into())
            }
            _ => None,
        })
        .collect::<Option<Vec<_>>>()
}

/// Plugin to create diagnostics for tests attributes.
#[derive(Debug, Default)]
#[non_exhaustive]
pub struct TestPlugin;

impl MacroPlugin for TestPlugin {
    fn generate_code(&self, db: &dyn SyntaxGroup, item_ast: ast::Item) -> PluginResult {
        PluginResult {
            code: None,
            diagnostics: if let ast::Item::FreeFunction(free_func_ast) = item_ast {
                try_extract_test_config(db, free_func_ast.attributes(db).structurize(db)).err()
            } else {
                None
            }
            .unwrap_or_default(),
            remove_original_item: false,
        }
    }
}
