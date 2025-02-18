import { Append } from "../types/exercise";

export const antiCheatAppend = (code: string, append?: Append) => {
  if (!append) {
    return code;
  }
  if (!append.to) {
    return `${code}
        ${append.code}`;
  }

  return appendCodeToFunction(code, append.to, append.code);
};

export const antiCheatShouldContain = (
  code: string,
  shouldContainLines: string[] = []
) => {
  if (shouldContainLines?.length > 0) {
    shouldContainLines.forEach((line) => {
      if (!code.includes(line)) {
        throw new Error("Provided code does not contain '" + line + "'");
      }
    });
  }
};

function appendCodeToFunction(
  code: string,
  functionName = "main",
  codeLine: string
) {
  // Find the index of the function definition
  let functionIndex = code.indexOf(`fn ${functionName}(`);

  if (functionIndex === -1) {
    functionIndex = code.indexOf(`mod ${functionName}`);
  }

  if (functionIndex === -1) {
    const error = `Function '${functionName}' not found.`;
    console.error(error);
    throw new Error(error);
  }

  // Find the end of the function definition
  let openBracesCount = 0;
  let endFunctionIndex = -1;
  for (let i = functionIndex; i < code.length; i++) {
    if (code[i] === "{") {
      openBracesCount++;
    } else if (code[i] === "}") {
      openBracesCount--;
      if (openBracesCount === 0) {
        endFunctionIndex = i;
        break;
      }
    }
  }

  if (endFunctionIndex === -1) {
    console.error(`Unable to find end of function '${functionName}'.`);
    return code; // return original code if unable to find end of function
  }

  // Get the last line of the function
  const functionBody = code.slice(functionIndex, endFunctionIndex);
  const lastLine = functionBody?.trim()?.split("\n")?.pop()?.trim();

  // Append the code line inside the function
  let modifiedCode = code.slice(0, endFunctionIndex);
  if (!lastLine?.endsWith(";") && !lastLine?.endsWith("}")) {
    modifiedCode += ";"; // Add semicolon if last line doesn't end with one
  }
  modifiedCode += `\n    ${codeLine}\n${code.slice(endFunctionIndex)}`;

  return modifiedCode;
}
