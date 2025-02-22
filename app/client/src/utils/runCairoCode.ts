import { compileCairoProgram, runTests } from "../pkg/module/wasm-cairo";
import { ICompilationResult } from "../types/compilation";
import { Append } from "../types/exercise";
import { antiCheatAppend } from "./antiCheat";

export const runCairoCode = (
  code: string,
  mode: "COMPILE" | "TEST" | "TEST_CONTRACT",
  append?: Append
): ICompilationResult => {
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
    result.includes("test result APPEND: FAILED") ||
    !code ||
    code.trim() === ""
  ) {
    return {
      success: false,
      result,
      error: result,
    };
  }
  return {
    success: true,
    result,
  };
};
