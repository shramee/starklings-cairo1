use std::path::PathBuf;

use anyhow::bail;
use nargo::{insert_all_files_for_workspace_into_file_manager, parse_all, prepare_package};
use nargo_toml::{get_package_manifest, resolve_workspace_from_toml, PackageSelection};
use noirc_driver::{check_crate, CompileOptions, NOIR_ARTIFACT_VERSION_STRING};

pub(crate) fn compile() -> anyhow::Result<()> {
    let program_dir = PathBuf::from(std::env::current_dir().unwrap().join("./runner_crate_noir"));
    let toml_path = get_package_manifest(&program_dir)?;
    let workspace = resolve_workspace_from_toml(
        &toml_path,
        PackageSelection::DefaultOrAll,
        Some(NOIR_ARTIFACT_VERSION_STRING.to_string()),
    )?;

    let mut workspace_file_manager = workspace.new_file_manager();
    insert_all_files_for_workspace_into_file_manager(&workspace, &mut workspace_file_manager);
    let parsed_files = parse_all(&workspace_file_manager);

    let package = workspace.members.first().unwrap();

    let (mut context, crate_id) = prepare_package(&workspace_file_manager, &parsed_files, package);
    match check_crate(&mut context, crate_id, &CompileOptions::default()) {
        Ok(_) => Ok(()),
        Err(err) => {
            bail!("Failed to check crate: {:?}", err);
        }
    }
}

#[test]
fn test_compile_program() {
    let _ = rayon::ThreadPoolBuilder::new()
        .stack_size(8 * 1024 * 1024)
        .build_global();

    compile().unwrap();
}
