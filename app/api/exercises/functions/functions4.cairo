fn main() {
    let original_price = 51;
    println!("sale_price is {}", sale_price(original_price));
}

fn sale_price(price: u32) -> {
    if is_even(price) {
        price - 10
    } else {
        price - 3
    }
}

fn is_even(num: u32) -> bool {
    num % 2 == 0
}
