# Starklings CLI

![STARKLINGS](./.github/hero-banner.svg)

An interactive tutorial to get you up and running with Cairo and Starknet

## Setup and run

Make sure you have Rust and Cargo installed with the `default` toolchain.  
With rustup 
```sh
curl https://sh.rustup.rs -sSf | sh -s
```

1. Clone the repo and go in the directory,
   ```
   git clone https://github.com/shramee/starklings-cairo1.git && cd starklings-cairo1
   ```
2. Run starklings (this might take a while the first time),
   ```sh
   cargo run -r --bin starklings
   ```
3. You should see an intro message, when you are ready run starklings in watch mode,
   ```sh
   cargo run -r --bin starklings watch
   ```

## Start at a specific exercise `NEW`

To start watch at a specific exercise pass the name of the exercise to watch command.
For example, to start at `starknet1`,

```
cargo run -r --bin starklings watch starknet1
```

## Welcome message and instructions

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

1. To start starklings run `cargo run -r --bin starklings watch`
2. It'll automatically start with the first exercise. Don't get confused by
error message popping up as soon as you run starklings! This is part of the
exercise that you're supposed to solve, so open the exercise file in an editor
and start your detective work!
3. If you're stuck on an exercise, there is a helpful hint you can view by
typing `hint` (in watch mode), or running `cargo run -r --bin starklings hint
exercise_name`.
4. When you have solved the exercise successfully, Remove `// I AM NOT DONE`
comment to move on to the next exercise.
5. If an exercise doesn't make sense to you, please open an issue on GitHub!
(https://github.com/shramee/starklings-cairo1/issues/new).

Got all that? Great! To get started, run `starklings watch` in order to get the
first exercise. Make sure to have your editor open!
```

## VSCode extension & language server

In order to have syntax highlighting and language server features, you will need to install the Cairo Language Server. The instructions available in the [Cairo repository](https://github.com/starkware-libs/cairo/tree/main/vscode-cairo)

## Inspiration

-   [Rustlings](https://github.com/rust-lang/rustlings), starklings is forked from Rustlings. Thanks to all the original [authors and contributors](https://github.com/rust-lang/rustlings)
