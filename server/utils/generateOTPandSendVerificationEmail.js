import { sendNodeMailerMail } from "../lib/email.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "../lib/emailTemplates.js";

export const generateOTPandSendVerificationEmail = async (user) => {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.verificationToken = verificationToken;
  user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  await sendNodeMailerMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify your email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
    category: "Email Verification",
  });

  // await sendVerificationEmail(user.email, verificationToken);
};
