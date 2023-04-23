// starknet4.cairo
// Address all the TODOs to make the tests pass!
// Execute `starklings hint starknet4` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
#[contract]
mod Contract {
    use starknet::ContractAddress;

    struct Storage {
        balances: LegacyMap<ContractAddress, u64>
    }

    fn constructor() {}

    fn set_balance(user: ContractAddress, new_balance: u64) { //TODO modify the value in storage
    }

    fn balance_of(user: ContractAddress) -> u64 { //TODO read the value from storage and return it
    }
}

#[cfg(test)]
mod test {
    use super::Contract;
    use starknet::ContractAddress;
    use starknet::contract_address_const;
    use traits::TryInto;
    use option::OptionTrait;

    #[test]
    #[available_gas(2000000000)]
    fn test_starknet4() {
        let USER_1: ContractAddress = 0xabc.try_into().unwrap();
        Contract::constructor();
        assert(Contract::balance_of(USER_1) == 0, 'balance should be 0');

        Contract::set_balance(USER_1, 20);
        assert(Contract::balance_of(USER_1) == 20, 'value should be 20');
    }
}
