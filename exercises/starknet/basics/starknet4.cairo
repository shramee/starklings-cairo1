// starknet4.cairo
// Liz, a friend of Jill, wants to manage inventory for her store on-chain.
// This is a bit challenging for Joe and Jill, Liz prepared an outline
// for how contract should work, can you help Jill and Joe write it?
// Execute `starklings hint starknet4` or use the `hint` watch subcommand for a hint.

// I AM NOT DONE

#[contract]
mod LizInventory {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    struct Storage {
        contract_owner: ContractAddress,
        // TODO: add storage inventory, that maps product (felt252) to stock quantity (u32)

    }

    #[constructor]
    fn constructor(owner: ContractAddress) {
        contract_owner::write( owner );
    }

    #[external]
    fn add_stock() {
        // TODO:
        // * takes product and new_stock
        // * adds new_stock to stock in inventory
        // * only owner can call this

    }

    #[external]
    fn purchase() {
        // TODO:
        // * takes product and quantity
        // * subtracts quantity from stock in inventory
        // * asserting stock > quantity isn't necessary, but nice to
        //   explicitly fail first and show that the case is covered
        // * anybody can call this

    }

    #[view]
    fn get_stock() {
        // TODO:
        // * takes product
        // * returns product stock in inventory

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
        LizInventory::add_stock( 'Nano', 10);
        let stock = LizInventory::get_stock( 'Nano' );
        assert( stock == 10, 'stock should be 10' );

        LizInventory::add_stock( 'Nano', 15);
        let stock = LizInventory::get_stock( 'Nano' );
        assert( stock == 25, 'stock should be 25' );
    }

    #[test]
    #[available_gas(2000000000)]
    fn test_stock_purchase() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);

        // Call contract as owner
        starknet::testing::set_caller_address( owner );

        // Add stock
        LizInventory::add_stock( 'Nano', 10);
        let stock = LizInventory::get_stock( 'Nano' );
        assert( stock == 10, 'stock should be 10' );

        // Call contract as owner
        starknet::testing::set_caller_address( 0.try_into().unwrap() );

        LizInventory::purchase( 'Nano', 2 );
        let stock = LizInventory::get_stock( 'Nano' );
        assert( stock == 8, 'stock should be 8' );
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_set_stock_fail() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);
        // Try to add stock, should panic to pass test!
        LizInventory::add_stock( 'Nano', 20);
    }

    #[test]
    #[should_panic]
    #[available_gas(2000000000)]
    fn test_purchase_out_of_stock() {
        let owner = util_felt_addr( 'Elizabeth' );
        LizInventory::constructor(owner);
        // Purchse out of stock
        LizInventory::purchase( 'Nano', 2);
    }

    fn util_felt_addr(addr_felt: felt252) -> ContractAddress {
        addr_felt.try_into().unwrap()
    }
}
