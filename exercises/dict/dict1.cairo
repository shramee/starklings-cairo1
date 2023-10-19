// dict1.cairo
// The Felt252Dict maps a felt252 to a value of the specified type.
// In this exercise, you will map a `felt252` key to a value of type `u32`.

// Your task is to create a `Felt252Dict`  containing three elements of type `u32`.
// The first element shoud map the key 'A' to the value 1, the second key 'B' to the value 2 
// and the third shoud map 'bob' to the value 3.
// Make me compile and pass the test!
// Execute `starklings hint dict1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE


fn create_dictionary() -> Felt252Dict<u32> {
    let mut a: Felt252Dict<u32> = Default::default();
    //TODO

}


// Don't change anything in the test
#[test]
fn test_dict() {
    let mut dict = create_dictionary();
    assert(a.get('A') == 1, 'First element is not 1');
    assert(a.get('B') == 2, 'Second element is not 2');
    assert(a.get('bob') == 3, 'Third element is not 3');
}

