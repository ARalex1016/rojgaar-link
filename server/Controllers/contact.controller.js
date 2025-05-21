import { sendNodeMailerMail } from "../lib/email.config.js";

export const sendEmailToAdmin = async (req, res) => {
  const { name, email, subject, otherSubject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  try {
    await sendNodeMailerMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${
        otherSubject ? `${otherSubject} (Other)` : subject
      }`,
      text: `From: ${name} (${email})\n\n${message}`,
    });

    // Success
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Error sending email!",
    });
  }
};
