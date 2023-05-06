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

## Storage

Contract storage is represented as a `struct` with name `Storage`.

```rust
struct Storage {
	store: felt252, // Can be any type

	// A u128 mapping to a bool
	mapped: LegacyMap::<u128, bool>,

	// Use `tuple`s to have multiple values mapping
	// Here a `ContractAddress` and a `u32` mapping to a Job struct
	multi_map: LegacyMap::<(ContractAddress, u32), Job>,
}
```

The keys of the struct are made into their own modules, these modules have `read` and `write` functions.

```rust
#[external]
fn play {
	store::write( 592 );
	let value = store::read(); // 592
}
```

## `ContractAddress` type

`ContractAddress` type is a semantic type for wallet/contract addresses.

```rust
use starknet::ContractAddress;
use traits::TryInto; // Base TryInto trait
use starknet::Felt252TryIntoContractAddress; // felt > ContractAddress impl
use starknet::contract_address_to_felt252;
use option::OptionTrait; // To unwrap

use debug::PrintTrait; // Just for printing
#[test]
#[available_gas(2000000000)]
fn play() {
	let owner_felt: felt252 = 0x0390595E0f30299328F610C689fcFf5B0ee48eE971f0742b5568e5Dd1DE6e324;

	// Felt to ContractAddress
	let owner_addr: ContractAddress = owner_felt.try_into().unwrap();
	owner_addr.print();

	// ContractAddress to Felt
	let owner_felt: felt252 = contract_address_to_felt252(owner_addr);
	owner_felt.print();
}
```

## Further information

-   For more details, check out [The Structure of a Cairo Smart Contract](https://book.starknet.io/chapter_2/structure.html) in [the Starknet book](https://book.starknet.io).
