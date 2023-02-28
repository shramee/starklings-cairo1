
// Remember add function from before? The `add` function below does the exact same
// thing! If you skip out a `semicolon` at the end of the function, the function 
// returns the result of that statement. Pretty neat, eh?
//
// Young Starkling, Joe, tried to write his own `sub` function, but his function
// won't compile. Can you help him out?

fn add(a: felt, b: felt) -> felt {
  return a + b;
}

// Edit this function
fn sub(a:felt, b:felt)-> felt {
   return a - b;
}

fn main() -> felt {
  let result_add = add(3, 5);
  let result_sub = sub(11, 7);
  
  return result_add - result_sub;
}