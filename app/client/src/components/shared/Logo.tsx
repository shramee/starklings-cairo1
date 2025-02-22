import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ILogoProps {
  text?: string;
  fontSize?: string;
}

export const Logo = ({ text = "starklings.app", fontSize = "14.2vw" }: ILogoProps) => {
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
        sx={{ zIndex: 3, ml: "-0.5%", fontSize }}
        variant="h1"
      >
        {text}
      </Typography>
      <Box sx={{ position: "absolute", overflow: "hidden", width: "100%" }}>
        <Typography
          sx={{
            zIndex: 2,
            transform: "translateY(4px) scale(1.01)",
            // color: "#f2951b",
            color: "#1976d2",
            ml: "-0.5%",
            fontSize,
          }}
          variant="h1"
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};
