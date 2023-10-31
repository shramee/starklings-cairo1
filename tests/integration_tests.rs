use assert_cmd::prelude::*;
use glob::glob;
use serial_test::serial;

use std::fs::File;
use std::io::Read;
use std::process::Command;

#[test]
fn runs_without_arguments() {
    let mut cmd = Command::cargo_bin("starklings").unwrap();
    cmd.assert().success();
}

#[test]
fn fails_when_in_wrong_dir() {
    Command::cargo_bin("starklings")
        .unwrap()
        .current_dir("tests/")
        .assert()
        .code(1);
}

#[test]
fn reset_single_exercise() {
    Command::cargo_bin("starklings")
        .unwrap()
        .args(["reset", "intro1"])
        .assert()
        .code(0);
}

#[test]
fn reset_no_exercise() {
    Command::cargo_bin("starklings")
        .unwrap()
        .arg("reset")
        .assert()
        .code(1)
        .stderr(predicates::str::contains(
            "positional arguments not provided",
        ));
}

#[test]
fn all_exercises_require_confirmation() {
    for exercise in glob("exercises/**/*.cairo").unwrap() {
        let path = exercise.unwrap();
        if path.file_name().unwrap() == "mod.cairo" {
            continue;
        }
        let source = {
            let mut file = File::open(&path).unwrap();
            let mut s = String::new();
            file.read_to_string(&mut s).unwrap();
            s
        };
        source
            .matches("// I AM NOT DONE")
            .next()
            .unwrap_or_else(|| panic!("There should be an `I AM NOT DONE` annotation in {path:?}"));
    }
}

#[test]
fn exercise_paths_should_be_in_exercise_dir() {
    let output = Command::cargo_bin("starklings")
        .unwrap()
        .args(["paths"])
        .output()
        .unwrap()
        .stdout;
    let output = String::from_utf8(output).unwrap();
    // println!("{:#?}", output.split("\n"));

    output.split('\n').for_each(|path| {
        if !path.is_empty() && !path.starts_with("exercises/") {
            panic!("Exercise {path} must be in exercises directory.");
        }
    });
}

// #[test]
// fn run_compile_exercise_does_not_prompt() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["run", "pending_exercise"])
//         .current_dir("tests/fixture/state")
//         .assert()
//         .code(0)
//         .stdout(predicates::str::contains("I AM NOT DONE").not());
// }

// #[test]
// fn run_test_exercise_does_not_prompt() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["run", "pending_test_exercise"])
//         .current_dir("tests/fixture/state")
//         .assert()
//         .code(0)
//         .stdout(predicates::str::contains("I AM NOT DONE").not());
// }

// #[test]
// fn run_starklings_list() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["list"])
//         .current_dir("tests/fixture/success")
//         .assert()
//         .success();
// }

// #[test]
// fn run_starklings_list_no_pending() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["list"])
//         .current_dir("tests/fixture/success")
//         .assert()
//         .success()
//         .stdout(predicates::str::contains("Pending").not());
// }

// #[test]
// fn run_starklings_list_both_done_and_pending() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["list"])
//         .current_dir("tests/fixture/state")
//         .assert()
//         .success()
//         .stdout(predicates::str::contains("Done").and(predicates::str::contains("Pending")));
// }

// #[test]
// fn run_starklings_list_without_pending() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["list", "--solved"])
//         .current_dir("tests/fixture/state")
//         .assert()
//         .success()
//         .stdout(predicates::str::contains("Pending").not());
// }

// #[test]
// fn run_starklings_list_without_done() {
//     Command::cargo_bin("starklings")
//         .unwrap()
//         .args(&["list", "--unsolved"])
//         .current_dir("tests/fixture/state")
//         .assert()
//         .success()
//         .stdout(predicates::str::contains("Done").not());
// }

#[test]
#[serial]
fn run_cairo_single_compile_success() {
    Command::cargo_bin("starklings")
        .unwrap()
        .args(["run", "cairoPass"])
        .current_dir("tests/fixture/cairo/")
        .assert()
        .success();
}

#[test]
#[serial]
fn run_cairo_single_test_success() {
    Command::cargo_bin("starklings")
        .unwrap()
        .args(["run", "testPass"])
        .current_dir("tests/fixture/cairo/")
        .assert()
        .success();
}

#[test]
#[serial]
fn run_cairo_single_test_failure() {
    Command::cargo_bin("starklings")
        .unwrap()
        .args(["run", "testFails"])
        .current_dir("tests/fixture/cairo/")
        .assert()
        .code(1);
}
