// primitive_types3.cairo
// Destructure the `cat` tuple so that the print_felt will work.
// Execute `starklings hint primitive_types3` or use the `hint` watch subcommand for a hint.



fn main() {
    let cat = ('Furry McFurson', 3);
    let (name,age) = cat;// your pattern here = cat;
    debug::print_felt(name);
    debug::print_felt(age);
}
