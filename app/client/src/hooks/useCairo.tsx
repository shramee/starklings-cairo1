import { useEffect } from "react";
import __wbg_init from "../pkg/module/wasm-cairo";
import { compileCairoCode } from "../utils/compileCairoCode";
import { testStarknetContract } from "../utils/testStarknetContract";
import { testCairoCode } from "../utils/testCairoCode";

export const useCairo = () => {
  useEffect(() => {
    __wbg_init();
  }, []);
  const compile = compileCairoCode;
  const test = testCairoCode;
  const testContract = testStarknetContract;
  return {
    compile,
    test,
    testContract,
  };
};
