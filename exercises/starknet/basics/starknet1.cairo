// Starkling, Joe, is writing a really simple contract.
// The contract shows that he is the owner of the contract.
// However, his contract is not working. What's he missing?

// I AM NOT DONE

#[starknet::interface]
trait IJoesContract<TContractState> {
    fn get_owner(self: @TContractState) -> felt252;
}

#[starknet::contract]
mod JoesContract {
    #[storage]
    struct Storage {}

    impl IJoesContractImpl of super::IJoesContract<ContractState> {
        fn get_owner(self: @ContractState) -> felt252 {
            'Joe'
        }
    }
}

#[cfg(test)]
mod test {
    use super::JoesContract;
    use starknet::syscalls::deploy_syscall;
    use super::IJoesContractDispatcher;
    use super::IJoesContractDispatcherTrait;

    #[test]
    #[available_gas(2000000000)]
    fn test_contract_view() {
        let dispatcher = deploy_contract();
        assert('Joe' == dispatcher.get_owner(), 'Joe should be the owner.');
    }

    fn deploy_contract() -> IJoesContractDispatcher {
        let mut calldata = ArrayTrait::new();
        let (address0, _) = deploy_syscall(
            JoesContract::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();
        let contract0 = IJoesContractDispatcher { contract_address: address0 };
        contract0
    }
}
