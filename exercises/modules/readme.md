# Modules

Modules allow creating individual scopes and organise your code better. Read about [modules in cairo book](https://book.cairo-lang.org/ch07-02-defining-modules-to-control-scope.html).

Here's some code to show modules at play,

## Declaring modules

Modules can be declared in two ways,

| Code            | Description                  |
| --------------- | ---------------------------- |
| `mod filename;` | Module from a filename.cairo |
| `mod { ... }`   | Inline module code in braces |

In the exercises we'll use inline modules, but the behaviour is identical.

### `lib.cairo`

```rust
// Module from a file
mod restaurant;

fn main() {
	// ...
}
```

### `restaurant.cairo`

```rust
fn add_to_waitlist() {}
fn seat_at_table() {}

// Inline modules
mod serving {
    fn take_order() {}
    fn serve_order() {}
}

mod checkout {
    fn get_bill() {}
    fn collect_payment() {}
}
```

## Using stuff in modules

| Keyword | Description         | Example                   |
| ------- | ------------------- | ------------------------- |
| `super` | Access parent scope | `super::my_module::my_fn` |
| `use`   | Create shortcuts    | `use my_module::my_fn`    |

### `lib.cairo`

```rust
// ...
use restaurant::seat_at_table; // Creates shortcut to seat_at_table
use restaurant::serving::serve_order; // Another shortcut
use restaurant::checkout; // Shortcut to a module


fn main() {
	restaurant::add_to_waitlist();
	seat_at_table(); // Shortcut thanks to use

	restaurant::serving::take_order();
	serve_order(); // Via shortcut
}

mod cutomer_checkout {
	fn start() {
		super::checkout::collect_payment();
	}
}
```
