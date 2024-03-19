# Options

The **`Option`** type represents an optional value: every **`Option`** is either **`Some`** and contains a value, or **`None`**, and does not contain a value. **`Option`** types are very common in Cairo code because they serve a variety of purposes:

- Initial values
- Return values for functions that are not defined over their entire input range (partial functions)
- Return values for functions that report simple errors, where **`None`** is returned in case of an error
- Optional struct fields
- Optional function arguments

## Further Information

- [Option Implementation](https://book.cairo-lang.org/ch06-01-enums.html#the-option-enum-and-its-advantages)
