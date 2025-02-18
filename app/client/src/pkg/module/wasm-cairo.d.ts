/* tslint:disable */
/* eslint-disable */
/**
* @param {string} s
* @returns {string}
*/
export function greet(s: string): string;
/**
* @param {string} cairo_program
* @param {boolean} replace_ids
* @returns {string}
*/
export function compileCairoProgram(cairo_program: string, replace_ids: boolean): string;
/**
* @param {string} cairo_program
* @param {number | undefined} available_gas
* @param {boolean} allow_warnings
* @param {boolean} print_full_memory
* @param {boolean} run_profiler
* @param {boolean} use_dbg_print_hint
* @returns {string}
*/
export function runCairoProgram(cairo_program: string, available_gas: number | undefined, allow_warnings: boolean, print_full_memory: boolean, run_profiler: boolean, use_dbg_print_hint: boolean): string;
/**
* @param {string} cairo_program
* @param {boolean} allow_warnings
* @param {string} filter
* @param {boolean} include_ignored
* @param {boolean} ignored
* @param {boolean} starknet
* @param {string} run_profiler
* @param {boolean} gas_disabled
* @param {boolean} print_resource_usage
* @returns {string}
*/
export function runTests(cairo_program: string, allow_warnings: boolean, filter: string, include_ignored: boolean, ignored: boolean, starknet: boolean, run_profiler: string, gas_disabled: boolean, print_resource_usage: boolean): string;
/**
* @param {string} starknet_contract
* @param {boolean} allow_warnings
* @param {boolean} replace_ids
* @returns {string}
*/
export function compileStarknetContract(starknet_contract: string, allow_warnings: boolean, replace_ids: boolean): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: (a: number, b: number, c: number) => void;
  readonly compileCairoProgram: (a: number, b: number, c: number, d: number) => void;
  readonly runCairoProgram: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly runTests: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number) => void;
  readonly compileStarknetContract: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_0: (a: number, b: number) => number;
  readonly __wbindgen_export_1: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
