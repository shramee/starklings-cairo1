import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { isMobileOnly } from "react-device-detect";
import { GitHubLoginButton } from "../github/GitHubLoginButton";
import { SimpleLink } from "../shared/SimpleLink";
import { About } from "./About";

const NAV_HEIGHT = "50px";
const BANNER_HEIGHT = "50px";

interface IBasicLayoutProps {
  children: JSX.Element;
}
export const BasicLayout = ({ children }: IBasicLayoutProps) => {
  /*   const [bannerClosed, setBannerClosed] = useState(
    localStorage.getItem(BANNER_CLOSED)
  );

  const closeBanner = () => {
    setBannerClosed("true");
    localStorage.setItem(BANNER_CLOSED, "true");
  }; */

  return (
    <Box sx={{ height: "100%", backgroundColor: "#242424", color: "#FFF" }}>
      <Box sx={{ height: "100%" }}>
        {!isMobileOnly && (
          <Box
            sx={{
              height: BANNER_HEIGHT,
              zIndex: 1000,
              width: "100%",
              backgroundColor: "#101c42",
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
                Sign up for a free 6-week Starknet Basecamp bootcamp.
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
              .
            </Typography>
            {/*             <IconButton
              onClick={closeBanner}
              sx={{ position: "absolute", right: 15 }}
            >
              <CloseIcon />
            </IconButton> */}
          </Box>
        )}
        <Box
          sx={{
            height: NAV_HEIGHT,
            zIndex: 1000,
            width: "100%",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, ml: 2 }}>
            <img width="30px" src="/logo.svg" alt="starklings logo" />
            <Link sx={{ textDecoration: "none" }} href="/">
              <Typography variant="h3" sx={{ fontSize: 20, color: "#FFF" }}>
                starklings.app
              </Typography>
            </Link>
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mr: 2 }}>
            <About />
            {!isMobileOnly && <GitHubLoginButton />}
          </Box>
        </Box>
        <Box
          sx={{
            height: `calc(100% - 100px)`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
