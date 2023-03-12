// primitive_types2.cairo
// Fill in the rest of the line that has code missing!
// No hints, there's no tricks, just get used to typing these :)

// I AM NOT DONE

fn main() {
    // A short string is a string whose length is at most 31 characters, and therefore can fit into a single field element.
    // Short strings are actually felts, they are not a real string.
    // Note the _single_ quotes that are used with short strings.

    let mut my_first_initial = 'C';
    if is_alphabetic(
        ref my_first_initial
    ) {
        debug::print_felt('Alphabetical!');
    } else if is_numeric(
        ref my_first_initial
    ) {
        debug::print_felt('Numerical!');
    } else {
        debug::print_felt('Neither alphabetic nor numeric!');
    }

    let // Finish this line like the example! What's your favorite short string?
    // Try a letter, try a number, try a special character, try a short string!
    if is_alphabetic(
        ref your_character
    ) {
        debug::print_felt('Alphabetical!');
    } else if is_numeric(
        ref your_character
    ) {
        debug::print_felt('Numerical!');
    } else {
        debug::print_felt('Neither alphabetic nor numeric!');
    }
}

fn is_alphabetic(ref char: felt) -> bool {
    if char >= 'a' {
        if char <= 'z' {
            return true;
        }
    }
    if char >= 'A' {
        if char <= 'Z' {
            return true;
        }
    }
    false
}

fn is_numeric(ref char: felt) -> bool {
    if char >= '0' {
        if char <= '9' {
            return true;
        }
    }
    false
}