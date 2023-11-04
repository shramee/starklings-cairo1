use std::process::Command;

use crate::exercise::{Exercise, Mode};

// Invoke the rust compiler on the path of the given exercise,
// and run the ensuing binary.
// The verbose argument helps determine whether or not to show
// the output from the test harnesses (if the mode of the exercise is test)
pub fn run(exercise: &Exercise) -> Result<(), ()> {
    match exercise.mode {
        Mode::Build => run_cairo(exercise)?,
        Mode::Test => test_cairo(exercise)?,
    }
    Ok(())
}

// Resets the exercise by stashing the changes.
pub fn reset(exercise: &Exercise) -> Result<(), ()> {
    let command = Command::new("git")
        .args(["stash", "--"])
        .arg(&exercise.path)
        .spawn();

    match command {
        Ok(_) => Ok(()),
        Err(_) => Err(()),
    }
}

// Invoke the rust compiler on the path of the given exercise
// and run the ensuing binary.
// This is strictly for non-test binaries, so output is displayed
fn run_cairo(exercise: &Exercise) -> Result<(), ()> {
    println!("\nRunning {exercise}...\n");
    let output = exercise.build();

    if let Some(error) = output.as_ref().err() {
        println!("{error}");
        Err(())
    } else {
        let message = output.unwrap();
        println!("{message}");
        success!("Successfully built {}", exercise);
        Ok(())
    }
}

// Invoke the rust compiler on the path of the given exercise
// and run the ensuing binary.
// This is strictly for non-test binaries, so output is displayed
fn test_cairo(exercise: &Exercise) -> Result<(), ()> {
    println!("\nTesting {exercise}...\n");
    let output = exercise.test();

    if let Some(error) = output.as_ref().err() {
        println!("{error}");
        Err(())
    } else {
        let message = output.unwrap();
        println!("{message}");
        success!("Successfully built {}", exercise);
        Ok(())
    }
}
