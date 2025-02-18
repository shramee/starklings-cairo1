use core::dict::Felt252DictTrait;

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
