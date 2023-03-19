# STARKLINGS

### An interactive tutorial to get you up and running with Cairo and Starknet

<p align="right">
<a href="https://discord.gg/onlydust">
<img src="https://img.shields.io/badge/Discord-6666FF?style=for-the-badge&logo=discord&logoColor=white" />
</a>
<a href="https://twitter.com/intent/follow?screen_name=onlydust_xyz">
<img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" />
</a>
</p>

---

## Setup and run

Make sure you have Rust and Cargo installed with the `default` toolchain.  
With rustup `curl https://sh.rustup.rs -sSf | sh -s`

1. Clone the repo and go in the directory,  
   `git clone https://github.com/shramee/starklings-cairo1.git && cd starklings-cairo1`.
2. Run `cargo run --bin starklings`, this might take a while the first time.
3. You should see this intro message, run `cargo run --bin starklings watch` when you are ready!

```
starklings - An interactive tutorial to get started with Cairo and Starknet

       _             _    _ _
      | |           | |  | (_)
   ___| |_ __ _ _ __| | _| |_ _ __   __ _ ___
  / __| __/ _` | '__| |/ / | | '_ \ / _` / __|
  \__ \ || (_| | |  |   <| | | | | | (_| \__ \
  |___/\__\__,_|_|  |_|\_\_|_|_| |_|\__, |___/
                                     __/ |
                                    |___/

Thanks for installing starklings!

Is this your first time? Don't worry, starklings is made for beginners! We are
going to teach you a bunch of stuff about StarkNet and Cairo.

Here's how starklings works,

1. To start starklings run `cargo run --bin starklings watch`
2. It'll automatically start with the first exercise. Don't get confused by
error message popping up as soon as you run starklings! This is part of the
exercise that you're supposed to solve, so open the exercise file in an editor
and start your detective work!
3. If you're stuck on an exercise, there is a helpful hint you can view by
typing `hint` (in watch mode), or running `cargo run --bin starklings hint
exercise_name`.
4. When you have solved the exercise successfully, Remove `// I AM NOT DONE`
comment to move on to the next exercise.
5. If an exercise doesn't make sense to you, please open an issue on GitHub!
(https://github.com/shramee/starklings-cairo1/issues/new).

Got all that? Great! To get started, run `starklings watch` in order to get the
first exercise. Make sure to have your editor open!
```

## Inspiration

-   [Rustlings](https://github.com/rust-lang/rustlings), starklings is forked from Rustlings. Thanks to all the original [authors and contributors](https://github.com/rust-lang/rustlings)

## Testing

#### For Cairo related tests

```
cargo test cairo
```

#### For all tests

```
cargo test
```

## Contributing

Thanks for your interest in the project. You can fork the repo, create a branch with a descriptive name (maybe the issue number and a word or two to describe it) and submit a pull request to the `dev` branch of this repo.

### Branches

We have 2 active branches,

1. `dev` This is where new development happens. All pull requests should be made to this branch.
2. `main` This is for cloning and running starklings. `dev` is merged into `main` after a second set of testing.

### Adding new exercises

1. New exercises can be added in `./exercises` directory.
2. Insert information about the exercise in `./info.toml` file. For example
    ```toml
    [[exercises]]
    name = "new_exercise"
    path = "exercises/new_module/new_exercise.cairo"
    mode = "compile" # or "test"
    hint = """"""
    ```
3. Check that the [tests](#testing) pass.
4. Send your PR to `dev` branch of the repo!

### Updating Rust logic/Cairo version

1. [Test](#testing) your changes.
2. Make sure you have solutions to all the exercises in `./solutions` directory.
3. Run `cargo run --bin starklings compile_solutions` to confirm all exercise solutions still compile.
4. Make a pull requests to `dev` branch of the repo!

### Merging `dev` into `main` (maintainers)

1. Create a PR from `dev` branch to `master` branch.
2. Run all tests, and check solutions with `cargo run --bin starklings compile_solutions`.
3. Check to make sure no new changes were merged into `dev` since the PR was created.
4. If everything makes sense, merge away!
