// I AM NOT DONE
use std::hash::poseidon2::Poseidon2Hasher;

fn get_value(map: &HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>>) -> Option<u32> {
    // TODO: Implement the get_value function
    // It should return the value associated with the key 2
}

#[test]
fn test_get_value() {
    let mut my_map: HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>> = HashMap::default();
    my_map.insert(1, 10);
    my_map.insert(2, 20);
    let value = get_value(&my_map);
    assert(value == Some(20));
}
