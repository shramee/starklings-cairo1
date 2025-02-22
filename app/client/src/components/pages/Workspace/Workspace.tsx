import { Editor } from "@monaco-editor/react";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Link,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useEffect, useMemo, useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { CURRENT_EXERCISE, EXERCISE_SOLUTION } from "../../../constants/localStorage";
import { useGetExercise } from "../../../queries/useGetExercise";
import { useGetExercises } from "../../../queries/useGetExercises";
import { useGetHint } from "../../../queries/useGetHint";
import { antiCheatShouldContain } from "../../../utils/antiCheat";
import {
  findNextExercise,
  findPrevExercise,
} from "../../../utils/exerciseNavigation";
import { CircularProgressCenterLoader } from "../../shared/CircularProgressCenterLoader";
import { ActionBar } from "./ActionBar";
import { MobileWarningDialog } from "./MobileWarningDialog";
import { Sidebar } from "./Sidebar";
import { useMarkExerciseDone } from "../../../queries/useMarkExerciseDone";
import LinkifyText from "../../layout/LinkfyText";

export const Workspace = () => {
  const worker: Worker = useMemo(
    () =>
      new Worker(new URL("../../../workers/cairoWorker.ts", import.meta.url)),
    []
  );

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const compatibility = !!searchParams.get("compatibility");

  const bannersHeight = 138;

  const { data: exercises } = useGetExercises();
  const { data, isLoading } = useGetExercise(id);
  const [editorValue, setEditorValue] = useState("");
  const [compileError, setCompileError] = useState<string | undefined>(
    undefined
  );
  const [succeeded, setSucceeded] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const nextId = findNextExercise(exercises ?? [], id ?? "");
  const prevId = findPrevExercise(exercises ?? [], id ?? "");
  const navigate = useNavigate();
  const [hint, setHint] = useState<string | undefined>(undefined);
  const [warning, setWarning] = useState<string | undefined>(undefined);
  const isTest = data?.mode === "test";
  const {
    mutate: getHint,
    data: hintResponse,
    isPending: hintLoading,
  } = useGetHint(id ?? "", (data) => {
    setHint(data.data.hints);
  });

  const { mutateAsync: markExerciseDone } = useMarkExerciseDone();

  useEffect(() => {
    const savedSolution = id ? localStorage.getItem(`${EXERCISE_SOLUTION}${id}`) : null;

    if (savedSolution) {
      if (!compatibility) {
        setEditorValue(savedSolution);
      }
    } else if (data?.code) {
      if (!compatibility) {
        setEditorValue(data.code);
      }
    } else {
      setEditorValue("");
    }
  }, [data?.code]);

  const reset = () => {
    setSucceeded(false);
    setHint(undefined);
    setCompileError(undefined);
    setWarning(undefined);
  };

  const handleCompileClick = async () => {
    let mode;
    if (data?.mode === "test") {
      if (data?.id.startsWith("starknet")) {
        mode = "TEST_CONTRACT";
      } else {
        mode = "TEST";
      }
    } else {
      mode = "COMPILE";
    }
    worker.postMessage({
      code: editorValue,
      mode,
      append: data?.antiCheat?.append,
    });
    setCompiling(true);
    setCompileError(undefined);
    setSucceeded(false);
    worker.onmessage = (event) => {
      setCompiling(false);
      const result = event.data;
      if (result.success) {
        try {
          antiCheatShouldContain(editorValue, data?.antiCheat?.shouldContain);
          nextId && localStorage.setItem(CURRENT_EXERCISE, nextId);
          setSucceeded(true);
          if (id) {
            markExerciseDone(id);
            localStorage.setItem(`${EXERCISE_SOLUTION}${id}`, editorValue);
          }
          setHint(undefined);
          setWarning(undefined);
        } catch (e) {
          console.log(e);
          setWarning(e?.toString());
        }
      } else {
        const { error } = result;
        console.error(error);
        setCompileError(error);
      }
    };
  };

  const handleHintClick = async () => {
    getHint();
  };

  const handleNextClick = () => {
    reset();
    nextId && localStorage.setItem(CURRENT_EXERCISE, nextId);
    navigate(nextId ? `/exercise/${nextId}` : "/end");
  };

  const handlePrevClick = () => {
    reset();
    if (prevId) {
      localStorage.setItem(CURRENT_EXERCISE, prevId);
      navigate(`/exercise/${prevId}`);
    }
  };

  const handleRestartClick = () => {
    localStorage.removeItem(CURRENT_EXERCISE);
    navigate(`/`);
  };

  const resetCode = () => {
    localStorage.removeItem(`${EXERCISE_SOLUTION}${id}`);
    setEditorValue(data?.code ?? "");
  };

  return (
    <Box sx={{ height: "100%", overflowY: "hidden", display: "flex" }}>
      <Sidebar currentExercise={id ?? ""} />
      <PanelGroup direction={"horizontal"}>
        <Grid sx={{ mt: 0, height: "100%" }} container spacing={2}>
          <Panel minSizePercentage={25} defaultSizePercentage={50}>
            {/* description + alerts */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: "auto",
                height: `calc(100vh - ${bannersHeight}px)`,
              }}
            >
              {/* description */}
              <Box sx={{ px: 8, py: 6 }}>
                <Typography sx={{ mb: 4 }} variant="h4">
                  {data?.name}
                </Typography>
                {isLoading && <CircularProgressCenterLoader />}
                {data && (
                  <Typography style={{ whiteSpace: "pre-line" }}>
                    {data.description?.trim() !== ""
                      ? data.description
                      : "Having trouble to solve this one? Click 'GET HINT' button for help!"}
                  </Typography>
                )}
              </Box>
              {/* alerts */}
              <Box>
                {hintLoading && <CircularProgressCenterLoader />}
                {hint && (
                  <Alert
                    sx={{ m: 2, ml: 4, color: "#FFF" }}
                    severity="info"
                    variant="filled"
                  >
                    <AlertTitle>Hint</AlertTitle>
                    <Typography sx={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                      <LinkifyText
                        text={hint}
                        style={{ color: "#FFF" }}
                        linkStyle={{ color: "#FFF", fontStyle: "italic" }}
                      />
                      <br />
                      <br />
                      Remember that you can always check the Cairo book at{" "}
                      <Link
                        target="_blank"
                        sx={{ color: "#FFF", fontStyle: "italic" }}
                        href={"https://book.cairo-lang.org/"}
                      >
                        https://book.cairo-lang.org/
                      </Link>{" "}
                      or the Cairo documentation at{" "}
                      <Link
                        target="_blank"
                        sx={{ color: "#FFF", fontStyle: "italic" }}
                        href={"https://docs.cairo-lang.org/"}
                      >
                        https://docs.cairo-lang.org/
                      </Link>
                      .
                    </Typography>
                  </Alert>
                )}
                {warning && (
                  <Alert
                    sx={{ m: 2, ml: 4 }}
                    variant="filled"
                    severity="warning"
                  >
                    <AlertTitle>Beware!</AlertTitle>
                    The submitted code compiles, but you are not following the
                    exercise rules. <br /> <br />
                    <b>{warning}</b>
                    <br />
                    <br />
                    Please, re-read the exercise description and comments on the
                    code section. <br />
                    If necessary, you can reset code clicking the icon on the
                    bottom right corner.
                  </Alert>
                )}
                {succeeded && (
                  <Alert
                    sx={{ m: 2, ml: 4 }}
                    variant="filled"
                    severity="success"
                  >
                    <AlertTitle>Great!</AlertTitle>
                    The submitted code compiles perfectly. Click{" "}
                    <strong>NEXT</strong> whenever you are ready to proceed.
                  </Alert>
                )}
                {compileError && (
                  <Alert
                    sx={{ m: 2, ml: 4, wordBreak: "break-all" }}
                    variant="filled"
                    severity="error"
                  >
                    <AlertTitle>
                      Ups! Something went wrong with your code
                    </AlertTitle>
                    <Typography sx={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                      {compileError}
                      <br />
                      Fix the code and click <strong>COMPILE</strong> again.
                    </Typography>
                  </Alert>
                )}
              </Box>
            </Box>
            <ActionBar
              onGetHintClick={handleHintClick}
              onCompileClick={handleCompileClick}
              onNextClick={handleNextClick}
              onPrevClick={handlePrevClick}
              onRestartClick={handleRestartClick}
              isTest={isTest}
              succeeded={succeeded}
              hintVisible={!!hint}
              first={!prevId}
              compilePending={compiling}
              last={!nextId}
            />
          </Panel>
          <PanelResizeHandle>
            <Box
              sx={{
                display: "flex",
                height: "100%",
                backgroundColor: "#000",
                width: 5,
              }}
            />
          </PanelResizeHandle>
          <Panel minSizePercentage={25} defaultSizePercentage={50}>
            {isLoading ? (
              <CircularProgressCenterLoader />
            ) : (
              <>
                {compatibility ? (
                  <TextField
                    id="compatibility-editor"
                    multiline
                    rows={30}
                    onChange={(e) => {
                      const val = e.target.value;
                      val && setEditorValue(val);
                    }}
                    fullWidth
                    value={editorValue}
                  />
                ) : (
                  <Editor
                    onChange={(val) => val && setEditorValue(val)}
                    theme="vs-dark"
                    height="100%"
                    width="100%"
                    options={{
                      scrollBeyondLastLine: false,
                      fontSize: 16,
                    }}
                    defaultLanguage="rust"
                    value={editorValue}
                  />
                )}
                <Box sx={{ position: "absolute", bottom: 35, right: 25 }}>
                  <Tooltip title="Reset code">
                    <IconButton
                      onClick={resetCode}
                      sx={{ p: 0.5, color: "#FFF" }}
                      aria-label="reset-code"
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </Panel>
        </Grid>
      </PanelGroup>
      {isMobileOnly && <MobileWarningDialog />}
    </Box>
  );
};
