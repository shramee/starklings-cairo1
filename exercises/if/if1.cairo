// if1.cairo
// Execute `starklings hint if1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

fn bigger(a: felt, b: felt) -> felt {
    // Complete this function to return the bigger number!
    // Do not use:
    // - another function call
    // - additional variables
}

// Don't mind this for now :)
mod tests {
    use super::bigger;

    #[test]
    fn ten_is_bigger_than_eight() {
        assert(10 == bigger(10, 8), '10 bigger than 8');
    }

    #[test]
    fn fortytwo_is_bigger_than_thirtytwo() {
        assert(42 == bigger(32, 42), '42 bigger than 32');
    }
}
