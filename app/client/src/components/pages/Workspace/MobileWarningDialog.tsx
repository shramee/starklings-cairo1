import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useState } from "react"

export const MobileWarningDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(true);
  const closeDialog = () => {
    setDialogOpen(false);
  };
  return (
    <Dialog
      open={dialogOpen}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Coding from a smartphone?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Starklings.app is not designed to be used on a smartphone, please switch to a bigger device to have the best experience.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={closeDialog} autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
