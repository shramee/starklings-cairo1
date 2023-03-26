// traits2.cairo

// The previous exercise did not make the distinction
// between different types of animals, but this one does.
// The trait `AnimalTrait` has two functions:
// `new` and `make_noise`.
// `new` should return a new instance of the type
// implementing the trait.
// `make_noise` should return the noise the animal makes.
// The types `Cat` and `Cow` are already defined for you.
// You need to implement the trait `AnimalTrait` for them.

// No hints for this one!
// Execute `starklings hint traits2` or use the `hint` watch subcommand for a hint.


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

impl CatImpl of AnimalTrait::<Cat> {
    // TODO: implement the trait Animal for the type Cat
    fn new() -> Cat {
    Cat{noise:'meow'}
    }
    fn make_noise(self: Cat) -> felt252 {
    self.noise
    }
}

// TODO: implement the trait Animal for the type Cow
impl CowImpl of AnimalTrait::<Cow> {

    fn new() -> Cow {
    Cow{noise:'moo'}
    }
    fn make_noise(self: Cow) -> felt252 {
    self.noise
    }
}

#[test]
fn test_traits2() {
    let kitty: Cat = AnimalTrait::new();
    assert(kitty.make_noise() == 'meow', 'Wrong noise');

    let cow: Cow = AnimalTrait::new();
    assert(cow.make_noise() == 'moo', 'Wrong noise');
}
