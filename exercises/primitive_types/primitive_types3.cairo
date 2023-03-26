// primitive_types3.cairo
// Destructure the `cat` tuple to call print on each member.
// Execute `starklings hint primitive_types3` or use the `hint` watch subcommand for a hint.


use debug::PrintTrait;

fn main() {
    let cat = ('Furry McFurson', 3);
    let (a,b) = cat;
    let name = a; 
    let age = b;
    name.print();
    age.print();
}
