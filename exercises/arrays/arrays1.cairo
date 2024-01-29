// arrays1.cairo
// Your task is to create an `Array` which holds three elements of type `felt252`.
// The first element shoud be 0.
// Make me compile and pass the test!
// Execute `starklings hint arrays1` or use the `hint` watch subcommand for a hint.

use array::ArrayTrait;
use option::OptionTrait;

fn create_array() -> Array<felt252> {
    let mut a = ArrayTrait::new(); // something to change here...
    a.append(0);
    a.append(1);
    a.append(2);
    a
}


// Don't change anything in the test
#[test]
fn test_array_len() {
    let mut a = create_array();
    assert(a.len() == 3, 'Array length is not 3');
    assert(a.pop_front().unwrap() == 0, 'First element is not 0');
}

