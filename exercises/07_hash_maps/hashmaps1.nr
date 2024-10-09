// I AM NOT DONE
use std::hash::poseidon2::Poseidon2Hasher;

fn create_hashmap() -> HashMap<Field, u32, 12, BuildHasherDefault<Poseidon2Hasher>> {
    // TODO: Implement the create_hashmap function
    // It should return a HashMap with two elements
    // The key should be of type Field and the value of type u32
}

#[test]
fn test_create_hashmap() {
    let my_map = create_hashmap();
    assert(my_map.len() == 2);
    assert(my_map.capacity() == 12);
}
