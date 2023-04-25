// starknet1.cairo
// Address all the TODOs to make the tests pass!
// Execute `starklings hint starknet1` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
#[contract]
mod Contract {
    struct Storage {
        value: u64
    }

    // TODO: modify the signature of the constructor to pass a parameter used
    // to set the value in storage
    fn constructor() {
        value::write(new_value)
    }
}

#[cfg(test)]
mod test {
    use super::Contract;
    #[test]
    #[available_gas(2000000000)]
    fn test_starknet1() {
        Contract::constructor();
        assert(Contract::value::read() == 10, 'value should be 10');
    }
}
