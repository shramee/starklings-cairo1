use std::path::Path;

use acvm::acir::circuit::ExpressionWidth;
use fm::FileManager;
use nargo::{
    insert_all_files_for_workspace_into_file_manager,
    ops::{collect_errors, compile_contract, compile_program, report_errors},
    package::Package,
    parse_all,
    workspace::Workspace,
};
use noirc_driver::{
    CompilationResult, CompileOptions, CompiledContract, NOIR_ARTIFACT_VERSION_STRING,
};
use noirc_frontend::hir::ParsedFiles;
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

use super::{read_program_from_file, save_contract_to_file, save_program_to_file};

pub fn cli_compile_workspace_full(
    workspace: &Workspace,
    compile_options: &CompileOptions,
) -> Result<(), anyhow::Error> {
    let mut workspace_file_manager = workspace.new_file_manager();
    insert_all_files_for_workspace_into_file_manager(workspace, &mut workspace_file_manager);
    let parsed_files = parse_all(&workspace_file_manager);

    let compiled_workspace = cli_compile_workspace(
        &workspace_file_manager,
        &parsed_files,
        workspace,
        compile_options,
    );

    report_errors(
        compiled_workspace,
        &workspace_file_manager,
        compile_options.deny_warnings,
        compile_options.silence_warnings,
    )?;

    Ok(())
}

fn cli_compile_workspace(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    workspace: &Workspace,
    compile_options: &CompileOptions,
) -> CompilationResult<()> {
    let (binary_packages, contract_packages): (Vec<_>, Vec<_>) = workspace
        .into_iter()
        .filter(|package| !package.is_library())
        .cloned()
        .partition(|package| package.is_binary());

    // Compile all of the packages in parallel.
    let program_warnings_or_errors: CompilationResult<()> = cli_compile_programs(
        file_manager,
        parsed_files,
        workspace,
        &binary_packages,
        compile_options,
    );
    let contract_warnings_or_errors: CompilationResult<()> = cli_compiled_contracts(
        file_manager,
        parsed_files,
        &contract_packages,
        compile_options,
        &workspace.target_directory_path(),
    );

    match (program_warnings_or_errors, contract_warnings_or_errors) {
        (Ok((_, program_warnings)), Ok((_, contract_warnings))) => {
            let warnings = [program_warnings, contract_warnings].concat();
            Ok(((), warnings))
        }
        (Err(program_errors), Err(contract_errors)) => {
            Err([program_errors, contract_errors].concat())
        }
        (Err(errors), _) | (_, Err(errors)) => Err(errors),
    }
}

fn cli_compile_programs(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    workspace: &Workspace,
    binary_packages: &[Package],
    compile_options: &CompileOptions,
) -> CompilationResult<()> {
    let load_cached_program = |package| {
        let program_artifact_path = workspace.package_build_path(package);
        read_program_from_file(program_artifact_path)
            .ok()
            .filter(|p| p.noir_version == NOIR_ARTIFACT_VERSION_STRING)
            .map(|p| p.into())
    };

    let compile_package = |package| {
        let (program, warnings) = compile_program(
            file_manager,
            parsed_files,
            workspace,
            package,
            compile_options,
            load_cached_program(package),
        )?;

        let target_width =
            cli_get_target_width(package.expression_width, compile_options.expression_width);
        let program = nargo::ops::transform_program(program, target_width);

        save_program_to_file(
            &program.into(),
            &package.name,
            workspace.target_directory_path(),
        );

        Ok(((), warnings))
    };

    // Configure a thread pool with a larger stack size to prevent overflowing stack in large programs.
    // Default is 2MB.
    let pool = rayon::ThreadPoolBuilder::new()
        .stack_size(4 * 1024 * 1024)
        .build()
        .unwrap();
    let program_results: Vec<CompilationResult<()>> =
        pool.install(|| binary_packages.par_iter().map(compile_package).collect());

    // Collate any warnings/errors which were encountered during compilation.
    collect_errors(program_results).map(|(_, warnings)| ((), warnings))
}

fn cli_compiled_contracts(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    contract_packages: &[Package],
    compile_options: &CompileOptions,
    target_dir: &Path,
) -> CompilationResult<()> {
    let contract_results: Vec<CompilationResult<()>> = contract_packages
        .par_iter()
        .map(|package| {
            let (contract, warnings) =
                compile_contract(file_manager, parsed_files, package, compile_options)?;
            let target_width =
                cli_get_target_width(package.expression_width, compile_options.expression_width);
            let contract = nargo::ops::transform_contract(contract, target_width);
            cli_save_contract(
                contract,
                package,
                target_dir,
                compile_options.show_artifact_paths,
            );
            Ok(((), warnings))
        })
        .collect();

    // Collate any warnings/errors which were encountered during compilation.
    collect_errors(contract_results).map(|(_, warnings)| ((), warnings))
}

fn cli_save_contract(
    contract: CompiledContract,
    package: &Package,
    target_dir: &Path,
    show_artifact_paths: bool,
) {
    let contract_name = contract.name.clone();
    let artifact_path = save_contract_to_file(
        &contract.into(),
        &format!("{}-{}", package.name, contract_name),
        target_dir,
    );
    if show_artifact_paths {
        println!("Saved contract artifact to: {}", artifact_path.display());
    }
}

/// Default expression width used for Noir compilation.
/// The ACVM native type `ExpressionWidth` has its own default which should always be unbounded,
/// while we can sometimes expect the compilation target width to change.
/// Thus, we set it separately here rather than trying to alter the default derivation of the type.
pub const DEFAULT_EXPRESSION_WIDTH: ExpressionWidth = ExpressionWidth::Bounded { width: 4 };

/// If a target width was not specified in the CLI we can safely override the default.
pub(crate) fn cli_get_target_width(
    package_default_width: Option<ExpressionWidth>,
    compile_options_width: Option<ExpressionWidth>,
) -> ExpressionWidth {
    if let (Some(manifest_default_width), None) = (package_default_width, compile_options_width) {
        manifest_default_width
    } else {
        compile_options_width.unwrap_or(DEFAULT_EXPRESSION_WIDTH)
    }
}
