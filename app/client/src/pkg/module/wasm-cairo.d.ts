/* tslint:disable */
/* eslint-disable */
export function greet(s: string): string;
export function compileCairoProgram(cairo_program: string, replace_ids: boolean): string;
export function runCairoProgram(cairo_program: string, available_gas: number | null | undefined, allow_warnings: boolean, print_full_memory: boolean, run_profiler: boolean, use_dbg_print_hint: boolean): string;
export function runTests(cairo_program: string, allow_warnings: boolean, filter: string, include_ignored: boolean, ignored: boolean, starknet: boolean, run_profiler: string, gas_disabled: boolean, print_resource_usage: boolean): string;
export function compileStarknetContract(starknet_contract: string, allow_warnings: boolean, replace_ids: boolean): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: (a: number, b: number, c: number) => void;
  readonly compileCairoProgram: (a: number, b: number, c: number, d: number) => void;
  readonly runCairoProgram: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly runTests: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly compileStarknetContract: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number) => number;
  readonly __wbindgen_export_2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
