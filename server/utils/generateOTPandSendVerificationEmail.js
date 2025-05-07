import { sendVerificationEmail } from "../mailtrap/email.js";

export const generateOTPandSendVerificationEmail = async (user) => {
  const verificationToken = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.verificationToken = verificationToken;
  user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  await sendVerificationEmail(user.email, verificationToken);
};
