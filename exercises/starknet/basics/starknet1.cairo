// starknet1.cairo
// Starkling, Joe, is writing a really simple contract.
// The contract shows that he is the owner of the contract.
// However, his contract is not working. What's he missing?
// I AM NOT DONE
#[contract]
mod Joes_Contract {

    fn who_wrote_the_contract() -> felt252 {
        'Joe wrote it!'
    }

}

#[cfg(test)]
mod test {
    use array::ArrayTrait;
    use array::SpanTrait;
    use super::Joes_Contract;
    #[test]
    #[available_gas(2000000000)]
    fn test_starknet1() {
        Joes_Contract::__external::who_wrote_the_contract(ArrayTrait::new().span());
    }
}
