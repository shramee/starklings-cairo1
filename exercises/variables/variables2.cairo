// variables2.cairo
// Execute `starklings hint variables2` or use the `hint` watch subcommand for a hint.


use debug::PrintTrait;

fn main() {
    let mut x =8;
    if x == 10 {
        ('x is ten!').print();
    } else {
        ('x is not ten!').print();
    }
}
