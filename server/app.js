import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

// Route
import authRouter from "./Routes/auth.route.js";
import userRouter from "./Routes/user.route.js";
import jobRouter from "./Routes/job.route.js";
import applicationRouter from "./Routes/application.route.js";
import adminMetricsRouter from "./Routes/admin-metrics.route.js";
import chatRouter from "./Routes/chat.route.js";
import donationRouter from "./Routes/donation.route.js";
import contactRouter from "./Routes/contact.route.js";

// Utils
import { globalRateLimiter } from "./utils/limiter.js";

const app = express();

app.use(helmet());
app.use("/api", globalRateLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(sanitize());
app.use(xss());
app.use(hpp());
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
app.use("/api/v1/donation/", donationRouter);
app.use("/api/v1/", contactRouter);

export default app;
