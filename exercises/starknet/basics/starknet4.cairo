// starknet4.cairo
// Liz, a friend of Jill, wants to manage inventory for her store on-chain.
// This is a bit challenging for Joe and Jill, Liz prepared an outline
// for how contract should work, can you help Jill and Joe write it?
// I AM NOT DONE
// Execute `starklings hint starknet4` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE
#[contract]
mod LizInventory {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    struct Storage {
        contract_owner: ContractAddress,
        // TODO: add storage inventory, that maps product_id to stock quantity
    }

    #[constructor]
    fn constructor(owner: ContractAddress) {
        contract_owner::write( owner );
    }

    #[external]
    fn add_stock() {
        // TODO: takes product_id and new_stock
        // adds new_stock to stock in inventory
        // only owner can call this
    }

    #[external]
    fn purchase() {
        // TODO: takes product_id and quantity
        // subtracts quantity from stock in inventory
        // anybody can call this, assert stock > quantity
    }

    #[view]
    fn get_stock() {
        // TODO: return product stock in inventory
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
    use super::LizInventory;

    #[test]
    #[available_gas(2000000000)]
    fn test_owner() {

        let owner: felt252 = 'Elizabeth';
        let owner: ContractAddress = owner.try_into().unwrap();
        LizInventory::constructor(owner);

        // Check that contract owner is set
        let contract_owner = LizInventory::contract_owner::read();
        assert(contract_owner == owner, 'Elizabeth should be the owner');
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_stock() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);

        // Call contract as owner
        starknet::testing::set_caller_address( owner );

        // Add stock
        LizInventory::__external::add_stock( util_span_2_items( 'Nano', 10 ) );
        let joe_score = util_get_span_first( LizInventory::__external::get_stock( util_span_1_item( 'Nano' ) ) );
        assert( joe_score == 10, 'stock should be 10' );

        LizInventory::__external::add_stock( util_span_2_items( 'Nano', 15 ) );
        let joe_score = util_get_span_first( LizInventory::__external::get_stock( util_span_1_item( 'Nano' ) ) );
        assert( joe_score == 25, 'stock should be 25' );
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_stock_purchase() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);

        // Call contract as owner
        starknet::testing::set_caller_address( owner );

        // Add stock
        LizInventory::__external::add_stock( util_span_2_items( 'Nano', 10 ) );
        let joe_score = util_get_span_first( LizInventory::__external::get_stock( util_span_1_item( 'Nano' ) ) );
        assert( joe_score == 10, 'stock should be 10' );

        // Call contract as owner
        starknet::testing::set_caller_address( 0.try_into().unwrap() );

        LizInventory::__external::purchase( util_span_2_items( 'Nano', 2 ) );
        let joe_score = util_get_span_first( LizInventory::__external::get_stock( util_span_1_item( 'Nano' ) ) );
        assert( joe_score == 8, 'stock should be 8' );
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_set_stock_fail() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);
        // Try to add stock, should panic to pass test!
        LizInventory::__external::add_stock( util_span_2_items( 'Nano', 20 ) );
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_purchase_out_of_stock() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);
        // Purchse out of stock
        LizInventory::__external::purchase( util_span_2_items( 'Nano', 2 ) );
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
