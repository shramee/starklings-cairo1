# Arrays

Arrays are defined in the Cairo core library. They are a dynamically sized collection of elements of the same type. You can create and use array methods by importing the `array::ArrayTrait` trait.
An important thing to note is that arrays are append-only. This means that you can only add elements to the end of an array.
You cannot remove elements from an array, or modify the elements in an array.
This has to do with the fact that once a memory slot is written to, it cannot be overwritten, but only read from it.

## Further information

- [Arrays](https://link.medium.com/MeQ1Agthrxb#570c)
- [Core library](https://github.com/starkware-libs/cairo/blob/main/corelib/src/array.cairo)
- [Cairo memory model](https://link.medium.com/o5ZpTQOPuxb#2c01)
