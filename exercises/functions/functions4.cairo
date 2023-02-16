// functions4.cairo
// Execute `starklings hint functions4` or use the `hint` watch subcommand for a hint.

// This store is having a sale where if the price is an even number, you get
// 10 Cairobucks off, but if it's an odd number, it's 3 Cairobucks off.
// (Don't worry about the function bodies themselves, we're only interested
// in the signatures for now. If anything, this is a good way to peek ahead
// to future exercises!)

// I AM NOT DONE

fn main() {
    let original_price = 51_u64;
    debug::print_felt(u64_to_felt(sale_price(original_price)));
}

fn sale_price(price: u64) -> u64 {
    if is_even(price) {
        price - 10_u64
    } else {
        price - 3_u64
    }
}

fn is_even(num: u64) -> bool {
    num % 2_u64 == 0_u64
}
