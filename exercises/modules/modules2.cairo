// I AM NOT DONE
// These modules have some issues, can you fix?
// Run `starklings hint modules2` or `hint` watch command for a hint.

use debug::PrintTrait;
const YEAR: u16 = 2050;

mod order {
    #[derive(Copy, Drop)]
    struct Order {
        name: felt252,
        year: u16,
        made_by_phone: bool,
        made_by_email: bool,
        item: felt252,
    }

    fn new_order(name: felt252, made_by_phone: bool, item: felt252) -> Order {
        Order { name, year: YEAR, made_by_phone, made_by_email: !made_by_phone, item,  }
    }
}

mod order_utils {
    fn dummy_phoned_order(name: felt252) -> Order {
        new_order(name, true, 'item_a')
    }

    fn dummy_emailed_order(name: felt252) -> Order {
        new_order(name, false, 'item_a')
    }

    fn order_fees(order: Order) -> felt252 {
        if order.made_by_phone {
            return 500;
        }

        200
    }
}

#[test]
fn test_array() {
    let order1 = order_utils::dummy_phoned_order('John Doe');
    let fees1 = order_utils::order_fees(order1);
    assert(fees1 == 500, 'Order fee should be 500');

    let order2 = order_utils::dummy_emailed_order('Jane Doe');
    let fees2 = order_utils::order_fees(order2);
    assert(fees2 == 200, 'Order fee should be 200');
}
