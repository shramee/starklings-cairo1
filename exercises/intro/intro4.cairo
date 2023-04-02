
// Remember add function from before? The `add` function below does the exact same
// thing! If you skip out a `semicolon` at the end of the function, the function 
// returns the result of that statement. Pretty neat, eh?
//
// Young Starkling, Joe, tried to write his own `sub` function, but his function
// won't compile. Can you help him out?

fn add(a: felt252, b: felt252) -> felt252 {
    a + b
}

// Edit this function
fn sub(a: felt252, b: felt252) -> felt252 {
    a - b
}

fn main() -> felt252 {
   add(3, 5);
   sub(11, 7)
}