//! Compiles and runs a Cairo program.

use std::path::Path;

use anyhow::{Context, Ok};
use cairo_lang_compiler::db::RootDatabase;
use cairo_lang_compiler::diagnostics::DiagnosticsReporter;
use cairo_lang_compiler::project::setup_project;
use cairo_lang_diagnostics::ToOption;
use cairo_lang_filesystem::db::init_dev_corelib;

use cairo_lang_runner::{SierraCasmRunner, StarknetState};

use cairo_lang_sierra::extensions::gas::{
    BuiltinCostWithdrawGasLibfunc, RedepositGasLibfunc, WithdrawGasLibfunc,
};
use cairo_lang_sierra::extensions::NamedLibfunc;
use cairo_lang_sierra_generator::db::SierraGenGroup;
use cairo_lang_sierra_generator::replace_ids::{DebugReplacer, SierraIdReplacer};
use cairo_lang_starknet::contract::get_contracts_info;

use clap::Parser;

const CORELIB_DIR_NAME: &str = "corelib/src";

/// Command line args parser.
/// Exits with 0/1 if the input is formatted correctly/incorrectly.
#[derive(Parser, Debug)]
#[clap(version, verbatim_doc_comment)]
pub struct Args {
    /// The file to compile and run.
    pub path: String,
    /// In cases where gas is available, the amount of provided gas.
    #[arg(long)]
    pub available_gas: Option<usize>,
    /// Whether to print the memory.
    #[arg(long, default_value_t = false)]
    pub print_full_memory: bool,
}

pub fn main() -> anyhow::Result<()> {
    let args = Args::parse();
    let res = run_cairo_program(&args);
    if let Err(e) = res {
        eprintln!("{e}");
        std::process::exit(1);
    }
    Ok(())
}

pub fn run_cairo_program(args: &Args) -> anyhow::Result<String> {
    let db = &mut RootDatabase::builder().detect_corelib().build()?;
    let mut corelib_dir = std::env::current_exe()
        .unwrap_or_else(|e| panic!("Problem getting the executable path: {e:?}"));
    corelib_dir.pop();
    corelib_dir.pop();
    corelib_dir.pop();
    corelib_dir.push(CORELIB_DIR_NAME);
    init_dev_corelib(db, corelib_dir);

    let main_crate_ids = setup_project(db, Path::new(&args.path))?;

    if DiagnosticsReporter::stderr().check(db) {
        anyhow::bail!("failed to compile: {}", args.path);
    }

    let mut ret_string = String::new();

    let sierra_program = db
        .get_sierra_program(main_crate_ids.clone())
        .to_option()
        .with_context(|| "Compilation failed without any diagnostics.")?;
    let replacer = DebugReplacer { db };
    if args.available_gas.is_none()
        && sierra_program.type_declarations.iter().any(|decl| {
            matches!(
                decl.long_id.generic_id.0.as_str(),
                WithdrawGasLibfunc::STR_ID
                    | BuiltinCostWithdrawGasLibfunc::STR_ID
                    | RedepositGasLibfunc::STR_ID
            )
        })
    {
        anyhow::bail!("Program requires gas counter, please provide `--available_gas` argument.");
    }

    let contracts_info = get_contracts_info(db, main_crate_ids, &replacer)?;

    let runner = SierraCasmRunner::new(
        replacer.apply(&sierra_program),
        if args.available_gas.is_some() {
            Some(Default::default())
        } else {
            None
        },
        contracts_info,
    )
    .with_context(|| "Failed setting up runner.")?;
    let result = runner
        .run_function_with_starknet_context(
            runner.find_function("::main")?,
            &[],
            args.available_gas,
            StarknetState::default(),
        )
        .with_context(|| "Failed to run the function.")?;
    match result.value {
        cairo_lang_runner::RunResultValue::Success(values) => ret_string
            .push_str(format!("Run completed successfully, returning {values:?}").as_str()),
        cairo_lang_runner::RunResultValue::Panic(values) => {
            ret_string.push_str(format!("Run panicked with err values: {values:?}").as_str());
        }
    }
    println!("{ret_string}");
    Ok(ret_string)
}
