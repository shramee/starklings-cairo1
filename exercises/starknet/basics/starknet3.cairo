// starknet3.cairo
// Joe liked Jill's work very much. He really likes how useful storage can be.
// Now they decided to write a contract to track the number of exercises they
// complete successfully. Jill says they can use the owner code and allow
// only the owner to update the contract, they agree.
// Can you help them write this contract?

// I AM NOT DONE

#[contract]
mod ProgressTracker {
    use starknet::ContractAddress;
    use starknet::get_caller_address; // Required to use get_caller_address function

    struct Storage {
        contract_owner: ContractAddress,
        // TODO: Set types for LegacyMap
        progress: LegacyMap<>
    }

    #[constructor]
    fn constructor(owner: ContractAddress) {
        contract_owner::write( owner );
    }

    #[external]
    fn set_progress(user: ContractAddress, new_progress: u16) {
        // TODO: assert owner is calling
        // TODO: set new_progress for user,
    }

    #[view]
    fn get_progress(user: ContractAddress) -> felt252 {
        // Update user progress
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
    use super::ProgressTracker;

    #[test]
    #[available_gas(2000000000)]
    fn test_owner() {

        let owner: felt252 = 'Sensei';
        let owner: ContractAddress = owner.try_into().unwrap();
        ProgressTracker::constructor(owner);

        // Check that contract owner is set
        let contract_owner = ProgressTracker::contract_owner::read();
        assert(contract_owner == owner, 'Mr. Sensei should be the owner');
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_set_progress() {
        let owner = util_felt_addr( 'Sensei' );
        ProgressTracker::constructor(owner);

        // Call contract as owner
        starknet::testing::set_caller_address( owner );

        // Set progress
        ProgressTracker::__external::set_progress( util_span_2_items( 'Joe', 20 ) );
        ProgressTracker::__external::set_progress( util_span_2_items( 'Jill', 25 ) );

        let joe_score = util_get_span_first( ProgressTracker::__external::get_progress( util_span_1_item( 'Joe' ) ) );
        assert( joe_score == 20, 'Joe\'s progress should be 20' );
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_set_progress_fail() {
        let owner = util_felt_addr( 'Sensei' );
        ProgressTracker::constructor(owner);

        let jon_doe = util_felt_addr( 'JonDoe' );
        // Caller not owner
        starknet::testing::set_caller_address( jon_doe );

        // Try to set progress, should panic to pass test!
        ProgressTracker::__external::set_progress( util_span_2_items( 'Joe', 20 ) );
    }

    fn util_span_2_items(item1: felt252 , item2: felt252) -> Span<felt252> {
        let mut arr = ArrayTrait::new();
        arr.append( item1 );
        arr.append( item2 );
        arr.span()
    }

    fn util_span_1_item( item: felt252 ) -> Span<felt252> {
        let mut arr = ArrayTrait::new();
        arr.append( item );
        arr.span()
    }

    fn util_get_span_first( result: Span<felt252> ) -> felt252 {
        *result.at(0)
    }

    fn util_felt_addr(addr_felt: felt252) -> ContractAddress {
        addr_felt.try_into().unwrap()
    }
}
