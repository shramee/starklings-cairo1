use regex::Regex;
use serde::Deserialize;

use std::fmt::{self, Display, Formatter};
use std::fs::{remove_file, File};
use std::io::Read;
use std::path::PathBuf;
use std::process::{self, Command};

const I_AM_DONE_REGEX: &str = r"(?m)^\s*///?\s*I\s+AM\s+NOT\s+DONE";
const CONTEXT: usize = 2;

// Get a temporary file name that is hopefully unique
#[inline]
fn temp_file() -> String {
    let thread_id: String = format!("{:?}", std::thread::current().id())
        .chars()
        .filter(|c| c.is_alphanumeric())
        .collect();

    format!("./temp_{}_{thread_id}", process::id())
}

// The mode of the exercise.
#[derive(Deserialize, Copy, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Mode {
    // Indicates that the exercise should be compiled as a binary
    Compile,
    // Indicates that the exercise should be tested
    Test,
}

#[derive(Deserialize)]
pub struct ExerciseList {
    pub exercises: Vec<Exercise>,
}

// A representation of a starklings exercise.
// This is deserialized from the accompanying info.toml file
#[derive(Deserialize, Debug)]
pub struct Exercise {
    // Name of the exercise
    pub name: String,
    // The path to the file containing the exercise's source code
    pub path: PathBuf,
    // The mode of the exercise (Test, Compile, or Clippy)
    pub mode: Mode,
    // The hint text associated with the exercise
    pub hint: String,
}

// An enum to track of the state of an Exercise.
// An Exercise can be either Done or Pending
#[derive(PartialEq, Debug)]
pub enum State {
    // The state of the exercise once it's been completed
    Done,
    // The state of the exercise while it's not completed yet
    Pending(Vec<ContextLine>),
}

// The context information of a pending exercise
#[derive(PartialEq, Debug)]
pub struct ContextLine {
    // The source code that is still pending completion
    pub line: String,
    // The line number of the source code still pending completion
    pub number: usize,
    // Whether or not this is important
    pub important: bool,
}

// A representation of an already executed binary
#[derive(Debug)]
pub struct ExerciseOutput {
    // The textual contents of the standard output of the binary
    pub stdout: String,
    // The textual contents of the standard error of the binary
    pub stderr: String,
}

struct FileHandle;

impl Drop for FileHandle {
    fn drop(&mut self) {
        clean();
    }
}

impl Exercise {
    pub fn run_cairo(&self) -> std::process::Output {
        let cmd = Command::new("cargo")
            .args(&["run", "-q", "--bin", "cairo-runner", "--"])
            .args(&["--path", self.path.to_str().unwrap()])
            .output();
        cmd.expect("Failed to run 'compile' command.")
    }

    pub fn test_cairo(&self) -> std::process::Output {
        let cmd = Command::new("cargo")
            .args(&["run", "-q", "--bin", "cairo-tester", "--"])
            .args(&["--path", self.path.to_str().unwrap()])
            .output();
        cmd.expect("Failed to run 'test' command.")
    }

    pub fn state(&self) -> State {
        let mut source_file =
            File::open(&self.path).expect("We were unable to open the exercise file!");

        let source = {
            let mut s = String::new();
            source_file
                .read_to_string(&mut s)
                .expect("We were unable to read the exercise file!");
            s
        };

        let re = Regex::new(I_AM_DONE_REGEX).unwrap();

        if !re.is_match(&source) {
            return State::Done;
        }

        let matched_line_index = source
            .lines()
            .enumerate()
            .find_map(|(i, line)| if re.is_match(line) { Some(i) } else { None })
            .expect("This should not happen at all");

        let min_line = ((matched_line_index as i32) - (CONTEXT as i32)).max(0) as usize;
        let max_line = matched_line_index + CONTEXT;

        let context = source
            .lines()
            .enumerate()
            .filter(|&(i, _)| i >= min_line && i <= max_line)
            .map(|(i, line)| ContextLine {
                line: line.to_string(),
                number: i + 1,
                important: i == matched_line_index,
            })
            .collect();

        State::Pending(context)
    }

    // Check that the exercise looks to be solved using self.state()
    // This is not the best way to check since
    // the user can just remove the "I AM NOT DONE" string from the file
    // without actually having solved anything.
    // The only other way to truly check this would to compile and run
    // the exercise; which would be both costly and counterintuitive
    pub fn looks_done(&self) -> bool {
        self.state() == State::Done
    }
}

impl Display for Exercise {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(f, "{}", self.path.to_str().unwrap())
    }
}

#[inline]
fn clean() {
    let _ignored = remove_file(&temp_file());
}

#[cfg(test)]
mod test {
    use super::*;
    // use std::path::Path;

    #[test]
    fn test_finished_exercise() {
        let exercise = Exercise {
            name: "finished_exercise".into(),
            path: PathBuf::from("tests/fixture/cairo/compilePass.cairo"),
            mode: Mode::Compile,
            hint: String::new(),
        };

        assert_eq!(exercise.state(), State::Done);
    }

    #[test]
    fn test_cairo_test_passes() {
        let exercise = Exercise {
            name: "testPass".into(),
            path: PathBuf::from("tests/fixture/cairo/testPass.cairo"),
            mode: Mode::Compile,
            hint: String::new(),
        };

        assert_eq!(exercise.state(), State::Done);
    }
}
