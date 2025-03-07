// Your task is to make the test pass without modifying the `create_array` function.
// Make me compile and pass the test!

// I AM NOT DONE

// Don't modify this function
fn create_array() -> Array<felt252> {
    let mut a = ArrayTrait::new();
    a.append(42);
    a
}

fn remove_element_from_array(
    ref a: Array<felt252>
) { //TODO something to do here...Is there an array method I can use?
}

#[test]
fn test_arrays2() {
    let mut a = create_array();
    assert(*a.at(0) == 42, 'First element is not 42');
}

#[test]
fn test_arrays2_empty() {
    let mut a = create_array();
    remove_element_from_array(ref a);
    assert(a.len() == 0, 'Array length is not 0');
}

