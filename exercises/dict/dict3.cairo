// Custom data structure using dicts
// Using Felt252Dict in structs allow us to simulate mutable data structures
// In this exercise we have a struct Team where a Felt252Dict maps the name of a player to its level and keeps track of
// the number of player.
// Using the methods set and get from the Felt252DictTrait, implement the required functions to interact with the team
// Make me compile and pass the test!

// I AM NOT DONE

#[derive(Destruct)]
struct Team {
    level: Felt252Dict<usize>,
    players_count: usize
}

#[generate_trait]
impl TeamImpl of TeamTrait {
    fn new() -> Team {
        //TODO : initialize empty team with 0 player
    }

    fn get_level(ref self: Team, name: felt252) -> usize {
        //TODO 
    }

    fn add_player(ref self: Team, name: felt252, level: usize) -> () {
        //TODO
    }

    fn level_up(ref self: Team, name: felt252) {
        //TODO
    }

    fn players_count(self: @Team) -> usize {
        //TODO
    }
}


#[test]
#[available_gas(200000)]
fn test_add_player() {
    let mut team = TeamTrait::new();
    team.add_player('bob', 10);
    team.add_player('alice', 20);

    assert(team.players_count == 2, 'Wrong number of player');
    assert(team.get_level('bob') == 10, 'Wrong level');
    assert(team.get_level('alice') == 20, 'Wrong level');
}

#[test]
#[available_gas(200000)]
fn test_level_up() {
    let mut team = TeamTrait::new();
    team.add_player('bobby', 10);
    team.level_up('bobby');

    assert(team.level.get('bobby') == 11, 'Wrong level');
}
