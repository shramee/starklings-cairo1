import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { isMobileOnly } from "react-device-detect";

const BASECAMP_URL =
  "https://us06web.zoom.us/webinar/register/7017368536020/WN_vPEdeTvqS5y-ZnC79_DBjw#/registration";

const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

interface BasecampModalProps {
  open: boolean;
  handleClose: () => void;
}

export const BasecampModal = ({ open, handleClose }: BasecampModalProps) => {
  const handleDontShowAgain = () => {
    localStorage.setItem("basecamp-modal-dismissed", "true");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "transparent",
          boxShadow: "none",
          overflow: "visible",
          margin: 2,
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          borderRadius: 3,
          overflow: "hidden",
          background: "linear-gradient(135deg, #4b30aa 0%, #a22f6a 100%)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Side-by-side layout */}
        <Grid container>
          {/* Left side - Image */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <img
                onClick={() => openInNewTab(BASECAMP_URL)}
                src="/basecamp.jpg"
                alt="Starknet Basecamp"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                }}
              />
            </Box>
          </Grid>

          {/* Right side - Content */}
          {!isMobileOnly && (
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                  color: "white",
                }}
              >
                {/* Text content */}
                <Typography
                  variant="h4"
                  component="h2"
                  fontWeight="bold"
                  textAlign="center"
                  gutterBottom
                >
                  Starknet Basecamp 12
                </Typography>

                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  Starting April 03
                </Typography>

                <Typography textAlign="center" sx={{ my: 3 }}>
                  Learn, build, and connect with the community. Start your
                  Starknet Journey now!
                </Typography>

                {/* Buttons */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleDontShowAgain}
                    sx={{
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      color: "white",
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    Don't show again
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    target="_blank"
                    href={BASECAMP_URL}
                    sx={{
                      bgcolor: "#f37646",
                      color: "white",
                      textAlign: "center",
                      borderRadius: 2,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#e06535",
                      },
                    }}
                  >
                    Register for Basecamp
                  </Button>
                </Stack>
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
