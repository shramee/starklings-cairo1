// structs2.cairo
// Address all the TODOs to make the tests pass!
// Execute `starklings hint structs2` or use the `hint` watch subcommand for a hint.

#[derive(Copy, Drop)]
struct Order {
    name: felt252,
    year: felt252,
    made_by_phone: bool,
    made_by_mobile: bool,
    made_by_email: bool,
    item_number: felt252,
    count: felt252,
}

fn create_order_template() -> Order {
    Order {
        name: 'Bob',
        year: 2019,
        made_by_phone: false,
        made_by_mobile: false,
        made_by_email: true,
        item_number: 123,
        count: 0
    }
}
#[test]
fn test_your_order() {
    let order_template = create_order_template();
    // TODO: Destructure your order into multiple variables to make the assertions pass!
    // let ...
    let name: felt252 = order_template.name;
    let year: felt252 = order_template.year;
    let made_by_phone: bool = order_template.made_by_phone;
    let made_by_mobile: bool = order_template.made_by_mobile;
    let made_by_email: bool = order_template.made_by_email;
    let item_number: felt252 = order_template.item_number;
    let count: felt252 = order_template.count;
}

