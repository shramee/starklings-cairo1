// variables6.cairo
// Execute `starklings hint variables6` or use the `hint` watch subcommand for a hint.


use traits::Into;

const NUMBER:felt = 3;
const SMALL_NUMBER:u8 = 3_u8;
fn main() {
    debug::print_felt(NUMBER);
    debug::print_felt(SMALL_NUMBER.into());
}
