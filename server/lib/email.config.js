import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import nodemailer from "nodemailer";

export const nodemailerTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
