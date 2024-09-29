use std::collections::BTreeMap;
use std::path::PathBuf;

use acvm::acir::native_types::WitnessStack;
use acvm::FieldElement;
use bn254_blackbox_solver::Bn254BlackBoxSolver;

use nargo::constants::PROVER_INPUT_FILE;
use nargo::ops::DefaultForeignCallExecutor;
use nargo::package::{self, Package};
use nargo::{
    insert_all_files_for_workspace_into_file_manager, parse_all, prepare_package, NargoError,
};
use nargo_toml::{get_package_manifest, resolve_workspace_from_toml, PackageSelection};
use noirc_abi::input_parser::{Format, InputValue};
use noirc_abi::InputMap;
use noirc_driver::{
    check_crate, compile_main, CompileOptions, CompiledProgram, NOIR_ARTIFACT_VERSION_STRING,
};

use anyhow::{bail, Result};

use super::read_inputs_from_file;

pub(crate) fn run() -> anyhow::Result<WitnessStack<FieldElement>> {
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
    check_crate(&mut context, crate_id, &CompileOptions::default())
        .expect("Any errors should have occurred when collecting test functions");

    let package = workspace.members.first().unwrap();
    let program: CompiledProgram =
        match compile_main(&mut context, crate_id, &CompileOptions::default(), None) {
            Result::Ok((program, _)) => program,
            Result::Err(_) => {
                bail!("Failed to compile the program")
            }
        };

    let (return_value, witness_stack) = execute_program_and_decode(
        program,
        None,
        Some(workspace.root_dir.clone()),
        Some(package.name.to_string()),
        &package,
    )?;

    println!("[{}] Circuit witness successfully solved", package.name);
    if let Some(return_value) = return_value {
        println!("[{}] Circuit output: {return_value:?}", package.name);
    }
    Ok(witness_stack)
}

fn execute_program_and_decode(
    program: CompiledProgram,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
    package: &package::Package,
) -> anyhow::Result<(Option<InputValue>, WitnessStack<FieldElement>)> {
    // Parse the initial witness values from Prover.toml
    let (inputs_map, _) =
        read_inputs_from_file(&package.root_dir, "Prover", Format::Toml, &program.abi)?;
    let witness_stack = execute_program(
        &program,
        &inputs_map,
        foreign_call_resolver_url,
        root_path,
        package_name,
    )?;
    // Get the entry point witness for the ABI
    let main_witness = &witness_stack
        .peek()
        .expect("Should have at least one witness on the stack")
        .witness;
    let (_, return_value) = program.abi.decode(main_witness)?;

    Ok((return_value, witness_stack))
}

pub(crate) fn execute_program(
    compiled_program: &CompiledProgram,
    inputs_map: &InputMap,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
) -> anyhow::Result<WitnessStack<FieldElement>> {
    let initial_witness = compiled_program.abi.encode(inputs_map, None)?;

    let solved_witness_stack_err = nargo::ops::execute_program(
        &compiled_program.program,
        initial_witness,
        &Bn254BlackBoxSolver,
        &mut DefaultForeignCallExecutor::new(
            true,
            foreign_call_resolver_url,
            root_path,
            package_name,
        ),
    );
    match solved_witness_stack_err {
        Ok(solved_witness_stack) => Ok(solved_witness_stack),
        Err(err) => {
            bail!("Failed to solve the circuit: {}", err)
        }
    }
}

#[test]
fn test_execute_program() {
    let _ = rayon::ThreadPoolBuilder::new()
        .stack_size(8 * 1024 * 1024)
        .build_global();

    run().unwrap();
}
