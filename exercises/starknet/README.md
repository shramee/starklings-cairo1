# Starknet Smart Contracts

A Starknet contract is pretty much a Cairo module, or rather, it's represented by one.

Starknet contract don't require a `main` function.
Functions in the contract module may be annotated as a `#[view]` or an `#[external]` function. External/View functions can be called by the users of Starknet, and by other contracts. The functions without these annotations are internal and cannot be accessed by users nor by other contract.

## Contract annotations

Here are the attributes/decorators available to annotate smart contracts.

| Annotation       | Target     | Description                                     |
| ---------------- | ---------- | ----------------------------------------------- |
| `#[contract]`    | `module`   | Marks a module as a contract                    |
| `#[constructor]` | `function` | Contract constructor, runs (only) on deployment |
| `#[view]`        | `function` | An endpoint that doesn't modify state           |
| `#[external]`    | `function` | An endpoint that modifies state                 |

## Further information

-   For more details, check out [The Structure of a Cairo Smart Contract](https://book.starknet.io/chapter_2/structure.html) in [the Starknet book](https://book.starknet.io).
