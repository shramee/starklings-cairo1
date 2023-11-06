use array::ArrayTrait;
use option::OptionTrait;

fn create_array() -> Array<felt252> {
    let a = ArrayTrait::new(); // create an array with default parameters
    a.append(0); // append 0 as the first element
    a.append(1); // append 1 as the second element
    a.append(2); // append 2 as the third element
    a
}


// Don't change anything in the test
#[test]
fn test_array_len() {
    let mut a = create_array();
    assert(a.len() == 3, 'Array length is not 3');
    assert(a.pop_front().unwrap() == 0, 'First element is not 0');
}
