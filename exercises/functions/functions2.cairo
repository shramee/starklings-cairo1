// functions2.cairo
// Execute `starklings hint functions2` or use the `hint` watch subcommand for a hint.

use debug::PrintTrait;

fn main() {
    call_me(3);
}

fn call_me(num:felt252) {
    num.print();
}
