import { nodemailerTransporter } from "../lib/email.config.js";

export const sendEmailToAdmin = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact Form: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`,
  };

  try {
    await nodemailerTransporter.sendMail(mailOptions);

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
