import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Models
import User from "../Models/user.model.js";
import CandidateProfile from "../Models/candidateProfile.model.js";
import CreatorProfile from "../Models/creator-profile.model.js";

// Controllers
import { updateNewUser } from "./admin-metrics.controller.js";

// Utils
import { passwordValidator } from "../utils/stringManager.js";
import { generateJwtToken } from "../utils/generateJwtToken.js";
import { generateOTPandSendVerificationEmail } from "../utils/generateOTPandSendVerificationEmail.js";
import { checkEligibility } from "../utils/checkEligibility.js";

export const signup = async (req, res) => {
  const {
    name,
    email,
    gender,
    dateOfBirth,
    password,
    confirmPassword,
    phone,
    location,
    role,
  } = req.body;

  if (
    !name ||
    !email ||
    !gender ||
    !dateOfBirth ||
    !phone ||
    !password ||
    !confirmPassword ||
    !location?.country ||
    !location?.state
  ) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  if (role === "admin") {
    return res.status(400).json({
      status: "fail",
      message: "You do not have permission to perform this action!",
    });
  }

  try {
    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(400).json({
        status: "fail",
        message: "User with this email already exists!",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Password and Confirm Password doesn't matched!",
      });
    }

    const isValidPassword = passwordValidator(password);

    if (!isValidPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      gender,
      dateOfBirth,
      role,
      password: hashedPassword,
    });

    const profileData = {
      userId: user._id,
      contact: {
        phoneNumber: phone,
      },
      location: {
        country: location.country,
        state: location.state,
      },
    };

    // Create Candidate || Creator Profile
    if (user.role === "candidate") {
      await CandidateProfile.create(profileData);
    } else if (user.role === "creator") {
      await CreatorProfile.create(profileData);
    }

    // Update Admin Metrics
    await updateNewUser(user.role);

    // JWT Token
    const token = generateJwtToken(user, res);

    const { password: _, ...userWithoutPassword } = user.toObject();
    // Success
    const response = {
      status: "success",
      message: "Signed up successfully!",
      data: userWithoutPassword,
    };

    // Include token only in development
    if (process.env.NODE_ENV === "development") {
      response.token = token;
    }

    // Success
    res.status(201).json(response);
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
      error,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "All fields are required!",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User with this email deosn't exist!",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        status: "fail",
        message: "Password doesn't matched!",
      });
    }

    // TODO: Add this user in online users (in real-time)
    const token = generateJwtToken(user, res);
    const { password: _, ...userWithoutPassword } = user.toObject();
    // Success
    const response = {
      status: "success",
      message: "Logged in successfully!",
      data: userWithoutPassword,
    };
    // Include token only in development
    if (process.env.NODE_ENV === "development") {
      response.token = token;
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // TODO: Remove this user from online users (in real-time)

    res.status(200).json({
      message: "Logged out successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error logging out",
    });
  }
};

export const sendEmailWithOTP = async (req, res) => {
  const { user } = req;

  try {
    await generateOTPandSendVerificationEmail(user);

    // Success
    res.status(200).json({
      status: "success",
      message: "Email with OTP sent successfully",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Error sending email",
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  const { user } = req;

  try {
    // Verify OTP
    const isMatch = String(user.verificationToken) === String(code);

    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP",
      });
    }

    // Check OTP expiration
    if (new Date() > user.verificationTokenExpiresAt) {
      return res.status(400).json({
        status: "fail",
        message: "Expired Verification Code",
      });
    }

    // Mark user as verified
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await checkEligibility(user);

    // Success
    res.status(200).json({
      status: "success",
      message: "OTP verified successfully",
      data: user,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Error verifying OTP",
    });
  }
};

export const protect = async (req, res, next) => {
  let token;
  if (process.env.NODE_ENV === "development") {
    if (
      req.headers?.authorization &&
      req.headers?.authorization?.startsWith("Bearer")
    ) {
      token = req.headers.authorization?.split(" ")[1];
    }
  } else {
    token = req.cookies?.token;
  }

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: No token provided",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Forbidden: The user no longer exists!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error!",
    });
  }
};

// Only for checking whether user is logged in or not
export const checkAuthentication = async (req, res, next) => {
  let token;

  if (process.env.NODE_ENV === "development") {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  } else {
    token = req.cookies?.token;
  }

  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      req.isAuthenticated = false;
      return next();
    }

    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    req.isAuthenticated = false;
    return next();
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({
    status: "success",
    data: req.user,
  });
};

export const authorize =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      // Error
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action!",
      });
    }
    next();
  };
