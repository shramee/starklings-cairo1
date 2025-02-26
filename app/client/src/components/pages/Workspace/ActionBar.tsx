import { SkipNext, SkipPrevious } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

interface IActionBarProps {
  onGetHintClick: () => {};
  onCompileClick: () => void;
  onNextClick: () => void;
  onPrevClick: () => void;
  onRestartClick: () => void;
  isTest: boolean;
  succeeded: boolean;
  hintVisible: boolean;
  first: boolean;
  compilePending: boolean;
  last: boolean;
}

export const ActionBar = ({
  onGetHintClick,
  onCompileClick,
  onPrevClick,
  onNextClick,
  onRestartClick,
  isTest,
  succeeded,
  hintVisible,
  first,
  compilePending,
  last,
}: IActionBarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Box
        sx={{
          background: "#111",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", ml: 4, gap: 1 }}>
          {/* <Tooltip title="Start over">
                <IconButton
                  onClick={openDialog}
                  sx={{ p: 0.5, color: "#FFF" }}
                  aria-label="start-over"
                >
                  <RestartAltIcon />
                </IconButton>
              </Tooltip> */}
          <Tooltip title="Go to previous exercise">
            <IconButton
              disabled={first}
              onClick={onPrevClick}
              sx={{ p: 0.5, color: "#FFF" }}
              aria-label="previous exercise"
            >
              <SkipPrevious />
            </IconButton>
          </Tooltip>
          <Tooltip title="Skip current exercise">
            <IconButton
              disabled={last}
              onClick={onNextClick}
              sx={{ p: 0.5, color: "#FFF" }}
              aria-label="skip-exercise"
            >
              <SkipNext />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          className="exercise-btnset"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={onGetHintClick}
            disabled={hintVisible || succeeded || compilePending}
          >
            Get Hint
          </Button>
          <Button
            disabled={compilePending}
            variant="contained"
            color="success"
            data-cy="run-button"
            onClick={onCompileClick}
          >
            {isTest ? "Test" : "Compile"}
            {compilePending && <CircularProgress sx={{ ml: 1 }} size="1rem" />}
          </Button>
          {succeeded && (
            <Button variant="contained" color="secondary" onClick={onNextClick}>
              Next
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to start over?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you click 'OK', the app will be restarted and you will loose all
            your progress.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onRestartClick} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
