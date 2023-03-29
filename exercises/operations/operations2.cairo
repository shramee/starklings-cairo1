// Remember last time you calculated division in Cairo0?
// Now Cairo1 has native integer types e.g. u8, u32, ...u256, usize which support more operators than felts
// And always watch out for overflows e.g in the last test
// Let try to use them

// I AM NOT DONE


fn modulus(x : u8, y: u8) ->  u8 {
    // calculate the modulus of x and y
    // FILL ME
    res
}

fn floor_division(x: usize, y: usize) -> u32 {
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
fn test_modulus(){
    let res = modulus(16_u8, 2_u8);
    assert(res==0_u8, 'Error message');

    let res = modulus(17_u8, 3_u8);
    assert(res==2_u8, 'Error message');
}

#[test]
fn test_floor_division(){
    let res = floor_division(160_usize, 2_usize);
    assert(res==80_usize, 'Error message');

    let res = floor_division(21_usize, 4_usize);
    assert(res==5_usize, 'Error message');
}

#[test]
fn test_mul(){
    let res = multiplication(16_u64, 2_u64);
    assert(res==32_u64, 'Error message');

    let res = multiplication(21_u64, 4_u64);
    assert(res==84_u64, 'Error message');
}

#[test]
#[should_panic]
fn test_u64_mul_overflow_1() {
    let res = multiplication(0x100000000_u64, 0x100000000_u64);
}
