// I AM NOT DONE
use std::hash::poseidon2::Poseidon2Hasher;

fn remove_element(map: &mut HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>>) {
    // TODO: Implement the remove_element function
    // It should remove the element with key 1 from the HashMap
}

#[test]
fn test_remove_element() {
    let mut my_map: HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>> = HashMap::default();
    my_map.insert(1, 10);
    my_map.insert(2, 20);
    remove_element(&mut my_map);
    assert(my_map.len() == 1);
    assert(!my_map.contains_key(1));
}
