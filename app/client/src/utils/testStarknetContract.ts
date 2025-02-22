import { ICompilationResult } from "../types/compilation";
import { Append } from "../types/exercise";
import { runCairoCode } from "./runCairoCode";

export const testStarknetContract = (code: string, append?: Append): ICompilationResult => {
  return runCairoCode(code, 'TEST_CONTRACT', append)
}

