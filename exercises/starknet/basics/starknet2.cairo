// Joe's contract in the last exercise showed that Joe is the owner of the contract.
// He thanks you for helping him out!
// Jill says that contract should allow setting the owner when contract is deployed.
// Help Jill rewrite the contract with a Storage and a constructor.
// There is a `ContractAddress` type which should be used for Wallet addresses.

// I AM NOT DONE

use starknet::ContractAddress;

#[starknet::contract]
mod JillsContract {
    // This is required to use ContractAddress type
    use starknet::ContractAddress;

    #[storage]
    struct Storage { // TODO: Add `contract_owner` storage, with ContractAddress type
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, owner: ContractAddress
    ) { // TODO: Write `owner` to contract_owner storage
    }

    #[abi(embed_v0)]
    impl IJillsContractImpl of super::IJillsContract<ContractState> {
        fn get_owner(self: @ContractState) -> ContractAddress { // TODO: Read contract_owner storage
        }
    }
}

#[starknet::interface]
trait IJillsContract<TContractState> {
    fn get_owner(self: @TContractState) -> ContractAddress;
}

#[cfg(test)]
mod test {
    use starknet::syscalls::deploy_syscall;
    use super::IJillsContractDispatcher;
    use super::IJillsContractDispatcherTrait;

    use super::JillsContract;
    #[test]
    #[available_gas(2000000000)]
    fn test_owner_setting() {
        let mut calldata = ArrayTrait::new();
        calldata.append('Jill');
        let (address0, _) = deploy_syscall(
            JillsContract::TEST_CLASS_HASH.try_into().unwrap(), 0, calldata.span(), false
        )
            .unwrap();
        let dispatcher = IJillsContractDispatcher { contract_address: address0 };
        let owner = dispatcher.get_owner();
        assert(owner == 'Jill'.try_into().unwrap(), 'Owner should be Jill');
    }
}
