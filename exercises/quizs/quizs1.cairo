// Mary is buying apples. The price of an apple is calculated as follows:
// - An apple costs 3 cairobucks.
// - If Mary buys more than 40 apples, each apple only costs 2 cairobuck!
// Write a function that calculates the price of an order of apples given
// the quantity bought. No hints this time!


// Put your function here!
fn calculate_price_of_apples(apples:usize) -> (usize){
    let mut price:usize = 3_usize;
    let quantity:usize = 40_usize;

    if apples <= quantity {
    return apples * price; 
    } else {
    price = 2_usize;
    return apples * price;
    }
    
}


// Do not change the tests!
#[test]
fn verify_test() {
    let price1 = calculate_price_of_apples(35_usize);
    let price2 = calculate_price_of_apples(40_usize);
    let price3 = calculate_price_of_apples(41_usize);
    let price4 = calculate_price_of_apples(65_usize);

    assert(105_usize == price1, 'Incorrect price');
    assert(120_usize == price2, 'Incorrect price');
    assert(82_usize == price3, 'Incorrect price');
    assert(130_usize == price4, 'Incorrect price'); 
}
