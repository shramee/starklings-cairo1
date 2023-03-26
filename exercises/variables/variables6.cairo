// variables6.cairo
// Execute `starklings hint variables6` or use the `hint` watch subcommand for a hint.


use debug::PrintTrait;

const NUMBER:felt252 = 3;
const SMALL_NUMBER: u8 =  3_u8;
fn main() {
    NUMBER.print();
    SMALL_NUMBER.print();
}
 