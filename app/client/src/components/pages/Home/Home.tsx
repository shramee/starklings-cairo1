import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { GITHUB_ENABLED } from "../../../constants/localStorage";
import { getFirstExerciseUrl } from "../../../utils/getFirstExerciseUrl";
import { Logo } from "../../shared/Logo";
import { GitHubWarningDialog } from "./GitHubWarningDialog";
import { SimpleLink } from "../../shared/SimpleLink";

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
    <>
      <Box
        id="hero"
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
        <Typography variant="h4" sx={{ my: 3, px: 2 }} style={{
          textShadow: '0 1px 1px rgba(0, 0, 0, 0.5), 0 2px 3px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.5)'
        }}>
          A web-based interactive tutorial to learn Cairo and Starknet.
        </Typography>

        <Button
          className="btn1"
          onClick={handleStartCodingClick}
          sx={{ my: 6, px: isMobileOnly ? 8 : 16, fontSize: 16 }}
          variant="contained"
        >
          Start coding
        </Button>
        <GitHubWarningDialog
          open={ghDialogOpen}
          onClose={() => setGhDialogOpen(false)}
        />
      </Box>
      {!isMobileOnly && (
        <Box
          id="signup-banner"
          sx={{
            zIndex: 1000,
            width: "100%",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <SimpleLink href="https://starknet.notion.site/Starknet-Basecamp-Hub-1541b3c1f49f439da872d3d71647d834">
            <Typography
              sx={{
                lineHeight: 1.1,
                textWrap: "nowrap",
              }}
            >
              Sign up for a free 6-week Starknet bootcamp
            </Typography>
          </SimpleLink>
          <Typography
            sx={{
              lineHeight: 1.2,
              textWrap: "nowrap",
              fontSize: 15,
            }}
          >
            Plus, use your new Cairo skills to contribute to open-source
            projects and earn rewards on{" "}
            <SimpleLink href="https://app.onlydust.xyz/">
              app.onlydust.xyz
            </SimpleLink>
          </Typography>
        </Box>
      )}
    </>
  );
};
