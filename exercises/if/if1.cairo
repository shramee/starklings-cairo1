// if1.cairo
// Execute `starklings hint if1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

fn bigger(a: usize, b: usize) -> usize {
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
        assert(10_usize == bigger(10_usize, 8_usize), '10 bigger than 8');
    }

    #[test]
    fn fortytwo_is_bigger_than_thirtytwo() {
        assert(42_usize == bigger(32_usize, 42_usize), '42 bigger than 32');
    }
}
