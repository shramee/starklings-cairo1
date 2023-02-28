// variables2.cairo
// Execute `starklings hint variables2` or use the `hint` watch subcommand for a hint.


fn main() {
    let mut x=0;
    
    if x == 10 {
        debug::print_felt('x is ten!');
    } else {
        debug::print_felt('x is not ten!');
    }
}
