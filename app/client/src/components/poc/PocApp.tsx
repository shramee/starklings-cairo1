import Editor from "@monaco-editor/react";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import __wbg_init, {
  compileCairoProgram,
  runTests,
} from "../../pkg/module/wasm-cairo";
import "./PocApp.css";

const cairoTestProgram = `
  use debug::PrintTrait;

    fn main() {
    let x;
    if x == 10 {
        ('x is ten!').print();
    } else {
        ('x is not ten!').print();
    }
}`;

export const PocApp = () => {
  const [editorValue, setEditorValue] = useState(cairoTestProgram);
  const [error, setError] = useState("");
  const [passed, setPassed] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    __wbg_init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Typography sx={{ mb: 1 }} variant="h5">
          Exercise: Variables 2
        </Typography>
        <Typography sx={{ mb: 2 }} variant="body1">
          Fix the code
        </Typography>
        <Editor
          onChange={(val) => val && setEditorValue(val)}
          theme="vs-dark"
          height="400px"
          width="800px"
          defaultLanguage="rust"
          defaultValue={editorValue}
        />

        <Box
          className="exercise-btnset"
          sx={{ display: "flex", gap: 2, my: 2 }}
        >
          <Button
            variant="contained"
            disabled={hint !== ""}
            onClick={() => {
              setHint(`Hint: What happens if you annotate line 5 with a type annotation?
              What if you give x a value?
              What if you do both?
              What type should x be, anyway? (remember what the basic type in Cairo is?)
              What if x is the same type as 10? What if it's a different type? (e.g. a u8)`);
            }}
          >
            Get hint
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              const result = runTests(
                editorValue,
                true,
                "",
                false,
                false,
                false,
                "",
                false,
                false
              );
              if (result.startsWith("failed to compile")) {
                setError(result);
                setPassed(false);
              } else {
                setError("");
                setPassed(true);
              }
              console.log("compile result: ", result);
            }}
          >
            Compile
          </Button>
          {/*           <Button
            variant="contained"
            onClick={() => {
              const result = runCairoProgram(
                editorValue,
                undefined,
                false,
                false
              );
              setResult(result);
            }}
          >
            Run
          </Button> */}
        </Box>

        {hint !== "" && (
          <Box sx={{ m: 2 }}>
            <Typography sx={{ textAlign: "left" }}>{hint}</Typography>
          </Box>
        )}

        {error !== "" && (
          <Box sx={{ m: 2 }}>
            <Typography color="red" sx={{ textAlign: "left" }}>
              {error}
            </Typography>
          </Box>
        )}

        {passed && (
          <Box sx={{ m: 2 }}>
            <Typography variant="h4" color="green">
              Well done!
            </Typography>
          </Box>
        )}
      </header>
    </div>
  );
};
