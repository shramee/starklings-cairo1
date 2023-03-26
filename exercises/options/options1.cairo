// options1.cairo
// Execute `starklings hint options1` or use the `hint` watch subcommand for a hint.


use option::OptionTrait;

// This function returns how much icecream there is left in the fridge.
// If it's before 10PM, there's 5 pieces left. At 10PM, someone eats them
// all, so there'll be no more left :(
fn maybe_icecream(time_of_day: usize) -> Option<usize> {
    // We use the 24-hour system here, so 10PM is a value of 22 and 12AM is a value of 0
    // The Option output should gracefully handle cases where time_of_day > 23.
    // TODO: Complete the function body - remember to return an Option!
    if (time_of_day < 22_usize){
        Option::Some(5_usize)
    } else if (time_of_day < 24_usize){
        Option::Some(0_usize)
    } else {
        Option::None(())
    }
}

 
#[test]
fn check_icecream() {
    assert(maybe_icecream(9_usize).unwrap() == 5_usize, 'err_1');
    assert(maybe_icecream(10_usize).unwrap() == 5_usize, 'err_2');
    assert(maybe_icecream(23_usize).unwrap() == 0_usize, 'err_3');
    assert(maybe_icecream(22_usize).unwrap() == 0_usize, 'err_4');
    assert(maybe_icecream(25_usize).is_none(), 'err_5');
}

#[test]
fn raw_value() {
    // TODO: Fix this test. How do you get at the value contained in the Option?
    let icecreams = maybe_icecream(12_usize);
    assert(icecreams.unwrap() == 5_usize, 'err_6');
}