// starknet1.cairo
// Starkling, Joe, is writing a really simple contract.
// The contract shows that he is the owner of the contract.
// However, his contract is not working. What's he missing?

// I AM NOT DONE

#[contract]
mod JoesContract {

    fn get_owner() -> felt252 {
        'Joe!'
    }

}

#[cfg(test)]
mod test {
    use array::ArrayTrait;
    use array::SpanTrait;
    use super::JoesContract;
    #[test]
    #[available_gas(2000000000)]
    fn test_contract_view() {
        JoesContract::__external::get_owner(ArrayTrait::new().span());
    }
}
