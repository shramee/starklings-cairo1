import Router from "express-promise-router";
import {
  getAccessToken,
  getUserData
} from "../controllers/github.controller.js";

const router = Router();

router.get("/github/access-token", getAccessToken);
router.get("/github/user-data", getUserData);

export default router;
