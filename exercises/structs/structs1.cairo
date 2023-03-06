// structs1.cairo
// Address all the TODOs to make the tests pass!
// Execute `starklings hint structs1` or use the `hint` watch subcommand for a hint.

#[derive(Copy, Drop)]
struct ColorStruct {
    // TODO: Something goes here
    // TODO: Your struct needs to have red, green, blue felts
    red:felt,
    green:felt,
    blue:felt,
}


#[test]
fn classic_c_structs() {
    // TODO: Instantiate a classic color struct!
    // Green color neeeds to have green set to 255 and, red and blue, set to 0
    // initialize struct here:
    let green = ColorStruct{green:255,red:0,blue:0};

    assert(green.red == 0, 0);
    assert(green.green == 255, 0);
    assert(green.blue == 0, 0);
}
