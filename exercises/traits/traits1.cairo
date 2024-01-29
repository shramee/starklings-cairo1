// traits1.cairo
// Time to implement some traits!

// Your task is to implement the trait
// `AnimalTrait` for the type `Animal`
//
// Execute `starklings hint traits1` or use the `hint` watch subcommand for a hint.

// Fill in the impl block to make the code work.

#[derive(Copy, Drop)]
struct Animal {
    noise: felt252
}

trait AnimalTrait {
    fn new(noise: felt252) -> Animal;
    fn make_noise(self: Animal) -> felt252;
}

impl AnimalImpl of AnimalTrait { // TODO: implement the trait AnimalTrait for Animal
    fn new(noise: felt252) -> Animal {
        Animal { noise: 'meow' }
    }
    fn make_noise(self: Animal) -> felt252 {
        self.noise
    }
}

#[test]
fn test_traits1() {
    let cat = Animal { noise: 'meow' };
    let cow = Animal { noise: 'moo' };

    assert(cat.make_noise() == 'meow', 'Wrong noise');
    assert(cow.make_noise() == 'moo', 'Wrong noise');
}
