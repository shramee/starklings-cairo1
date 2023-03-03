// variables5.cairo
// Execute `starklings hint variables5` or use the `hint` watch subcommand for a hint.


use traits::Into;

fn main() {
    let mut number = 1_u8; // don't change this line
    debug::print_felt(number.into());
    number = 3_u8; // don't rename this variable
    debug::print_felt(number.into());
}
