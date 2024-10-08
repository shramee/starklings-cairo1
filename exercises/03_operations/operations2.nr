// And always watch out for overflows e.g in the last test
// Let try to use them

// I AM NOT DONE

fn modulus(x: u8, y: u8) -> u8 {
    // calculate the modulus of x and y
    // FILL ME
    res
}

fn floor_division(x: u32, y: u32) -> u32 {
    // calculate the floor_division of x and y
    // FILL ME
    res
}

fn multiplication(x: u64, y: u64) -> u64 {
    // calculate the multiplication of x and y
    // FILL ME
    res
}


// Do not change the tests
#[test]
fn test_modulus() {
    let res = modulus(16, 2);
    assert(res == 0);
    

    let res = modulus(17, 3);
    assert(res == 2);
}

#[test]
fn test_floor_division() {
    let res = floor_division(160, 2);
    assert(res == 80);

    let res = floor_division(21, 4);
    assert(res == 5);
}

#[test]
fn test_mul() {
    let res = multiplication(16, 2);
    assert(res == 32);

    let res = multiplication(21, 4);
    assert(res == 84);
}

#[test(should_fail)]
fn test_u64_mul_overflow_1() {
    let _res = multiplication(0x100000000, 0x100000000);
}
