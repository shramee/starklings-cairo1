// The Felt252Dict maps a felt252 to a value of the specified type.
// In this exercise, you will map a `felt252` key to a value of type `u32`.

// Your task is to create a `Felt252Dict`  containing three elements of type `u32`.
// The first element should map the key 'A' to the value 1, the second key 'B' to the value 2
// and the third should map 'bob' to the value 3.
// Make me compile and pass the test!

// I AM NOT DONE

fn create_dictionary() -> Felt252Dict<u32> {
    let mut dict: Felt252Dict<u32> = Default::default();
//TODO

}


// Don't change anything in the test
#[test]
#[available_gas(200000)]
fn test_dict() {
    let mut dict = create_dictionary();
    assert(dict.get('A') == 1, 'First element is not 1');
    assert(dict.get('B') == 2, 'Second element is not 2');
    assert(dict.get('bob') == 3, 'Third element is not 3');
}

