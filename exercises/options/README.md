# Options

Type Option represents an optional value: every Option is either Some and contains a value, or None, and does not.
Option types are very common in Cairo code, as they have a number of uses:

- Initial values
- Return values for functions that are not defined over their entire input range (partial functions)
- Return value for otherwise reporting simple errors, where None is returned on error
- Optional struct fields
- Optional function arguments

## Further Information

- [Option Implementation](https://book.cairo-lang.org/ch06-01-enums.html#the-option-enum-and-its-advantages)
