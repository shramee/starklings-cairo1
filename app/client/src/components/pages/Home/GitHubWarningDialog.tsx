import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { getFirstExerciseUrl } from "../../../utils/getFirstExerciseUrl";
import { GitHubLoginButton } from "../../github/GitHubLoginButton";

interface IGitHubWarningDialog {
  open: boolean;
  onClose: () => void;
}

export const GitHubWarningDialog = ({
  open,
  onClose,
}: IGitHubWarningDialog) => {
  const navigate = useNavigate();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Connect to GitHub</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          We recommend connecting to your GitHub account before starting to
          code. This ensures that all your progress will be saved.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <GitHubLoginButton />
        <Button
          variant="text"
          onClick={() => {
            navigate(getFirstExerciseUrl());
          }}
        >
          Skip
        </Button>
      </DialogActions>
    </Dialog>
  );
};
