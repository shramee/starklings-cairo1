import axios from "axios";
import {
  GITHUB_ACCESS_TOKEN_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_USER_API,
} from "../config.js";

export const getAccessToken = async (req, res) => {
  await axios
    .post(
      `${GITHUB_ACCESS_TOKEN_URL}?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${req.query.code}`,
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      res.json(response.data);
    });
};

export const getUserData = async (req, res) => {
  await axios
    .get(GITHUB_USER_API, {
      headers: {
        Authorization: req.get("Authorization"),
      },
    })
    .then((response) => {
      res.json(response.data);
    });
};
