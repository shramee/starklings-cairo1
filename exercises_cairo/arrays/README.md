# Arrays

Arrays are defined in the Cairo core library. They are a dynamically sized collection of elements of the same type. You can create and use array methods by importing the `array::ArrayTrait` trait.
An important thing to note is that arrays are append-only. This means that you can only add elements to the end of an array.
You cannot remove elements from an array, or modify the elements in an array.
This has to do with the fact that once a memory slot is written to, it cannot be overwritten, but only read from it.

## Further information

- [Arrays](https://book.cairo-lang.org/ch03-01-arrays.html)
- [Core library](https://github.com/starkware-libs/cairo/blob/main/corelib/src/array.cairo)
- [Cairo memory model](https://medium.com/nethermind-eth/cairo-fundamentals-stacked-up-against-evm-and-solidity-1d8d4e12b2c3#2c01)
