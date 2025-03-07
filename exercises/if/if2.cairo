// Step 1: Make me compile!
// Step 2: Get the bar_for_fuzz and default_to_baz tests passing!

// I AM NOT DONE

fn foo_if_fizz(fizzish: felt252) -> felt252 {
    // Complete this function using if, else if and/or else blocks.
    // If fizzish is,
    // 'fizz', return 'foo'
    // 'fuzz', return 'bar'
    // anything else, return 'baz'
    if fizzish == 'fizz' {
        'foo'
    } else {
        1_u32
    }
}

// No test changes needed!
#[cfg(test)]
mod tests {
    use super::foo_if_fizz;

    #[test]
    fn foo_for_fizz() {
        assert(foo_if_fizz('fizz') == 'foo', 'fizz returns foo')
    }

    #[test]
    fn bar_for_fuzz() {
        assert(foo_if_fizz('fuzz') == 'bar', 'fuzz returns bar');
    }

    #[test]
    fn default_to_baz() {
        assert(foo_if_fizz('literally anything') == 'baz', 'anything else returns baz');
    }
}
