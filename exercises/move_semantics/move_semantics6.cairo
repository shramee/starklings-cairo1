// move_semantics6.cairo
// Execute `starklings hint move_semantics6` or use the `hint` watch subcommand for a hint.
// You can't change anything except adding or removing references.

// I AM NOT DONE
use debug::PrintTrait;

#[derive(Drop)]
struct Number {
    value: u32, 
}

fn main() {
    let mut number = Number { value: 1111111 };

    get_value(number);

    set_value(number);
}

// Should not take ownership and not modify the variable passed.
fn get_value(number: Number) -> u32 {
    number.value
}

// Should take ownership
fn set_value(number: Number) {
    let value = 2222222;
    number = Number { value };
    number.value.print();
}
