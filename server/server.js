import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

import app from "./app.js";
import { connectDB } from "./lib/db.js";

import express from "express";
import path from "path";

// Admin Metrics
import { initializeAdminMetrics } from "./Controllers/admin-metrics.controller.js";

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server connected! ${port}`);
  connectDB();
  // initializeAdminMetrics();
});
