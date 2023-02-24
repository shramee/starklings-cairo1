// move_semantics4.cairo
// Refactor this code so that instead of passing `arr0` into the `fill_arr` function,
// the Array gets created in the function itself and passed back to the main
// function.
// Execute `starklings hint move_semantics4` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
use array::ArrayTrait;
use debug::print;

fn main() {
    let arr0 = ArrayTrait::<felt>::new();

    let mut arr1 = fill_arr();

    print(clone_array(@arr1));

    arr1.append(88);

    print(clone_array(@arr1));
}

// `fill_arr()` no longer takes `arr: Array::<felt>` as argument
fn fill_arr() -> Array::<felt> {
    let mut arr = arr;

    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}

// You can use this function to clone an array by calling
// `clone_array(@arr0)`. It will return a new array with the same content.
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
