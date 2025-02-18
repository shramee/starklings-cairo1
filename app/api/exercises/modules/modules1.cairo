mod restaurant {
    pub fn take_order() -> felt252 {
        'order_taken'
    }
}

#[test]
fn test_mod_fn() {
    // Fix this line to call take_order function from module
    let order_result = take_order();

    assert(order_result == 'order_taken', 'Order not taken');
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_super_fn() {
        // Fix this line to call take_order function
        let order_result = take_order();

        assert(order_result == 'order_taken', 'Order not taken');
    }
}
