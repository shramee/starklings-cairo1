import { compileCairoCode } from "../utils/compileCairoCode";
import __wbg_init from "../pkg/module/wasm-cairo";
import wasm_bindgen, {
  compileCairoProgram,
  runTests,
} from "../pkg/module/wasm-cairo";
import { antiCheatAppend } from "../utils/antiCheat";

const url = new URL("../pkg/module/wasm-cairo_bg.wasm", import.meta.url).href;

(async () => {
  await wasm_bindgen(url);
})();

addEventListener("message", (event) => {
  const { code, mode, append } = event.data;

  let result;
  const antiCheatCode = antiCheatAppend(code, append);
  if (mode === "TEST") {
    result = runTests(
      antiCheatCode,
      false,
      "",
      false,
      false,
      false,
      "",
      false,
      false
    );
    console.log("TEST RESULT: ", result);
  } else if (mode === "TEST_CONTRACT") {
    result = runTests(
      antiCheatCode,
      false,
      "",
      false,
      false,
      true,
      "",
      false,
      false
    );
    console.log("TEST CONTRACT RESULT: ", result);
  } else {
    result = compileCairoProgram(antiCheatCode, false);
    console.log("COMPILE RESULT: ", result);
  }
  if (
    result.startsWith("failed to compile") ||
    result.includes("test result: FAILED") ||
    !code ||
    code.trim() === ""
  ) {
    return postMessage({
      success: false,
      result,
      error: result,
    });
  }
  return postMessage({
    success: true,
    result,
  });
});

export {};
