import GitHubIcon from "@mui/icons-material/GitHub";
import XIcon from "@mui/icons-material/X";
import { Box, Button, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { CURRENT_EXERCISE } from "../../../constants/localStorage";
import { Logo } from "../../shared/Logo";

export const FinalScreen = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.removeItem(CURRENT_EXERCISE);
    navigate("/");
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
      <Logo text={"congratulations!"} fontSize="12.3vw" />
      <Typography sx={{ textAlign: "center", lineHeight: 1.6, mt: 2 }}>
        You are a Cairo rockstar! <br />
        Thank you for completing starklings. <br />
        Do you have any feedback for us?{" "}
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <IconButton
            href={"https://twitter.com/starklingsapp"}
            target="_blank"
            sx={{ ml: 1, p: 0.5, color: "#FFF" }}
            aria-label="start-over"
          >
            <XIcon />
          </IconButton>
          <IconButton
            href={"https://github.com/dpinones/starklings-app"}
            target="_blank"
            sx={{ ml: 1, p: 0.5, color: "#FFF" }}
            aria-label="start-over"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
        This is the end of the way... <br /> but you can always go for a second
        round XD
      </Typography>
      <Button
        onClick={handleClick}
        sx={{ mt: 8, px: 16, fontSize: 16 }}
        variant="contained"
      >
        Start over
      </Button>
    </Box>
  );
};
