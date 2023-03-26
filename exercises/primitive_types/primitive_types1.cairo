// primitive_types1.cairo
// Fill in the rest of the line that has code missing!
// No hints, there's no tricks, just get used to typing these :)



use debug::PrintTrait;

fn main() {
    // Booleans (`bool`)

    let is_morning = true;
    if is_morning {
        ('Good morning!').print();
    }

    let is_evening = false;
    if is_evening {
        ('Good evening!').print();
    } else {
    ('Good night').print();}
}
