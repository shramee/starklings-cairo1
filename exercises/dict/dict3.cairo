// dict3.cairo
// Custom data structure using dicts
// Using Felt252Dict in structs allow us to simulate mutable data structures
// In this exercise we have a struct Team where a Felt252Dict maps the name of a player to its level and keeps track of
// the number of player.
// Using the methods set and get from the Felt252DictTrait, implement the required functions to interact with the team
// Make me compile and pass the test!
// Execute `starklings hint dict3` or use the `hint` watch subcommand for a hint.

#[generate_trait]
impl TeamImpl of TeamTrait {
    fn new() -> Team {
        //TODO 
        Team { level: Default::default(), players_count: 0 }
    }

    fn get_level(ref self: Team, name: felt252) -> usize {
        //TODO 
        self.level.get(name)
    }

    fn add_player(ref self: Team, name: felt252, level: usize) -> () {
        //TODO
        self.players_count = self.players_count + 1;
        self.level.insert(name, level)
    }


    fn level_up(ref self: Team, name: felt252) {
        //TODO
        self.level.insert(name, self.level.get(name) + 1);
    }

    fn players_count(self: @Team) -> usize {
        //TODO
        *self.players_count
    }
}
