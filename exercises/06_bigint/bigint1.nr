// Address all the TODOs to make the tests pass!
use std::bigint;

// I AM NOT DONE

// TODO: Create the bigintegers 0x4141 and 0x4242 of type bigint::Bn254Fr
fn create_bigints() -> (bigint::Bn254Fr, bigint::Bn254Fr) {
    // FIX THIS
    (a, b)
}



#[test]
fn bigint_addition() {

    let (a, b) = create_bigints();

    let expected_result = bigint::Bn254Fr::from_le_bytes(&[0x83, 0x83]);
    let result = a + b;

    assert(result == expected_result, "Wrong result!");
}
