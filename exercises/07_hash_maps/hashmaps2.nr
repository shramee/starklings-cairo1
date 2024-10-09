// I AM NOT DONE
use std::hash::poseidon2::Poseidon2Hasher;

fn insert_elements(map: &mut HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>>) {
    // TODO: Implement the insert_elements function
    // It should insert two elements into the given HashMap
}

#[test]
fn test_insert_elements() {
    let mut my_map: HashMap<Field, u32, 10, BuildHasherDefault<Poseidon2Hasher>> = HashMap::default();
    insert_elements(&mut my_map);
    assert(my_map.len() == 2);
}
