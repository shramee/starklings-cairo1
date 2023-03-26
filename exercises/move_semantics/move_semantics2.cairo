use array::ArrayTrait;
use debug::print;

fn main() {
    let arr0 = ArrayTrait::new();
    let b = clone_array(@arr0);
    let mut arr1 = fill_array(arr0);

    // Do not change the following line!
    print(b);

    arr1.append(88);

    print(arr1);
}

fn fill_array(arr: Array::<felt252>) -> Array::<felt252> {
    let mut arr = arr;

    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}

// You can use this function to clone an array by calling
// `clone_array(@arr0)`. It will return a new array with the same content.
fn clone_array(arr: @Array::<felt252>) -> Array::<felt252> {
    let mut new_arr = ArrayTrait::new();
    clone_array_(arr, ref new_arr);
    new_arr
}

fn clone_array_(src: @Array::<felt252>, ref dst: Array::<felt252>) {
    if src.len() == dst.len() {
        return ();
    }
    let value = *src.at(dst.len());
    dst.append(value);
    clone_array_(src, ref dst);
}