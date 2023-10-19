// dict2.cairo
// Dictionaries can be used to simulate dynamic array : the value they store can be accessed and modified.
// Your task is to create a function that mutliplies the elements stored at the indexes 0 to n of a dictionary by 10
// Make me compile and pass the test!
// Execute `starklings hint dict2` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE



fn multiply_element_by_10(ref a: Felt252Dict<u32>, n: usize) {
    //TODO : make a function that mutliplies the elements stored at the indexes 0 to n of a dictionary by 10


}

// Don't change anything in the test
#[test]
#[available_gas(2000000000)]
fn test_3() {
    let mut a: Felt252Dict<u32> = Default::default();
    a.insert(0, 1);
    a.insert(1, 2);
    a.insert(2, 3);

    multiply_element_by_10(ref a, 3);

    assert(a.get(0) == 10, 'First element is not 10');
    assert(a.get(1) == 20, 'Second element is not 20');
    assert(a.get(2) == 30, 'Third element is not 30');
}

#[test]
#[available_gas(2000000000)]
fn test_4() {
    let mut a: Felt252Dict<u32> = Default::default();
    a.insert(0, 1);
    a.insert(1, 2);
    a.insert(2, 5);
    a.insert(3, 10);

    multiply_element_by_10(ref a, 4);

    assert(a.get(2) == 50, 'First element is not 50');
    assert(a.get(3) == 100, 'First element is not 100');

}