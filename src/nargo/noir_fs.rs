use acvm::{acir::native_types::WitnessStack, FieldElement};
use nargo::constants::WITNESS_EXT;
use noirc_abi::{
    input_parser::{Format, InputValue},
    Abi, InputMap, MAIN_RETURN_NAME,
};
use noirc_artifacts::{contract::ContractArtifact, program::ProgramArtifact};
use noirc_frontend::graph::CrateName;
use std::{collections::BTreeMap, fs::File, io::Write, path::{Path, PathBuf}};

use super::FilesystemError;


/// Returns the circuit's parameters and its return value, if one exists.
/// # Examples
///
/// ```ignore
/// let (input_map, return_value): (InputMap, Option<InputValue>) =
///   read_inputs_from_file(path, "Verifier", Format::Toml, &abi)?;
/// ```
pub(crate) fn read_inputs_from_file<P: AsRef<Path>>(
    path: P,
    file_name: &str,
    format: Format,
    abi: &Abi,
) -> Result<(InputMap, Option<InputValue>), FilesystemError> {
    if abi.is_empty() {
        return Ok((BTreeMap::new(), None));
    }

    let file_path = path.as_ref().join(file_name).with_extension(format.ext());
    if !file_path.exists() {
        if abi.parameters.is_empty() {
            // Reading a return value from the `Prover.toml` is optional,
            // so if the ABI has no parameters we can skip reading the file if it doesn't exist.
            return Ok((BTreeMap::new(), None));
        } else {
            return Err(FilesystemError::MissingTomlFile(file_name.to_owned(), file_path));
        }
    }

    let input_string = std::fs::read_to_string(file_path).unwrap();
    let mut input_map = format.parse(&input_string, abi)?;
    let return_value = input_map.remove(MAIN_RETURN_NAME);

    Ok((input_map, return_value))
}


pub(crate) fn read_program_from_file<P: AsRef<Path>>(
    circuit_path: P,
) -> Result<ProgramArtifact, FilesystemError> {
    let file_path = circuit_path.as_ref().with_extension("json");

    let input_string =
        std::fs::read(&file_path).map_err(|_| FilesystemError::PathNotValid(file_path))?;
    let program = serde_json::from_slice(&input_string)
        .map_err(|err| FilesystemError::ProgramSerializationError(err.to_string()))?;

    Ok(program)
}


pub(crate) fn save_program_to_file<P: AsRef<Path>>(
    program_artifact: &ProgramArtifact,
    crate_name: &CrateName,
    circuit_dir: P,
) -> PathBuf {
    let circuit_name: String = crate_name.into();
    save_build_artifact_to_file(program_artifact, &circuit_name, circuit_dir)
}

pub(crate) fn save_contract_to_file<P: AsRef<Path>>(
    compiled_contract: &ContractArtifact,
    circuit_name: &str,
    circuit_dir: P,
) -> PathBuf {
    save_build_artifact_to_file(compiled_contract, circuit_name, circuit_dir)
}


fn save_build_artifact_to_file<P: AsRef<Path>, T: ?Sized + serde::Serialize>(
    build_artifact: &T,
    artifact_name: &str,
    circuit_dir: P,
) -> PathBuf {
    create_named_dir(circuit_dir.as_ref(), "target");
    let circuit_path = circuit_dir.as_ref().join(artifact_name).with_extension("json");
    write_to_file(&serde_json::to_vec(build_artifact).unwrap(), &circuit_path);

    circuit_path
}



pub(super) fn create_named_dir(named_dir: &Path, name: &str) -> PathBuf {
    std::fs::create_dir_all(named_dir)
        .unwrap_or_else(|_| panic!("could not create the `{name}` directory"));

    PathBuf::from(named_dir)
}

pub(super) fn write_to_file(bytes: &[u8], path: &Path) -> String {
    let display = path.display();

    let mut file = match File::create(path) {
        Err(why) => panic!("couldn't create {display}: {why}"),
        Ok(file) => file,
    };

    match file.write_all(bytes) {
        Err(why) => panic!("couldn't write to {display}: {why}"),
        Ok(_) => display.to_string(),
    }
}

pub(crate) fn save_witness_to_dir<P: AsRef<Path>>(
    witness_stack: WitnessStack<FieldElement>,
    witness_name: &str,
    witness_dir: P,
) -> Result<PathBuf, FilesystemError> {
    create_named_dir(witness_dir.as_ref(), "witness");
    let witness_path = witness_dir.as_ref().join(witness_name).with_extension(WITNESS_EXT);

    let buf: Vec<u8> = witness_stack.try_into()?;

    write_to_file(buf.as_slice(), &witness_path);

    Ok(witness_path)
}