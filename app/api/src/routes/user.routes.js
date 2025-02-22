import Router from "express-promise-router";
import {
    getExercisesByUser,
    resolveExercise,
    matchUser,
    markExerciseDone
} from "../controllers/user.controller.js";

const router = Router();

router.post("/user/:user/exercise/:exercise", resolveExercise);

router.post("/user/:user/exercise/:exercise/done", markExerciseDone);

router.post("/user/:user/match/:newUser", matchUser);

router.get("/user/:user/exercise", getExercisesByUser);

export default router;
