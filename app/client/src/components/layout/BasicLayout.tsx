import { Link, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { isMobileOnly } from "react-device-detect";
import { GitHubLoginButton } from "../github/GitHubLoginButton";
import { About } from "./About";

const NAV_HEIGHT = "50px";

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
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1, ml: 2 }}>
            <img width="32px" src="/logo.svg" alt="starklings logo" />
            <Link sx={{ textDecoration: "none" }} href="/">
              <Typography
                id="logotext-header"
                className="logotext"
                variant="h3"
                sx={{ fontSize: 20, color: "#FFF", mt: "3px" }}
              >
                starklings
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
