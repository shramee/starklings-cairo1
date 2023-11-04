use crate::{
    clear_screen,
    exercise::{Exercise, Mode, State},
};
use console::style;
use indicatif::{ProgressBar, ProgressStyle};
use std::env;

// Verify that the provided container of Exercise objects
// can be compiled and run without any failures.
// Any such failures will be reported to the end user.
// If the Exercise being verified is a test, the verbose boolean
// determines whether or not the test harness outputs are displayed.
pub fn verify<'a>(
    exercises: impl IntoIterator<Item = &'a Exercise>,
    progress: (usize, usize),
) -> Result<(), &'a Exercise> {
    let (mut num_done, total) = progress;
    for exercise in exercises {
        clear_screen();
        let bar = ProgressBar::new(total as u64);
        bar.set_style(
            ProgressStyle::default_bar()
                .template("Progress: [{bar:60.green/red}] {pos}/{len} {msg}\n")
                .progress_chars("#>-"),
        );
        bar.set_position(num_done as u64);
        let compile_result = match exercise.mode {
            Mode::Build => compile_and_run_interactively(exercise),
            Mode::Test => compile_and_test_interactively(exercise),
        };
        if !compile_result.unwrap_or(false) {
            return Err(exercise);
        }
        let percentage = num_done as f32 / total as f32 * 100.0;
        bar.set_message(format!("({percentage:.1} %)"));
        num_done += 1;
    }
    Ok(())
}

// Build the given Exercise
fn compile_and_run_interactively(exercise: &Exercise) -> Result<bool, ()> {
    println!("Building {exercise} exercise...");

    let run_state = compile_and_run_cairo(exercise)?;

    Ok(prompt_for_completion(exercise, Some(run_state)))
}

// Tests the given Exercise
fn compile_and_test_interactively(exercise: &Exercise) -> Result<bool, ()> {
    println!("Testing {exercise} exercise...");

    let run_state = compile_and_test_cairo(exercise)?;

    Ok(prompt_for_completion(exercise, Some(run_state)))
}

// Build the given Exercise and return an object with information
// about the state of the compilation
fn compile_and_run_cairo(exercise: &Exercise) -> Result<String, ()> {
    let compilation_result = exercise.build();

    if let Err(error) = compilation_result {
        eprintln!("{error}");

        warn!("Compiling of {} failed! Please try again.", exercise);
        Err(())
    } else {
        Ok(compilation_result.unwrap())
    }
}

// Tests the given Exercise and return an object with information
// about the state of the tests
fn compile_and_test_cairo(exercise: &Exercise) -> Result<String, ()> {
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

fn prompt_for_completion(exercise: &Exercise, prompt_output: Option<String>) -> bool {
    let context = match exercise.state() {
        State::Done => return true,
        State::Pending(context) => context,
    };

    match exercise.mode {
        Mode::Build => success!("Successfully built {}!", exercise),
        Mode::Test => success!("Successfully tested {}!", exercise),
        // Mode::Clippy => success!("Successfully compiled {}!", exercise),
    }

    let no_emoji = env::var("NO_EMOJI").is_ok();

    let _clippy_success_msg = "The code is compiling, and Clippy is happy!";

    let success_msg = match exercise.mode {
        Mode::Build => "The code is compiling!",
        Mode::Test => "The code is compiling, and the tests pass!",
        // Mode::Clippy => clippy_success_msg,
    };

    println!();
    if no_emoji {
        println!("~*~ {success_msg} ~*~")
    } else {
        println!("🎉 🎉  {success_msg} 🎉 🎉")
    }
    println!();

    if let Some(output) = prompt_output {
        println!("Output:");
        println!("{}", separator());
        println!("{output}");
        println!("{}", separator());
        println!();
    }

    println!("You can keep working on this exercise,");
    println!(
        "or jump into the next one by removing the {} comment:",
        style("`I AM NOT DONE`").bold()
    );
    println!();
    for context_line in context {
        let formatted_line = if context_line.important {
            format!("{}", style(context_line.line).bold())
        } else {
            context_line.line.to_string()
        };

        println!(
            "{:>2} {}  {}",
            style(context_line.number).blue().bold(),
            style("|").blue(),
            formatted_line
        );
    }

    false
}

fn separator() -> console::StyledObject<&'static str> {
    style("====================").bold()
}
