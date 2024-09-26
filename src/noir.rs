use acvm::{BlackBoxFunctionSolver, FieldElement};
use anyhow::Context as _;
use bn254_blackbox_solver::Bn254BlackBoxSolver;
use cairo_lang_runner::{RunResultValue, SierraCasmRunner, StarknetState};
use cairo_lang_sierra::program::VersionedProgram;
use cairo_lang_test_plugin::{TestCompilation, TestCompilationMetadata};
use cairo_lang_test_runner::{CompiledTestRunner, RunProfilerConfig, TestRunConfig};
use camino::Utf8PathBuf;
use console::style;
use fm::FileManager;
use nargo::{errors::CompileError, insert_all_files_for_workspace_into_file_manager, ops::{report_errors, TestStatus}, package::Package, parse_all, prepare_package};
use nargo_toml::{get_package_manifest, resolve_workspace_from_toml, PackageSelection};
use noirc_frontend::{graph::CrateId, hir::{Context, FunctionNameMatch, ParsedFiles}};
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
use std::{env::current_dir, fs, io::Write, path::PathBuf};

use itertools::Itertools;
use scarb::{
    core::{Config, TargetKind},
    ops::{self, collect_metadata, CompileOpts, FeaturesOpts, FeaturesSelector, MetadataOptions},
};

use noirc_driver::{check_crate, CompileOptions, NOIR_ARTIFACT_VERSION_STRING};

const AVAILABLE_GAS: usize = 999999999;

// Prepares testing crate
// Copies the exercise file into testing crate
pub fn prepare_crate_for_exercise(file_path: &PathBuf) -> PathBuf {
    let crate_path = current_dir().unwrap().join(PathBuf::from("runner_crate_noir"));
    let src_dir = crate_path.join("src");
    if !src_dir.exists() {
        let _ = fs::create_dir(&src_dir);
    }
    let lib_path = src_dir.join("lib.nr");
    let file_path = current_dir().unwrap().join(file_path);

    match fs::copy(&file_path, &lib_path) {
        Ok(_) => {}
        Err(err) => panic!("Error occurred while preparing the exercise,\nExercise: {file_path:?}\nLib path: {lib_path:?}\n{err:?}"),
    };
    crate_path
}

// Builds the testing crate with scarb
pub fn scarb_build(file_path: &PathBuf) -> anyhow::Result<String> {
    let crate_path = prepare_crate_for_exercise(file_path);
    let config = nargo_config(crate_path);

    match compile(&config, false) {
        Ok(_) => Ok("".into()),
        Err(_) => anyhow::bail!("Couldn't build the exercise..."),
    }
}

// Runs the crate with noir
pub fn nargo_run(file_path: &PathBuf) -> anyhow::Result<String> {
    let crate_path = prepare_crate_for_exercise(file_path);
    let config = nargo_config(crate_path);

    let ws = ops::read_workspace(config.manifest_path(), &config)?;

    // Compile before running tests, with test targets true
    compile(&config, false)?;

    println!(
        "   {} {}\n",
        style("Running").green().bold(),
        file_path.to_str().unwrap()
    );

    let metadata = collect_metadata(
        &MetadataOptions {
            version: 1,
            no_deps: false,
            features: FeaturesOpts {
                features: FeaturesSelector::AllFeatures,
                no_default_features: false,
            },
        },
        &ws,
    )?;

    let profile = "dev";
    let default_target_dir = metadata.runtime_manifest.join("target");

    let target_dir = metadata
        .target_dir
        .clone()
        .unwrap_or(default_target_dir)
        .join(profile);

    // Process 'exercise_crate' targets
    // Largely same as this
    // https://github.com/software-mansion/scarb/blob/v2.5.3/extensions/scarb-cairo-run/src/main.rs#L61
    for package in metadata.packages.iter() {
        if package.name != "exercise_crate" {
            continue;
        }
        // Loop through targets and run compiled file tests
        for target in package.targets.iter() {
            // Skip test targets
            if target.kind == "test" {
                continue;
            }

            let file_path = target_dir.join(format!("{}.sierra.json", target.name.clone()));

            assert!(
                file_path.exists(),
                "File {file_path} missing, please compile the project."
            );

            let sierra_program = serde_json::from_str::<VersionedProgram>(
                &fs::read_to_string(file_path.clone())
                    .with_context(|| format!("failed to read Sierra file: {file_path}"))?,
            )
            .with_context(|| format!("failed to deserialize Sierra program: {file_path}"))?
            .into_v1()
            .with_context(|| format!("failed to load Sierra program: {file_path}"))?;

            let runner = SierraCasmRunner::new(
                sierra_program.program,
                Some(Default::default()),
                Default::default(),
                None,
            )?;

            let result = runner
                .run_function_with_starknet_context(
                    runner.find_function("::main")?,
                    &[],
                    Some(AVAILABLE_GAS),
                    StarknetState::default(),
                )
                .context("failed to run the function")?;

            return match result.value {
                RunResultValue::Success(return_val) => {
                    Ok(return_val.iter().map(|el| el.to_string()).join(","))
                }
                RunResultValue::Panic(error) => {
                    anyhow::bail!(format!("error running the code, {:?}", error))
                }
            };
        }
    }

    Ok("".into())
}

// Runs tests on the testing crate with nargo
pub fn nargo_test(file_path: &PathBuf) -> anyhow::Result<String> {
    let crate_path = prepare_crate_for_exercise(file_path);
    let config = nargo_config(crate_path);

    // let ws = ops::read_workspace(config.manifest_path(), &config)?;
    let path = PathBuf::from(std::env::current_dir().unwrap().join("./runner_crate_noir"));
    let toml_path = get_package_manifest(&path)?;
    let workspace = resolve_workspace_from_toml(
        &toml_path,
        PackageSelection::DefaultOrAll,
        Some(NOIR_ARTIFACT_VERSION_STRING.to_string()),
    )?;

    rayon::ThreadPoolBuilder::new()
    .stack_size(8 * 1024 * 1024)
    .build_global()?;

    let mut workspace_file_manager = workspace.new_file_manager();
    insert_all_files_for_workspace_into_file_manager(&workspace, &mut workspace_file_manager);
    let parsed_files = parse_all(&workspace_file_manager);

    let pattern = FunctionNameMatch::Anything;

    workspace.into_iter()
            .filter(|package| package.name.to_string() == "exercise_crate")
            .map(|package| {
                run_tests::<Bn254BlackBoxSolver>(
                    &workspace_file_manager,
                    &parsed_files,
                    package,
                    pattern,
                    false,
                    None,
                    Some(workspace.root_dir.clone()),
                    Some(package.name.to_string()),
                    &CompileOptions::default(),
                )
            })
            .collect::<Result<Vec<_>, _>>();

    anyhow::Ok("".into())
}

fn deserialize_test_compilation(
    target_dir: &Utf8PathBuf,
    name: String,
) -> anyhow::Result<TestCompilation> {
    let file_path = target_dir.join(format!("{}.test.json", name));
    let test_comp_metadata = serde_json::from_str::<TestCompilationMetadata>(
        &fs::read_to_string(file_path.clone())
            .with_context(|| format!("failed to read file: {file_path}"))?,
    )
    .with_context(|| format!("failed to deserialize compiled tests metadata file: {file_path}"))?;

    let file_path = target_dir.join(format!("{}.test.sierra.json", name));
    let sierra_program = serde_json::from_str::<VersionedProgram>(
        &fs::read_to_string(file_path.clone())
            .with_context(|| format!("failed to read file: {file_path}"))?,
    )
    .with_context(|| format!("failed to deserialize compiled tests sierra file: {file_path}"))?;

    Ok(TestCompilation {
        sierra_program: sierra_program.into_v1()?,
        metadata: test_comp_metadata,
    })
}

// Prepares noir config for exercise runner crate
pub fn nargo_config(crate_path: PathBuf) -> Config {
    let path = Utf8PathBuf::from_path_buf(crate_path.join(PathBuf::from("Nargo.toml"))).unwrap();

    Config::builder(path).build().unwrap()
}

// Compiles runner crate for build/test exercises
pub fn compile(config: &Config, test_targets: bool) -> anyhow::Result<()> {
    let ws = ops::read_workspace(config.manifest_path(), config)?;
    let opts: CompileOpts = match test_targets {
        false => CompileOpts {
            include_target_names: vec![],
            include_target_kinds: vec![],
            exclude_target_kinds: vec![TargetKind::TEST],
            features: FeaturesOpts {
                features: FeaturesSelector::AllFeatures,
                no_default_features: false,
            },
        },
        true => CompileOpts {
            include_target_names: vec![],
            include_target_kinds: vec![TargetKind::TEST],
            exclude_target_kinds: vec![],
            features: FeaturesOpts {
                features: FeaturesSelector::AllFeatures,
                no_default_features: false,
            },
        },
    };

    let packages = ws.members().map(|p| p.id).collect();

    ops::compile(packages, opts, &ws)
}

#[allow(clippy::too_many_arguments)]
fn run_tests<S: BlackBoxFunctionSolver<FieldElement> + Default>(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    package: &Package,
    fn_name: FunctionNameMatch,
    show_output: bool,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
    compile_options: &CompileOptions,
) -> Result<Vec<(String, TestStatus)>, CompileError> {
    let test_functions = get_tests_in_package(
        file_manager,
        parsed_files,
        package,
        fn_name,
        compile_options,
    )?;

    let count_all = test_functions.len();

    let plural = if count_all == 1 { "" } else { "s" };
    println!(
        "[{}] Running {count_all} test function{plural}",
        package.name
    );

    let test_report: Vec<(String, TestStatus)> = test_functions
        .into_iter()
        .map(|test_name| {
            let status = run_test::<S>(
                file_manager,
                parsed_files,
                package,
                &test_name,
                show_output,
                foreign_call_resolver_url,
                root_path.clone(),
                package_name.clone(),
                compile_options,
            );

            (test_name, status)
        })
        .collect();

    display_test_report(file_manager, package, compile_options, &test_report)?;
    Ok(test_report)
}

fn run_test<S: BlackBoxFunctionSolver<FieldElement> + Default>(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    package: &Package,
    fn_name: &str,
    show_output: bool,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
    compile_options: &CompileOptions,
) -> TestStatus {
    // This is really hacky but we can't share `Context` or `S` across threads.
    // We then need to construct a separate copy for each test.

    let (mut context, crate_id) = prepare_package(file_manager, parsed_files, package);
    check_crate(&mut context, crate_id, compile_options)
        .expect("Any errors should have occurred when collecting test functions");

    let test_functions = context
        .get_all_test_functions_in_crate_matching(&crate_id, FunctionNameMatch::Exact(fn_name));
    let (_, test_function) = test_functions.first().expect("Test function should exist");

    let blackbox_solver = S::default();

    nargo::ops::run_test(
        &blackbox_solver,
        &mut context,
        test_function,
        show_output,
        foreign_call_resolver_url,
        root_path,
        package_name,
        compile_options,
    )
}

fn get_tests_in_package(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    package: &Package,
    fn_name: FunctionNameMatch,
    options: &CompileOptions,
) -> Result<Vec<String>, CompileError> {
    let (mut context, crate_id) = prepare_package(file_manager, parsed_files, package);
    check_crate_and_report_errors(&mut context, crate_id, options)?;

    Ok(context
        .get_all_test_functions_in_crate_matching(&crate_id, fn_name)
        .into_iter()
        .map(|(test_name, _)| test_name)
        .collect())
}

fn display_test_report(
    file_manager: &FileManager,
    package: &Package,
    compile_options: &CompileOptions,
    test_report: &[(String, TestStatus)],
) -> Result<(), CompileError> {
    let writer = StandardStream::stderr(ColorChoice::Always);
    let mut writer = writer.lock();

    for (test_name, test_status) in test_report {
        write!(writer, "[{}] Testing {test_name}... ", package.name)
            .expect("Failed to write to stderr");
        writer.flush().expect("Failed to flush writer");

        match &test_status {
            TestStatus::Pass { .. } => {
                writer
                    .set_color(ColorSpec::new().set_fg(Some(Color::Green)))
                    .expect("Failed to set color");
                writeln!(writer, "ok").expect("Failed to write to stderr");
            }
            TestStatus::Fail {
                message,
                error_diagnostic,
            } => {
                writer
                    .set_color(ColorSpec::new().set_fg(Some(Color::Red)))
                    .expect("Failed to set color");
                writeln!(writer, "FAIL\n{message}\n").expect("Failed to write to stderr");
                if let Some(diag) = error_diagnostic {
                    noirc_errors::reporter::report_all(
                        file_manager.as_file_map(),
                        &[diag.clone()],
                        compile_options.deny_warnings,
                        compile_options.silence_warnings,
                    );
                }
            }
            TestStatus::CompileError(err) => {
                noirc_errors::reporter::report_all(
                    file_manager.as_file_map(),
                    &[err.clone()],
                    compile_options.deny_warnings,
                    compile_options.silence_warnings,
                );
            }
        }
        writer.reset().expect("Failed to reset writer");
    }

    write!(writer, "[{}] ", package.name).expect("Failed to write to stderr");

    let count_all = test_report.len();
    let count_failed = test_report
        .iter()
        .filter(|(_, status)| status.failed())
        .count();
    let plural = if count_all == 1 { "" } else { "s" };
    if count_failed == 0 {
        writer
            .set_color(ColorSpec::new().set_fg(Some(Color::Green)))
            .expect("Failed to set color");
        write!(writer, "{count_all} test{plural} passed").expect("Failed to write to stderr");
        writer.reset().expect("Failed to reset writer");
        writeln!(writer).expect("Failed to write to stderr");
    } else {
        let count_passed = count_all - count_failed;
        let plural_failed = if count_failed == 1 { "" } else { "s" };
        let plural_passed = if count_passed == 1 { "" } else { "s" };

        if count_passed != 0 {
            writer
                .set_color(ColorSpec::new().set_fg(Some(Color::Green)))
                .expect("Failed to set color");
            write!(writer, "{count_passed} test{plural_passed} passed, ",)
                .expect("Failed to write to stderr");
        }

        writer
            .set_color(ColorSpec::new().set_fg(Some(Color::Red)))
            .expect("Failed to set color");
        writeln!(writer, "{count_failed} test{plural_failed} failed")
            .expect("Failed to write to stderr");
        writer.reset().expect("Failed to reset writer");
    }

    Ok(())
}

/// Run the lexing, parsing, name resolution, and type checking passes and report any warnings
/// and errors found.
pub(crate) fn check_crate_and_report_errors(
    context: &mut Context,
    crate_id: CrateId,
    options: &CompileOptions,
) -> Result<(), CompileError> {
    let result = check_crate(context, crate_id, options);
    report_errors(
        result,
        &context.file_manager,
        options.deny_warnings,
        options.silence_warnings,
    )
}
