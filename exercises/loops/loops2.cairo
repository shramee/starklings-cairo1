

// I AM NOT DONE

#[test]
#[available_gas(200000)]
fn test_loop() {
    let mut counter = 0;

    let result = loop {
        if counter == 5 {
    //TODO return a value from the loop
        }
        counter += 1;
    };

    assert(result == 5, 'result should be 5');
}
