import Router from "express-promise-router";
import {
    getGraduates,
    checkGraduate,
    evaluateGraduates
} from "../controllers/graduates.controller.js";

const router = Router();

router.get("/graduates", getGraduates);

router.get("/graduates/:github", checkGraduate);

router.post("/graduates/evaluate", evaluateGraduates);

export default router;
