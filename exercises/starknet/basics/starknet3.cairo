// starknet3.cairo
// Address all the TODOs to make the tests pass!
// Execute `starklings hint starknet3` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
#[contract]
mod Contract {
    struct Storage {
        value: u64
    }

    fn constructor(new_value: u64) {
        value::write(new_value)
    }

    fn set_value(new_value: u64) {
        //TODO modify the value in storage
    }

    fn get_value() -> u64 {
        //TODO read the value from storage and return it
    }
}

#[cfg(test)]
mod test {
    use super::Contract;
    #[test]
    #[available_gas(2000000000)]
    fn test_starknet3() {
        Contract::constructor(10);
        assert(Contract::value::read() == 10, 'value should be 10');

        Contract::set_value(20);
        assert(Contract::get_value() == 20, 'value should be 20');
    }
}
