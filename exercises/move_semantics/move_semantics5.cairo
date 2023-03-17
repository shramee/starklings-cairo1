// move_semantics5.cairo
// Make me compile only by reordering the lines in `main()`, but without
// adding, changing or removing any of them.
// Execute `starklings hint move_semantics5` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
use array::ArrayTrait;
#[test]
fn main() {
    let mut a = ArrayTrait::new();
    let mut b = pass_by_value(a);
    pass_by_ref(ref a);
    pass_by_ref(ref b);
    pass_by_snapshot(@a);
}

fn pass_by_value(mut arr: Array<felt252>) -> Array<felt252> {
    arr
}

fn pass_by_ref(ref arr: Array<felt252>) {}

fn pass_by_snapshot(x: @Array<felt252>) {}
