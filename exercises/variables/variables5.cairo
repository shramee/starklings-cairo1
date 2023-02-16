// variables5.cairo
// Execute `starklings hint variables5` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

fn main() {
    let number = 1_u8; // don't change this line
    debug::print_felt(u8_to_felt(number));
    number = 3; // don't rename this variable
    debug::print_felt(number);
}
