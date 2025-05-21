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

export const sendNodeMailerMail = async ({
  from,
  to,
  subject,
  text,
  html,
  category,
}) => {
  const mailOptions = {
    from,
    to,
    subject,
    text,
    html,
    category,
  };

  try {
    let res = await nodemailerTransporter.sendMail(mailOptions);

    return res;
  } catch (error) {
    throw error;
  }
};
