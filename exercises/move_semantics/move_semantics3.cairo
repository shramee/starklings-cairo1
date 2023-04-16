// move_semantics3.cairo
// Make me compile without adding new lines-- just changing existing lines!
// (no lines with multiple semicolons necessary!)
// Execute `starklings hint move_semantics3` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use array::ArrayTrait;
use array::ArrayTCloneImpl;
use array::SpanTrait;
use clone::Clone;
use debug::PrintTrait;

fn main() {
    let arr0 = ArrayTrait::new();

    let mut arr1 = fill_arr(arr0);

    arr1.clone().print();

    arr1.append(88);

    arr1.clone().print();
}

fn fill_arr(arr: Array<felt252>) -> Array<felt252> {
    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}
