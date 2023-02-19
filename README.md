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

0. Make sure you have Rust and Cargo installed with `nightly` toolchain. With rustup,
   - `curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain nightly`
   - Or `Customise installation` then `Default toolchain?` set to `nightly` and everything else empty.
1. Run `cargo run --bin starklings`, this might take a while the first time.
2. You should see an intro message a little like this.

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

- [Rustlings](https://github.com/rust-lang/rustlings), starklings is forked from Rustlings. Thanks to all the original [authors and contributors](https://github.com/rust-lang/rustlings)

## Contributing

### _Work in progress_

## Testing

#### For Cairo related tests

```
cargo test cairo
```

#### For all tests

```
cargo test
```
