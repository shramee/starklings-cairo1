// traits1.cairo
// Time to implement some traits!

// Your task is to implement the trait
// `AnimalTrait` for the type `Animal`
//
// Execute `starklings hint traits1` or use the `hint` watch subcommand for a hint.

// Fill in the impl block to make the code work.

// I AM NOT DONE

#[derive(Copy, Drop)]
struct Animal {
    noise: felt
}

trait AnimalTrait<T> {
    fn new(noise: felt) -> T;
    fn make_noise(self: T) -> felt;
}

impl AnimalImpl of AnimalTrait::<Animal> {// TODO: implement the trait AnimalTrait for Animal
}

#[test]
fn test_traits1() {
    // TODO make the test pass by creating two instances of Animal
    // and calling make_noise on them

    assert(cat.make_noise() == 'meow', 'Wrong noise');
    assert(cow.make_noise() == 'moo', 'Wrong noise');
}
