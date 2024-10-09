// I AM NOT DONE
use std::hash::poseidon2::Poseidon2Hasher;

fn contains_key(map: &HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>>) -> bool {
    // TODO: Implement the contains_key function
    // It should return true if the key 2 exists in the HashMap
}

#[test]
fn test_contains_key() {
    let mut my_map: HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>> = HashMap::default();
    my_map.insert(1, 10);
    my_map.insert(2, 20);
    let exists = contains_key(&my_map);
    assert(exists);
}
