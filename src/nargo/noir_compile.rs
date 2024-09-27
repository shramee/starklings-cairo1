use std::error::Error;
use std::path::{Path, PathBuf};

use acvm::acir::circuit::ExpressionWidth;
use fm::FileManager;
use nargo::errors::CompileError;
use nargo::ops::{collect_errors, compile_contract, compile_program, report_errors};
use nargo::package::Package;
use nargo::workspace::Workspace;
use nargo::{insert_all_files_for_workspace_into_file_manager, parse_all};
use nargo_toml::{get_package_manifest, resolve_workspace_from_toml, PackageSelection};
use noirc_driver::DEFAULT_EXPRESSION_WIDTH;
use noirc_driver::NOIR_ARTIFACT_VERSION_STRING;
use noirc_driver::{CompilationResult, CompileOptions, CompiledContract};

use noirc_frontend::graph::CrateName;

use clap::Args;
use noirc_frontend::hir::ParsedFiles;

use rayon::prelude::*;

/// Compile the program and its secret execution trace into ACIR format
#[derive(Debug, Clone, Args)]
pub(crate) struct CompileCommand {
    /// The name of the package to compile
    #[clap(long, conflicts_with = "workspace")]
    package: Option<CrateName>,

    /// Compile all packages in the workspace.
    #[clap(long, conflicts_with = "package")]
    workspace: bool,

    #[clap(flatten)]
    compile_options: CompileOptions,

    /// Watch workspace and recompile on changes.
    #[clap(long, hide = true)]
    watch: bool,
}

pub(crate) fn run(args: CompileCommand) -> Result<(), Box<dyn Error>> {
    let program_dir = PathBuf::from(
        std::env::current_dir()
            .unwrap()
            .join("./runner_crate_noir_run"),
    );
    let toml_path = get_package_manifest(&program_dir)?;
    let default_selection = if args.workspace {
        PackageSelection::All
    } else {
        PackageSelection::DefaultOrAll
    };
    let selection = args
        .package
        .map_or(default_selection, PackageSelection::Selected);

    let workspace = resolve_workspace_from_toml(
        &toml_path,
        selection,
        Some(NOIR_ARTIFACT_VERSION_STRING.to_owned()),
    )?;

    compile_workspace_full(&workspace, &args.compile_options)?;

    Ok(())
}

pub(super) fn compile_workspace_full(
    workspace: &Workspace,
    compile_options: &CompileOptions,
) -> Result<(), CompileError> {
    let mut workspace_file_manager = workspace.new_file_manager();
    insert_all_files_for_workspace_into_file_manager(workspace, &mut workspace_file_manager);
    let parsed_files = parse_all(&workspace_file_manager);

    let compiled_workspace = compile_workspace(
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

fn compile_workspace(
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
    let program_warnings_or_errors: CompilationResult<()> = compile_programs(
        file_manager,
        parsed_files,
        workspace,
        &binary_packages,
        compile_options,
    );
    let contract_warnings_or_errors: CompilationResult<()> = compiled_contracts(
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

fn compile_programs(
    file_manager: &FileManager,
    parsed_files: &ParsedFiles,
    workspace: &Workspace,
    binary_packages: &[Package],
    compile_options: &CompileOptions,
) -> CompilationResult<()> {
    let compile_package = |package| {
        let (program, warnings) = compile_program(
            file_manager,
            parsed_files,
            workspace,
            package,
            compile_options,
            None,
        )?;

        let target_width =
            get_target_width(package.expression_width, compile_options.expression_width);

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

fn compiled_contracts(
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
                get_target_width(package.expression_width, compile_options.expression_width);
            let contract = nargo::ops::transform_contract(contract, target_width);
            Ok(((), warnings))
        })
        .collect();

    // Collate any warnings/errors which were encountered during compilation.
    collect_errors(contract_results).map(|(_, warnings)| ((), warnings))
}

/// If a target width was not specified in the CLI we can safely override the default.
pub(crate) fn get_target_width(
    package_default_width: Option<ExpressionWidth>,
    compile_options_width: Option<ExpressionWidth>,
) -> ExpressionWidth {
    if let (Some(manifest_default_width), None) = (package_default_width, compile_options_width) {
        manifest_default_width
    } else {
        compile_options_width.unwrap_or(DEFAULT_EXPRESSION_WIDTH)
    }
}
