// Address all the TODOs to make the tests pass!

// I AM NOT DONE

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

    assert(name == 'Bob', 'Wrong name');
    assert(year == order_template.year, 'Wrong year');
    assert(made_by_phone == order_template.made_by_phone, 'Wrong phone');
    assert(made_by_mobile == order_template.made_by_mobile, 'Wrong mobile');
    assert(made_by_email == order_template.made_by_email, 'Wrong email');
    assert(item_number == order_template.item_number, 'Wrong item number');
    assert(count == 0, 'Wrong count');
}

