import { ICompilationResult } from "../types/compilation";
import { Append } from "../types/exercise";
import { runCairoCode } from "./runCairoCode";

export const compileCairoCode = (
  code: string,
  append?: Append
): ICompilationResult => {
  return runCairoCode(code, "COMPILE", append);
};
