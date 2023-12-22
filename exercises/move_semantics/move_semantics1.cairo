// move_semantics1.cairo
// Execute `starklings hint move_semantics1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use array::ArrayTrait;
use array::ArrayTCloneImpl;
use array::SpanTrait;
use debug::PrintTrait;
use clone::Clone;

fn main() {
    let arr0 = ArrayTrait::new();

    let arr1 = fill_arr(arr0);

    // This is just a print statement for arrays.
    arr1.clone().print();

    //TODO fix the error here without modifying this line.
    arr1.append(88);

    arr1.print();
}

fn fill_arr(arr: Array<felt252>) -> Array<felt252> {
    let mut arr = arr;

    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}
