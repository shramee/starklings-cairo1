// Integer types implement basic comparison and arithmetic operators.
// Felt252 operations should be avoided where possible, as they could have unwanted behavior.


// TODO
// Return the solution of x^3 + y - 2

use debug::PrintTrait;

fn poly(x: u32, y: u32) -> u32 {
    // FILL ME
    let res = (x*x*x) + y - 2_u32;
    res // Do not change
}


// Do not change the test function
#[test]
fn test_poly() {
    let res = poly(5_usize, 3_usize);
    assert(res == 126_usize, 'Error message');
    assert(res < 300_usize, 'res < 300');
    assert(res <= 300_usize, 'res <= 300');
    assert(res > 20_usize, 'res > 2');
    assert(res >= 2_usize, 'res >= 2');
    assert(res != 27_usize, 'res != 27');
}

