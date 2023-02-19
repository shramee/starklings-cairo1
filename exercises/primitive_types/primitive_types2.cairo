// primitive_types2.cairo
// Fill in the rest of the line that has code missing!
// No hints, there's no tricks, just get used to typing these :)

// I AM NOT DONE

fn main() {
    // A short string is a string whose length is at most 31 characters, and therefore can fit into a single field element.
    // Short strings are actually felts, they are not a real string.
    // Note the _single_ quotes that are used with short strings.
    

    let mut my_first_initial = 'C';
    if is_alphabetic(ref my_first_initial) {
        debug::print_felt('Alphabetical!');
    } else if is_numeric(ref my_first_initial) {
        debug::print_felt('Numerical!');
    } else {
        debug::print_felt('Neither alphabetic nor numeric!');
    }

    let // Finish this line like the example! What's your favorite short string?
    // Try a letter, try a number, try a special character, try a short string!
    if is_alphabetic(ref your_character) {
        debug::print_felt('Alphabetical!');
    } else if is_numeric(ref your_character) {
        debug::print_felt('Numerical!');
    } else {
        debug::print_felt('Neither alphabetic nor numeric!');
    }
}

fn is_alphabetic(ref self:felt)->bool{
    if self>='a'{
        if self<='z'{
            return true;
        }
    }
    if self>='A'{
        if self<='Z'{
            return true;
        }
    }
    false
}

fn is_numeric(ref self:felt)->bool{
    if self>='0'{
        if self<='9'{
            return true;
        }
    }
    false
}