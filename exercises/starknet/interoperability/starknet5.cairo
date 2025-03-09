// Address all the TODOs to make the tests pass!

// I AM NOT DONE

#[starknet::interface]
trait IContractA<TContractState> {
    fn set_value(ref self: TContractState, value: u128) -> bool;
    fn get_value(self: @TContractState) -> u128;
}


#[starknet::contract]
mod ContractA {
    use starknet::ContractAddress;
    use super::IContractBDispatcher;
    use super::IContractBDispatcherTrait;

    #[storage]
    struct Storage {
        contract_b: ContractAddress,
        value: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState, contract_b: ContractAddress) {
        self.contract_b.write(contract_b)
    }

    #[abi(embed_v0)]
    impl ContractAImpl of super::IContractA<ContractState> {
        fn set_value(ref self: ContractState, value: u128) -> bool {
            // TODO: check if contract_b is enabled.
            // If it is, set the value and return true. Otherwise, return false.
        }

        fn get_value(self: @ContractState) -> u128 {
            self.value.read()
        }
    }
}

#[starknet::interface]
trait IContractB<TContractState> {
    fn enable(ref self: TContractState);
    fn disable(ref self: TContractState);
    fn is_enabled(self: @TContractState) -> bool;
}

#[starknet::contract]
mod ContractB {
    #[storage]
    struct Storage {
        enabled: bool
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    impl ContractBImpl of super::IContractB<ContractState> {
        fn enable(ref self: ContractState) {
            self.enabled.write(true);
        }

        fn disable(ref self: ContractState) {
            self.enabled.write(false);
        }

        fn is_enabled(self: @ContractState) -> bool {
            self.enabled.read()
        }
    }
}

#[cfg(test)]
mod test {
    use starknet::syscalls::deploy_syscall;
    use super::ContractA;
    use super::IContractADispatcher;
    use super::IContractADispatcherTrait;
    use super::ContractB;
    use super::IContractBDispatcher;
    use super::IContractBDispatcherTrait;


    #[test]
    #[available_gas(30000000)]
    fn test_interoperability() {
        // Deploy ContractB
        let (address_b, _) = deploy_syscall(
            ContractB::TEST_CLASS_HASH.try_into().unwrap(), 0, ArrayTrait::new().span(), false
        )
            .unwrap();

        // Deploy ContractA
        let mut calldata = ArrayTrait::new();
        calldata.append(address_b.into());
        let (address_a, _) = deploy_syscall(
            ContractA::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();

        // contract_a is of type IContractADispatcher. Its methods are defined in IContractADispatcherTrait.
        let contract_a = IContractADispatcher { contract_address: address_a };
        let contract_b = IContractBDispatcher { contract_address: address_b };

        //TODO interact with contract_b to make the test pass.

        // Tests
        assert(contract_a.set_value(300) == true, 'Could not set value');
        assert(contract_a.get_value() == 300, 'Value was not set');
        assert(contract_b.is_enabled() == true, 'Contract b is not enabled');
    }
}
