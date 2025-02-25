import InfoIcon from "@mui/icons-material/Info";
import { Box, Grid, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { isMobileOnly } from "react-device-detect";
import { SimpleLink } from "../shared/SimpleLink";

export const About = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeDialog = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Tooltip title="About starklings.app">
        <IconButton
          id="header-icon"
          onClick={() => setDialogOpen(true)}
          sx={{ p: 0.5, color: "#FFF" }}
          aria-label="about"
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle sx={{ m: 2, fontSize: 25 }} id="alert-dialog-title">
          About Starklings App
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box sx={{ px: 2, mb: 4 }}>
              <Grid container>
                {!isMobileOnly && (
                  <Grid sm={3} item>
                    <Box
                      sx={{
                        display: "flex",
                        alignContent: "center",
                        height: "100%",
                      }}
                    >
                      <img
                        width="150px"
                        src="/logo.svg"
                        alt="starklings logo"
                      />
                    </Box>
                  </Grid>
                )}
                <Grid xs={9} item>
                  The Starklings App is an interactive web platform designed to
                  assist users in embarking on their journey to learn Cairo.
                  This platform is built upon{" "}
                  <SimpleLink href="https://github.com/shramee/starklings-cairo1">
                    Starklings
                  </SimpleLink>{" "}
                  exercises, which are considered essential for beginners
                  seeking to grasp the fundamentals of Cairo.
                  <br />
                  <br />
                  Our objective is to simplify the Starklings experience by
                  eliminating complex configurations and installations. Simply
                  access the app through your browser and begin coding.
                </Grid>
              </Grid>
            </Box>

            <Grid container>
              <Grid item sm={5}>
                <Typography sx={{ ml: 2 }} variant="h5">
                  Stay connected
                </Typography>
                <ul>
                  <li>
                    Follow us on{" "}
                    <SimpleLink href="https://twitter.com/starklingsapp">
                      X
                    </SimpleLink>
                  </li>
                  <li>
                    Visit our{" "}
                    <SimpleLink href="https://github.com/dpinones/starklings-app">
                      GitHub
                    </SimpleLink>
                  </li>
                  <li>
                    Follow Starknet on{" "}
                    <SimpleLink href="https://twitter.com/starknet">
                      X
                    </SimpleLink>
                  </li>
                  <li>
                    <SimpleLink href="https://www.starknet.io/en/explore-starknet">
                      Explore Starknet
                    </SimpleLink>
                  </li>
                  <li>
                    Join the Starknet{" "}
                    <SimpleLink href="http://starknet.io/discord/">
                      Discord server
                    </SimpleLink>
                  </li>
                  <li>
                    Join the community{" "}
                    <SimpleLink href="https://t.me/+efDitGbILOFmMDNk">
                      Telegram group
                    </SimpleLink>
                  </li>
                </ul>
              </Grid>
              <Grid item sm={7} sx={{ pl: 1 }}>
                <Typography sx={{ ml: 2 }} variant="h5">
                  Take your next step with Starknet
                </Typography>
                <ul>
                  <li>
                    Sign up for a free 6-week{" "}
                    <SimpleLink href="https://starknet.notion.site/Starknet-Basecamp-Hub-1541b3c1f49f439da872d3d71647d834">
                      Starknet Basecamp bootcamp
                    </SimpleLink>
                  </li>
                  <li>
                    Use your new Cairo skills to contribute to open-source
                    projects and earn rewards on{" "}
                    <SimpleLink href="https://app.onlydust.xyz/">
                      app.onlydust.xyz
                    </SimpleLink>
                  </li>
                  <li>
                    Go to Starknet's{" "}
                    <SimpleLink href="https://www.starknet.io/en/developers">
                      Developers hub
                    </SimpleLink>
                  </li>
                  <li>
                    Read the{" "}
                    <SimpleLink href="https://book.cairo-lang.org/">
                      Cairo Book
                    </SimpleLink>{" "}
                    or the{" "}
                    <SimpleLink href="https://book.starknet.io/">
                      Starknet book
                    </SimpleLink>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography sx={{ mx: 4 }}>Cairo version: 2.6.3</Typography>
          <Button
            sx={{ m: 2 }}
            variant="contained"
            onClick={closeDialog}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
