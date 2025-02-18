import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { ORIGIN } from "./config.js";
import { pool } from "./db.js";
import exercisesRoutes from "./routes/exercises.routes.js";
import githubRoutes from "./routes/github.routes.js";
import graduateRoutes from "./routes/graduates.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => res.json({ message: "Welcome to Starklings API" }));
app.get("/api/ping", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  return res.json(result.rows[0]);
});

app.use("/api", exercisesRoutes);
app.use("/api", userRoutes);
app.use("/api", githubRoutes);
app.use("/api", graduateRoutes);

// Error Hander
app.use((err, req, res, next) => {
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

export default app;
