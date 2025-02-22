import { ICompilationResult } from "../types/compilation";
import { Append } from "../types/exercise";
import { runCairoCode } from "./runCairoCode";

export const testCairoCode = (
  code: string,
  append?: Append
): ICompilationResult => {
  return runCairoCode(code, "TEST", append);
};
