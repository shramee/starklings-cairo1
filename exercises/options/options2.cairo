// options2.cairo
// Execute `starklings hint options2` or use the `hint` watch subcommand for a hint.

use option::OptionTrait;
use debug::PrintTrait;

fn simple_option(optional_target: Option<felt252>) {
    // TODO: use the `is_some` and `is_none` methods to check if `optional_target` contains a value.
    // Place the assertion and the print statement below in the correct blocks.
    match optional_target {
        Option::Some(target) => { assert(optional_target.unwrap() == 'starklings', 'err1'); },
        Option::None(_) => { ('option is empty !').print(); }
    }
}
