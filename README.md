# NOIRLINGS

### An interactive tutorial to get you up and running with Noir

---

## Setup and run

Make sure you have Rust and Cargo installed with the `default` toolchain.  
With rustup

```sh
curl https://sh.rustup.rs -sSf | sh -s
```

1. Clone the repo and go in the directory,
   ```
   git clone https://github.com/jmagan/noirlings.git && cd noirlings
   ```
2. Run noirlings (this might take a while the first time),
   ```sh
   cargo run -r --bin noirlings
   ```
3. You should see an intro message, when you are ready run noirlings in watch mode,
   ```sh
   cargo run -r --bin noirlings watch
   ```

## Start at a specific exercise `NEW`

To start watch at a specific exercise pass the name of the exercise to watch command.
For example, to start at `intro1`,

```
cargo run -r --bin noirlings watch intro1
```

## Welcome message and instructions

```
Noirlings - An interactive tutorial to get started with the Noir DSL

     _   _       _      _ _
    | \ | | ___ (_)_ __| (_)_ __   __ _ ___
    |  \| |/ _ \| | '__| | | '_ \ / _` / __|
    | |\  | (_) | | |  | | | | | | (_| \__ \
    |_| \_|\___/|_|_|  |_|_|_| |_|\__, |___/
                                |___/

Thanks for installing noirlings!

Is this your first time? Don't worry, noirlings is made for beginners! We are
going to teach you a bunch of stuff about the noir DSL language and prover backends!

Here's how noirlings works,

1. To start noirlings run `cargo run -r --bin noirlings watch`
2. It'll automatically start with the first exercise. Don't get confused by
error message popping up as soon as you run noirlings! This is part of the
exercise that you're supposed to solve, so open the exercise file in an editor
and start your detective work!
3. If you're stuck on an exercise, there is a helpful hint you can view by
typing `hint` (in watch mode), or running `cargo run -r --bin noirlings hint
exercise_name`.
4. When you have solved the exercise successfully, Remove `// I AM NOT DONE`
comment to move on to the next exercise.
5. If an exercise doesn't make sense to you, please open an issue on GitHub!.

Got all that? Great! To get started, run `noirlings watch` in order to get the
first exercise. Make sure to have your editor open!
```

## VSCode extension & language server

In order to have syntax highlighting and language server features, you will need to install the Noir Language Support.

## Inspiration

- [Starklings](https://github.com/shramee/starklings-cairo1), noirlings is forked from Straklings. Thanks to all the original [authors and contributors](https://github.com/shramee/starklings-cairo1)

## Contributing

Thanks for your interest in the project. You can fork the repo, create a branch with a descriptive name (maybe the issue number and a word or two to describe it) and submit a pull request.

### Adding new exercises

#### Here's what an exercise looks like,

1. An exercise is pretty much a single well commented Noir file.
2. Exercises are organised into modules and are placed in `./exercises/<module_name>/<exercise_name>.nr`
3. Exercise accompanies some metadata describing it in `./info.toml`
4. When introducing a concept for the first time, try to start minimally.
5. Subsequent exercises for the same concept can grow in complexity.

#### Contributing with a new exercise

1. Add the exercise file in the `./exercises` directory.
2. Insert information about the exercise in `./info.toml` file. For example
   ```toml
   [[exercises]]
   name = "new_exercise"
   path = "exercises/new_module/new_exercise.nr"
   mode = "test"
   hint = """
   Try the Harlem shake
   """
   ```
3. Run your exercise with `noirlings run` as you write

```
cargo run -r --bin noirlings run new_exercise
```

4. Check that the [tests](#testing) pass.
5. Send your PR!
