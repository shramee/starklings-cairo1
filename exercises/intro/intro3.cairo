
// Cairo is a typed language. A popular type is `felt252`, which is like a number.
// The function below is missing some types and there are a couple errors. Can you see fix this?

// Edit this function
fn add(a: felt252, b: felt252) -> felt252 {
    let c = a + b;
    return c;
}

fn main() -> felt252 {
   add(3, 5) 
}