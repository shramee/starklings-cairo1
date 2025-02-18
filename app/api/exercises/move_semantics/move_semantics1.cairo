fn main() {
    let arr0 = ArrayTrait::new();

    let arr1 = fill_arr(arr0);

    // This is just a print statement for arrays. Don't change it.
    print(arr1.span());

    //TODO fix the error here without modifying this line.
    arr1.append(88);

    print(arr1.span());
}

fn fill_arr(arr: Array<felt252>) -> Array<felt252> {
    let mut arr = arr;

    arr.append(22);
    arr.append(44);
    arr.append(66);

    arr
}

fn print(span: Span<felt252>) { 
    let mut i = 0;
    print!("ARRAY: {{ len: {}, values: [ ", span.len());
    loop {
        if span.len() == i {
            break;
        }
        let value = *(span.at(i));
        if span.len() - 1 != i {
            print!("{}, ", value);
        } else {
            print!("{}", value);
        }
        i += 1;
    };
    println!(" ] }}");
}
