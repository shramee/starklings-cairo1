// variables4.cairo
// Execute `starklings hint variables4` or use the `hint` watch subcommand for a hint.

fn main() {
    let mut x = 3;
    debug::print_felt(x);
    x = 5; // don't change this line
    debug::print_felt(x);
}
