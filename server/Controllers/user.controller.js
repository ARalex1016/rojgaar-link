// Models
import User from "../Models/user.model.js";
import CandidateProfile from "../Models/candidateProfile.model.js";
import CreatorProfile from "../Models/creator-profile.model.js";

// Utils
import { checkEligibility } from "../utils/checkEligibility.js";

// Lib
import cloudinary from "../lib/cloudinary.js";

export const getUserById = async (req, res) => {
  const { user: loggedInUser, targetUser } = req;

  if (loggedInUser._id.toString() === targetUser._id.toString()) {
    return res.status(400).json({
      status: "fail",
      message:
        "You cannot fetch your own details in this way. Please use your profile section or contact support if needed.",
    });
  }

  try {
    res.status(200).json({
      status: "success",
      message: "User found",
      data: { ...targetUser.toObject(), password: undefined },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getAllUser = async (req, res) => {
  const { role, verified, suspended, page = 1, limit = 10 } = req.query;

  const query = {};
  if (role) {
    query.role = role;
  }
  if (verified) {
    query.isVerified = verified;
  }

  if (suspended) {
    query.isSuspended = suspended;
  }

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber <= 0 ||
    limitNumber <= 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid page or limit value. Please provide positive integers.",
    });
  }

  try {
    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      message: "Successfully retrieved all users",
      data: users,
      meta: {
        totalUsers,
        currentPage: pageNumber,
        totalPage: Math.ceil(totalUsers / limitNumber),
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const getProfile = async (req, res) => {
  const { user } = req;

  try {
    let userProfile;

    if (user.role === "candidate") {
      userProfile = await CandidateProfile.findOne({ userId: user._id });
    } else if (user.role === "creator") {
      userProfile = await CreatorProfile.findOne({ userId: user._id });
    } else {
      return res.status(404).json({
        data: "fail",
        message: "User role isn't valid",
      });
    }

    // Success
    res.status(200).json({
      status: "success",
      data: userProfile,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const searchUser = async (req, res) => {
  const { name, email } = req.query;

  try {
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (email) {
      query.email = email.toLowerCase();
    }

    const user = await User.find(query).select("-password");

    if (user.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Success
    res.status(200).json({
      status: "success",
      message: "User found",
      data: user,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateUserDetail = async (req, res) => {
  const { user } = req;

  try {
    const allowedUpdates = ["name"];
    const updates = Object.keys(req.body).filter((key) =>
      allowedUpdates.includes(key)
    );

    if (updates.length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No valid fields to update" });
    }

    // Apply updates
    updates.forEach((key) => (user[key] = req.body[key]));
    await user.save();

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully updated user details!",
      data: { user },
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const updateProfileDetails = async (req, res) => {
  const { user } = req;

  try {
    let Profile;

    if (user.role === "candidate") {
      Profile = CandidateProfile;
    } else if (user.role === "creator") {
      Profile = CreatorProfile;
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid user role",
      });
    }

    const updatedProfileDetails = await Profile.findOneAndUpdate(
      {
        userId: user._id,
      },
      req.body,
      { new: true, runValidators: true }
    );

    await checkEligibility(user, updatedProfileDetails);

    // Success
    res.status(200).json({
      status: "success",
      message: "Profile details updated successfully!",
      data: updatedProfileDetails,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const uploadProfilePic = async (req, res) => {
  const { profilePic } = req.body;
  const { user } = req;

  try {
    if (!profilePic) {
      return res.status(400).json({
        status: "fail",
        message: "Profile pic is required",
      });
    }

    const previousProfilePic = user.profilePic;

    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "Profile",
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    if (previousProfilePic) {
      const parts = previousProfilePic.split("/");
      const previousPublicId = parts[parts.length - 1].split(".")[0];

      await cloudinary.uploader.destroy(`Profile/${previousPublicId}`);
    }

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully Uploaded Profile Pic",
      data: updatedUser,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const uploadResume = async (req, res) => {
  const { user } = req;

  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "File not selected!",
      });
    }

    if (!req.file || req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        status: "fail",
        message: "Uploaded file must be a PDF",
      });
    }

    const filePath = req.file.path;

    const previousResume = await CandidateProfile.findOne({
      userId: user._id,
    }).select("_id resume");

    const uploadResponse = await cloudinary.uploader.upload(filePath, {
      folder: "Resume",
      resource_type: "auto",
    });

    const updatedCandidateProfile = await CandidateProfile.findByIdAndUpdate(
      previousResume._id,
      {
        resume: {
          title: req.file?.originalname,
          url: uploadResponse.secure_url,
        },
      },
      { new: true, runValidators: true }
    );

    if (previousResume && previousResume.resume) {
      const parts = previousResume?.resume?.url?.split("/");
      const previousPublicId = parts[parts.length - 1].split(".")[0];
      await cloudinary.uploader.destroy(`Resume/${previousPublicId}`);
    }

    await checkEligibility(user, updatedCandidateProfile);

    // Success
    res.status(200).json({
      status: "success",
      message: "Successfully Uploaded Resume",
      data: updatedCandidateProfile,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteUserById = async (req, res) => {
  const { user, targetUser } = req;

  try {
    await targetUser.remove();

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
