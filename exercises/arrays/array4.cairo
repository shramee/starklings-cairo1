// task: arrays4.cairo
// Your task is to create an `Array` which holds five elements of type `felt252`.
// The first element should be 10.
// Make me compile and pass the test!
// Execute `starklings hint arrays4` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

use array::ArrayTrait;
use option::OptionTrait;

fn create_array() -> Array<felt252> {
    let a = ArrayTrait::new(); // something to change here...
    a.append(1);
    a.append(2);
    a.append(3);
    a.append(4);
    a
}

// Don't change anything in the test
#[test]
fn test_array_len() {
    let mut a = create_array();
    assert(a.len() == 5, "Array length is not 5");
    assert(a.pop_front().unwrap() == 10, "First element is not 10");
}
