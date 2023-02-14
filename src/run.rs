use std::process::Command;

use crate::exercise::{Exercise, Mode};
use indicatif::ProgressBar;

// Invoke the rust compiler on the path of the given exercise,
// and run the ensuing binary.
// The verbose argument helps determine whether or not to show
// the output from the test harnesses (if the mode of the exercise is test)
pub fn run(exercise: &Exercise) -> Result<(), ()> {
    match exercise.mode {
        Mode::Compile => run_cairo(exercise)?,
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
    let progress_bar = ProgressBar::new_spinner();
    progress_bar.set_message(format!("Running {exercise}..."));
    progress_bar.enable_steady_tick(100);
    let output = exercise.run_cairo();

    if output.stderr.len() > 0 {
        progress_bar.finish_and_clear();
        println!("Err");
        println!("{}", String::from_utf8(output.stderr).unwrap());

        println!("Normal");
        println!("{}", String::from_utf8(output.stdout).unwrap());
        Err(())
    } else {
        println!("{}", String::from_utf8(output.stdout).unwrap());
        success!("Successfully ran {}", exercise);
        Ok(())
    }
}

// Invoke the rust compiler on the path of the given exercise
// and run the ensuing binary.
// This is strictly for non-test binaries, so output is displayed
fn test_cairo(exercise: &Exercise) -> Result<(), ()> {
    let progress_bar = ProgressBar::new_spinner();
    progress_bar.set_message(format!("Running {exercise}..."));
    progress_bar.enable_steady_tick(100);
    let output = exercise.test_cairo();

    if output.stderr.len() > 0 {
        progress_bar.finish_and_clear();
        println!("Err");
        println!("{}", String::from_utf8(output.stderr).unwrap());

        println!("Normal");
        println!("{}", String::from_utf8(output.stdout).unwrap());
        Err(())
    } else {
        println!("{}", String::from_utf8(output.stdout).unwrap());
        success!("Successfully ran {}", exercise);
        Ok(())
    }
}
