# Starknet Smart Contracts

A Starknet contract can be created by annotating a Cairo module with the `#[starknet::contract]` attribute.

Starknet contract don't require a `main` function.
Functions in the contract module may be annotated as `#[external(v0)]` function. External functions can be called by the users of Starknet, and by other contracts.

 The functions without these annotations are internal and cannot be accessed by users nor by other contract.

 Functions in starknet contract have to explicitly define when writing to storage or reading from storage, by specifying the `ref self` when writing to storage or `self` when reading from state.

e.g 

`fn write(ref self: ContractState){}`

`fn read (self: ContractState) -> type{}`

where `self` stands for the contract state, seeing the `self` pass by reference as arguement tell us that it mutates state, as it gives access to the contract storage. 


#  Contract Interface
Contract Interfaces is annotated with the `#[starknet::interface]` attribute. The constructor is not a part of the interface nor are internal function part of the interface.

## Contract annotations

Here are the attributes/decorators available to annotate smart contracts.

| Annotation       | Target     | Description                                     |
| ---------------- | ---------- | ----------------------------------------------- |
| `#[starknet::contract]`    | `module`   | Marks a module as a contract                    |
| `#[constructor]` | `function` | Contract constructor, runs (only) on deployment |         |
| `#[external(v0)]`    | `function` | An endpoint that modifies state   
 

## Storage

Contract storage is represented as a `struct` with name `Storage` and annotated with the `#[storage]` attribute.

```rust
#[storage]
struct Storage {
	store: felt252, // Can be any type

	// A u32 mapping to a bool
	mapped: LegacyMap::<u32, bool>,

	// Use `tuple`s to have multiple values mapping
	// Here a `ContractAddress` and a `u32` mapping to a Job struct
	multi_map: LegacyMap::<(ContractAddress, u32), Job>,
}
```

The keys of the struct are made into their own modules, these modules have `read` and `write` functions.

```rust
#[external(v0)]
fn play(ref self: ContractState) {
	self.store.write( 592 );
	let value = self.store.read(); // 592
}
```

`LegacyMap` types require a parameter with type matching the first generic type of the map when `read`/`write`.

```rust
#[external(v0)]
fn play(ref self:ContractState) {
	self.mapped.write( 83_u32, true );
	let value = self.multi_map.read( 83_u32 ); // true
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
use starknet::get_caller_address; // Gets caller address

use debug::PrintTrait; // Just for printing
#[test]
#[available_gas(2000000000)]
fn play() {
	let owner_felt: felt252 = 0x0390595E0f30299328F610C689fcFf5B0ee48eE971f0742b5568e5Dd1DE6e324;

	// Felt to ContractAddress
	let owner_addr: ContractAddress = owner_felt.try_into().unwrap();
	owner_addr.print();

	let caller = get_caller_address();
	// ContractAddress to Felt
	let owner_felt: felt252 = contract_address_to_felt252(caller);
	owner_felt.print();
}
```

## Further information

-   For more details, check out [A deep dive into Starknet Contract](https://book.cairo-lang.org/ch99-01-03-00-a-deeper-dive-into-contracts.html) in [the Cairo book](https://book.cairo-lang.org/).
-   [Cross-contract interactions](https://cairo-book.github.io/ch99-02-00-abis-and-cross-contract-interactions.html)
- [Development Proposal](https://community.starknet.io/t/cairo-1-contract-syntax-is-evolving/94794)