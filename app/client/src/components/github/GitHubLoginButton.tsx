import { Button, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GITHUB_LOGIN_URL } from "../../constants/github";
import {
  GITHUB_AVATAR,
  GITHUB_ENABLED,
  USERNAME,
} from "../../constants/localStorage";
import {
  ITokenResponse,
  useGetAccessToken,
} from "../../queries/useGetAccessToken";
import {
  IUserDataResponse,
  useGetUserData,
} from "../../queries/useGetUserData";
import { useMatchUserToGitHubAccount } from "../../queries/useMatchUserToGitHubAccount";

const convertGHUsername = (username: string) => {
  const ghUser = username?.match(/^\d/) ? "gh" + username : username;
  return ghUser.toLowerCase();
};

export const GitHubLoginButton = () => {
  const loggedInGhUser =
    localStorage.getItem(GITHUB_ENABLED) && localStorage.getItem(USERNAME)
      ? localStorage.getItem(USERNAME)
      : null;
  const [ghUser, setGhUser] = useState(loggedInGhUser);
  const [ghAvatar, setGhAvatar] = useState(localStorage.getItem(GITHUB_AVATAR));
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { mutate: matchUserToGitHubAccount } = useMatchUserToGitHubAccount();

  const { mutate: getUserData } = useGetUserData(
    (response: IUserDataResponse) => {
      const loggedInUser = convertGHUsername(response?.data?.login);
      const avatar = response?.data?.avatar_url;
      if (loggedInUser) {
        localStorage.setItem(USERNAME, loggedInUser);
        localStorage.setItem(GITHUB_ENABLED, "true");
        localStorage.setItem(GITHUB_AVATAR, avatar);
        setGhUser(loggedInUser);
        setGhAvatar(avatar);
        matchUserToGitHubAccount(loggedInUser);
      }
      setLoading(false);
    }
  );
  const { mutate: getAccesToken } = useGetAccessToken(
    (response: ITokenResponse) => {
      getUserData(response.data.access_token);
    }
  );
  const loginWithGitHub = () => {
    setLoading(true);
    window.location.assign(GITHUB_LOGIN_URL);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (code) {
      setLoading(true);
      getAccesToken(code);
      setSearchParams({});
    }
  }, [code]);

  const disconnect = () => {
    localStorage.removeItem(GITHUB_ENABLED);
    setGhUser(null);
  };

  return (
    <>
      {ghUser ? (
        <>
          <Button
            variant="contained"
            color="success"
            sx={{
              textTransform: "lowercase",
              fontWeight: "bold",
              display: "flex",
              gap: 2,
              pr: 1.5,
              pl: 2,
            }}
            onClick={openMenu}
          >
            {ghUser}
            {ghAvatar && <img src={ghAvatar} width="20px" />}
          </Button>
          <Menu
            sx={{ mt: 1 }}
            anchorEl={anchorEl}
            open={open}
            onClose={closeMenu}
          >
            <MenuItem onClick={disconnect}>Log out</MenuItem>
          </Menu>
        </>
      ) : (
        <Button
          disabled={loading}
          sx={{ fontWeight: "bold" }}
          variant="contained"
          color="primary"
          onClick={loginWithGitHub}
        >
          {loading ? "Connecting..." : "Connect GitHub"}
        </Button>
      )}
    </>
  );
};
