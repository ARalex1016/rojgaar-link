import jwt from "jsonwebtoken";

export const generateJwtToken = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  if (process.env.NODE_ENV !== "development") {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }

  return token;
};
