use acvm::acir::native_types::WitnessStackError;
use noirc_abi::errors::InputParserError;
use std::path::PathBuf;
use thiserror::Error;

#[derive(Debug, Error)]
pub(crate) enum FilesystemError {
    #[error("Error: {} is not a valid path\nRun either `nargo compile` to generate missing build artifacts or `nargo prove` to construct a proof", .0.display())]
    PathNotValid(PathBuf),

    #[error(
        " Error: cannot find {0}.toml file.\n Expected location: {1:?} \n Please generate this file at the expected location."
    )]
    MissingTomlFile(String, PathBuf),

    /// Input parsing error
    #[error(transparent)]
    InputParserError(#[from] InputParserError),

    /// WitnessStack serialization error
    #[error(transparent)]
    WitnessStackSerialization(#[from] WitnessStackError),

    #[error("Error: could not deserialize build program: {0}")]
    ProgramSerializationError(String),
}