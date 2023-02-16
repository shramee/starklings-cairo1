// variables6.cairo
// Execute `starklings hint variables6` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

const NUMBER = 3;
const SMALL_NUMBER = 3_u8;
fn main() {
    debug::print_felt(NUMBER);
    debug::print_felt(u8_to_felt(SMALL_NUMBER));
}
