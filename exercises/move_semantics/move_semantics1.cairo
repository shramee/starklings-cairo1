// move_semantics1.cairo
// Execute `starklings hint move_semantics1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use array::ArrayTrait;
use debug::print;

fn main() {
    let arr0 = ArrayTrait::new();

    let arr1 = fill_arr(arr0);

    print(clone_array(@arr1));

    //TODO fix the error here without modifying this line.
    arr1.append(88);

    print(clone_array(@arr1));
}

fn fill_arr(arr: Array::<felt>) -> Array::<felt> {
    let mut arr = arr;

    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}


// Don't change these functions! They are used to print the output.
fn clone_array(arr: @Array::<felt>) -> Array::<felt> {
    let mut new_arr = ArrayTrait::new();
    clone_array_(arr, ref new_arr);
    new_arr
}

fn clone_array_(src: @Array::<felt>, ref dst: Array::<felt>) {
    if src.len() == dst.len() {
        return ();
    }
    let value = *src.at(dst.len());
    dst.append(value);
    clone_array_(src, ref dst);
}
