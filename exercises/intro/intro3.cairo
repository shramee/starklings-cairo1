
// Cairo is a typed language. A popular type is `felt`, which is like a number.
// The function below is missing some types and there are a couple errors. Can you see fix this?

// Edit this function
fn add(a: felt, b:felt) ->(felt) {
    let c = a + b;
    return c;
}

fn main() -> (felt) {
 let result_add =  add(3, 5);

 return result_add; 
}