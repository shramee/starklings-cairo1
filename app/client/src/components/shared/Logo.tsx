import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ILogoProps {
  text?: string;
  fontSize?: string;
}

export const Logo = ({
  text = "starklings",
  fontSize = "calc( 8vw + 20px )",
}: ILogoProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowX: "hidden",
      }}
    >
      <Typography
        id="logotext-hero"
        className="logotext"
        sx={{ zIndex: 3, ml: "-0.5%", fontSize }}
        variant="h1"
      >
        {text}
      </Typography>
    </Box>
  );
};
