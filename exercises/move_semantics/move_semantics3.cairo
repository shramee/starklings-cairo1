// move_semantics3.cairo
// Make me compile without adding new lines-- just changing existing lines!
// (no lines with multiple semicolons necessary!)
// Execute `starklings hint move_semantics3` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use array::ArrayTrait;
use debug::print;

fn main() {
    let arr0 = ArrayTrait::new();

    let mut arr1 = fill_arr(arr0);

    print(clone_array(@arr1));

    arr1.append(88);

    print(clone_array(@arr1));
}

fn fill_arr(arr: Array::<felt>) -> Array::<felt> {
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
    dst.append(*src.at(dst.len()));
    clone_array_(src, ref dst);
}
