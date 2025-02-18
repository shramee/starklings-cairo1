#[derive(Copy, Drop)]
struct Cat {
    noise: felt252, 
}

#[derive(Copy, Drop)]
struct Cow {
    noise: felt252, 
}

trait AnimalTrait<T> {
    fn new() -> T;
    fn make_noise(self: T) -> felt252;
}

impl CatImpl of AnimalTrait<Cat> { // TODO: implement the trait Animal for the type Cat
}

// TODO: implement the trait Animal for the type Cow

#[test]
fn test_traits2() {
    let kitty: Cat = AnimalTrait::new();
    assert(kitty.make_noise() == 'meow', 'Wrong noise');

    let cow: Cow = AnimalTrait::new();
    assert(cow.make_noise() == 'moo', 'Wrong noise');
}
