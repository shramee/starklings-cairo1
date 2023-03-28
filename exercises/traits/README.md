# Traits

A trait is a collection of methods.

Data types can implement traits. To do so, the methods making up the trait are defined for the data type. For example, the `felt` data type implements the `Into` trait. This allows a user to write `1.into()` to convert a felt into a u256.

In this way, traits are somewhat similar to Java interfaces and C++ abstract classes.

Because traits indicate shared behavior between data types, they are useful when writing generics.

- [Traits & Impls](https://medium.com/nethermind-eth/a-first-look-at-cairo-1-0-a-safer-stronger-simpler-provable-programming-language-892ce4c07b38#83b5)
