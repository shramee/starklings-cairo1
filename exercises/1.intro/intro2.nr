// I AM NOT DONE

fn main(x: Field, y: pub Field) {
    assert(x != y);
}

#[test]
fn test_main() {
    main(1, 2);
    // ^^^^^^^^ MODIFY THIS TO MAKE THE TEST PASS
}
