use starknet::ContractAddress;

#[starknet::interface]
trait IProgressTracker<TContractState> {
    fn set_progress(ref self: TContractState, user: ContractAddress, new_progress: u16);
    fn get_progress(self: @TContractState, user: ContractAddress) -> u16;
    fn get_contract_owner(self: @TContractState) -> ContractAddress;
}

#[starknet::contract]
mod ProgressTracker {
    use starknet::ContractAddress;
    use starknet::get_caller_address; // Required to use get_caller_address function

    #[storage]
    struct Storage {
        contract_owner: ContractAddress,
        // TODO: Set types for LegacyMap
        progress: LegacyMap<>
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.contract_owner.write(owner);
    }


    #[abi(embed_v0)]
    impl ProgressTrackerImpl of super::IProgressTracker<ContractState> {
        fn set_progress(
            ref self: ContractState, user: ContractAddress, new_progress: u16
        ) { // TODO: assert owner is calling
        // TODO: set new_progress for user,
        }

        fn get_progress(self: @ContractState, user: ContractAddress) -> u16 { // Get user progress
        }

        fn get_contract_owner(self: @ContractState) -> ContractAddress {
            self.contract_owner.read()
        }
    }
}

#[cfg(test)]
mod test {
    use starknet::ContractAddress;
    use starknet::syscalls::deploy_syscall;
    use super::ProgressTracker;
    use super::IProgressTrackerDispatcher;
    use super::IProgressTrackerDispatcherTrait;

    #[test]
    #[available_gas(2000000000)]
    fn test_owner() {
        let owner: ContractAddress = 'Sensei'.try_into().unwrap();
        let dispatcher = deploy_contract();
        assert(owner == dispatcher.get_contract_owner(), 'Mr. Sensei should be the owner');
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_set_progress() {
        let owner = util_felt_addr('Sensei');
        let dispatcher = deploy_contract();

        // Call contract as owner
        starknet::testing::set_contract_address(owner);

        // Set progress
        dispatcher.set_progress('Joe'.try_into().unwrap(), 20);
        dispatcher.set_progress('Jill'.try_into().unwrap(), 25);

        let joe_score = dispatcher.get_progress('Joe'.try_into().unwrap());
        assert(joe_score == 20, 'Joe\'s progress should be 20');
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_set_progress_fail() {
        let dispatcher = deploy_contract();

        let jon_doe = util_felt_addr('JonDoe');
        // Caller not owner
        starknet::testing::set_contract_address(jon_doe);

        // Try to set progress, should panic to pass test!
        dispatcher.set_progress('Joe'.try_into().unwrap(), 20);
    }

    fn util_felt_addr(addr_felt: felt252) -> ContractAddress {
        addr_felt.try_into().unwrap()
    }

    fn deploy_contract() -> IProgressTrackerDispatcher {
        let owner: felt252 = 'Sensei';
        let mut calldata = ArrayTrait::new();
        calldata.append(owner);
        let (address0, _) = deploy_syscall(
            ProgressTracker::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();
        let contract0 = IProgressTrackerDispatcher { contract_address: address0 };
        contract0
    }
}
