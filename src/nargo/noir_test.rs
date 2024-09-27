use acvm::{BlackBoxFunctionSolver, FieldElement};
use fm::FileManager;
use nargo::{errors::CompileError, ops::{report_errors, TestStatus}, package::Package, prepare_package};
use noirc_frontend::{graph::CrateId, hir::{Context, FunctionNameMatch, ParsedFiles}};
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
use std::{io::Write, path::PathBuf};

use noirc_driver::{check_crate, CompileOptions};


#[allow(clippy::too_many_arguments)]
pub fn run_tests<S: BlackBoxFunctionSolver<FieldElement> + Default>(
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
