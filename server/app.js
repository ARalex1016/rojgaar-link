import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Route
import authRouter from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";
import jobRouter from "./Routes/job.route.js";
import applicationRouter from "./Routes/application.route.js";
import adminMetricsRouter from "./Routes/admin-metrics.route.js";
import chatRouter from "./Routes/chat.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.88.101:5173"],
    credentials: true,
  })
);

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/jobs/", jobRouter);
app.use("/api/v1/application/", applicationRouter);
app.use("/api/v1/admin-metrics/", adminMetricsRouter);
app.use("/api/v1/chat/", chatRouter);

export default app;
