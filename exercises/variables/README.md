# Variables

In Cairo, variables are immutable by default.
When a variable is immutable, once a value is bound to a name, you can’t change that value.
You can make them mutable by adding mut in front of the variable name.

It is however important to clarify the fact that even though the variable can be made mutable, Cairo works with an immutable memory model, meaning that changing the value of a variable will not change the value in memory but rather assign a new memory location to that variable.

## Further information

- [Memory model (from Cairo 0)](https://www.cairo-lang.org/docs/how_cairo_works/cairo_intro.html#memory-model)
- [Variables](https://book.cairo-lang.org/ch02-01-variables-and-mutability.html)
- [Integer types](https://book.cairo-lang.org/ch02-02-data-types.html#integer-types)
