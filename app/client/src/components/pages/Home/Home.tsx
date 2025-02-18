import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { GITHUB_ENABLED } from "../../../constants/localStorage";
import { getFirstExerciseUrl } from "../../../utils/getFirstExerciseUrl";
import { Logo } from "../../shared/Logo";
import { GitHubWarningDialog } from "./GitHubWarningDialog";

export const Home = () => {
  const [ghDialogOpen, setGhDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleStartCodingClick = () => {
    if (localStorage.getItem(GITHUB_ENABLED) || isMobileOnly) {
      navigate(getFirstExerciseUrl());
    } else {
      setGhDialogOpen(true);
    }
  };

  return (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Logo />
      <Typography sx={{ mt: 3, px:2 }}>
        A web-based interactive tutorial to learn Cairo and Starknet.
      </Typography>

      <Button
        onClick={handleStartCodingClick}
        sx={{ mt: 6, px: isMobileOnly ? 8 : 16, fontSize: 16 }}
        variant="contained"
      >
        Start coding
      </Button>
      <GitHubWarningDialog
        open={ghDialogOpen}
        onClose={() => setGhDialogOpen(false)}
      />
    </Box>
  );
};
