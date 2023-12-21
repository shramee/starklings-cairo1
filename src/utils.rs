use console::style;

use crate::exercise::{Exercise, Mode};
// use crate::ui::progress;

// Build the given Exercise and return an object with information
// about the state of the compilation
pub fn build_exercise(exercise: &Exercise) -> Result<String, ()> {
    progress!("Building {} exercise...", exercise);

    let compilation_result = exercise.build();

    if let Err(error) = compilation_result {
        eprintln!("{error}");

        warn!("Compiling of {} failed! Please try again.", exercise);
        Err(())
    } else {
        Ok(compilation_result.unwrap())
    }
}

// Build the given Exercise and return an object with information
// about the state of the compilation
pub fn run_exercise(exercise: &Exercise) -> Result<String, ()> {
    progress!("Running {} exercise...", exercise);

    let compilation_result = exercise.run();

    if let Err(error) = compilation_result {
        eprintln!("{error}");

        warn!("Failed to run {}! Please try again.", exercise);
        Err(())
    } else {
        Ok(compilation_result.unwrap())
    }
}

// Tests the given Exercise and return an object with information
// about the state of the tests
pub fn test_exercise(exercise: &Exercise) -> Result<String, ()> {
    progress!("Testing {} exercise...", exercise);

    let compilation_result = exercise.test();

    if let Some(error) = compilation_result.as_ref().err() {
        warn!(
            "Testing of {} failed! Please try again. Here's the output:",
            exercise
        );
        println!("{error}");
        Err(())
    } else {
        Ok(compilation_result.unwrap())
    }
}

pub fn print_exercise_output(exercise_output: String) {
    if exercise_output.len() > 0 {
        println!("    {} {exercise_output}", style("Output").green().bold());
    }
}

pub fn print_exercise_success(exercise: &Exercise) {
    match exercise.mode {
        Mode::Build => success!("Successfully built {}!", exercise),
        Mode::Run => success!("Successfully ran {}!", exercise),
        Mode::Test => success!("Successfully tested {}!", exercise),
    }
}
