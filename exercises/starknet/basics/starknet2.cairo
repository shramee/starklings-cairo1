// starknet2.cairo
// Joe's contract in the last exercise showed that Joe is the owner of the contract.
// He thanks you for helping him out!
// Jill says that contract should allow setting the owner when contract is deployed.
// Help Jill rewrite the contract with a Storage and a constructor.
// There is a `ContractAddress` type which should be used for Wallet addresses.
// I AM NOT DONE
// Execute `starklings hint starknet2` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
#[contract]
mod Jills_Contract {
    // This is required to use ContractAddress type
    use starknet::ContractAddress;

    struct Storage {
        // TODO: Add `contract_owner` storage, with ContractAddress type
        
    }

    #[constructor]
    fn constructor(owner: ContractAddress) {
        // TODO: Write `owner` to contract_owner storage

    }

    #[view]
    fn whos_the_owner() -> ContractAddress {
        // TODO: Read contract_owner storage
        
    }
}

#[cfg(test)]
mod test {
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use array::SpanTrait;
    use debug::PrintTrait;
    use traits::TryInto;

    use starknet::Felt252TryIntoContractAddress;
    use option::OptionTrait;
    use super::Jills_Contract;
    #[test]
    #[available_gas(2000000000)]
    fn test_starknet1() {

        let owner: felt252 = 'Jill';
        Jills_Contract::constructor(owner.try_into().unwrap());

        let result: Span<felt252> = Jills_Contract::__external::whos_the_owner(ArrayTrait::new().span());
        let owner = *result.at(0);
        assert(owner == 'Jill', 'Owner should be Jill');
    }
}
