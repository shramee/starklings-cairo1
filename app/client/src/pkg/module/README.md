WASM runtime for Cairo language and Starknet

<div align="center">

  <h1><code>WASM-Cairo</code></h1>

  <strong>A suite of development tools and an environment for Cairo, all based on WebAssembly.</strong>

  [Homepage](https://wasm-cairo-landing.vercel.app/)
  
  [Github](https://github.com/cryptonerdcn/wasm-cairo)

  <sub>Built with 🦀🕸 by <a href="https://twitter.com/cryptonerdcn">cryptonerdcn from Starknet Astro</a></sub>
</div>


## 🚴 Usage

How to use:
1. You can download the precompiled wasm file from [here](https://github.com/cryptonerdcn/wasm-cairo/releases).
2. If you want to use WASM-Cairo in your Web App, you can also use npm package [wasm-cairo](https://www.npmjs.com/package/wasm-cairo).

If you prefer to build it yourself, you can follow the steps below.

### 🛠️ Build WASM-bindgen's WASM-Cairo Toolkit 
With Modules

```
wasm-pack build --release --target web --out-dir output/module/pkg --out-name wasm-cairo
```

No Modules

```
wasm-pack build --release --target no-modules --out-dir output/no_module/pkg --out-name wasm-cairo
```

You will find `wasm-cairo_bg.wasm` and `wasm-cairo.js` in `pkg` folder.

#### Pack & Publish

With Modules
```
wasm-pack pack output/module
wasm-pack publish  
```

No Modules
```
wasm-pack pack output/no_module 
```

Caution: Do not run `wasm-pack publish` after `wasm-pack pack output/no_module`. It will publish the no-modules version.

### 🛠️ Build WASMTIME's WASM-Cairo Toolkit

```
cargo build --target wasm32-wasi --release
```

You can test it by using: 

Compile Cairo

```
./wasmtime_test.sh compileCairoProgram ./cairo_files/HelloStarknetAstro.cairo ./cairo_files/HelloStarknetAstro.sierra
```

Run
```
./wasmtime_test.sh runCairoProgram ./cairo_files/HelloStarknetAstro.cairo
```

Run Tests
```
./wasmtime_test.sh runTests ./cairo_files/Test.cairo
```

Compile Contract

```
./wasmtime_test.sh compileStarknetContract ./cairo_files/storage.cairo ./cairo_files/storage.json  
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
* [`Cairo`](https://github.com/starkware-libs/cairo) for Cairo-lang support.
* `LICENSE-APACHE`.

## License

* Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally
submitted for inclusion in the work by you, as defined in the Apache-2.0
license, shall be dual licensed as above, without any additional terms or
conditions.