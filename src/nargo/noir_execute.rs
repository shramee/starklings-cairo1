use std::path::PathBuf;

use acvm::{acir::native_types::WitnessStack, FieldElement};
use bn254_blackbox_solver::Bn254BlackBoxSolver;
use nargo::{errors::try_to_diagnose_runtime_error, ops::DefaultForeignCallExecutor, package::Package};
use noirc_abi::{input_parser::{Format, InputValue}, InputMap};
use noirc_artifacts::debug::DebugArtifact;
use noirc_driver::CompiledProgram;
use anyhow::Error;

use super::read_inputs_from_file;


pub fn execute_program_and_decode(
    program: CompiledProgram,
    package: &Package,
    prover_name: &str,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
) -> Result<(Option<InputValue>, WitnessStack<FieldElement>), Error> {
    // Parse the initial witness values from Prover.toml
    let (inputs_map, _) =
        read_inputs_from_file(&package.root_dir, prover_name, Format::Toml, &program.abi)?;
    let witness_stack =
        execute_program(&program, &inputs_map, foreign_call_resolver_url, root_path, package_name)?;
    // Get the entry point witness for the ABI
    let main_witness =
        &witness_stack.peek().expect("Should have at least one witness on the stack").witness;
    let (_, return_value) = program.abi.decode(main_witness)?;

    Ok((return_value, witness_stack))
}

pub(crate) fn execute_program(
    compiled_program: &CompiledProgram,
    inputs_map: &InputMap,
    foreign_call_resolver_url: Option<&str>,
    root_path: Option<PathBuf>,
    package_name: Option<String>,
) -> Result<WitnessStack<FieldElement>, Error> {
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
            let debug_artifact = DebugArtifact {
                debug_symbols: compiled_program.debug.clone(),
                file_map: compiled_program.file_map.clone(),
            };

            if let Some(diagnostic) =
                try_to_diagnose_runtime_error(&err, &compiled_program.abi, &compiled_program.debug)
            {
                diagnostic.report(&debug_artifact, false);
            }

            Err(anyhow::Error::new(err))
        }
    }
}
