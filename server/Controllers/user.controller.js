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
    }

    // if (user.role === "creator") {
    //   userProfile = await CandidateProfile.findOne({ userId: user._id });
    // }

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

export const updatedProfileDetails = async (req, res) => {
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

    let previousEligibility = updatedProfileDetails.eligible;

    let eligibility = checkEligibility(user, updatedProfileDetails);

    if (eligibility !== previousEligibility) {
      updatedProfileDetails.eligible = eligibility;
      await updatedProfileDetails.save();
    }

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
  const { resume } = req.body;
  const { user } = req;

  try {
    if (!resume) {
      return res.status(400).json({
        status: "fail",
        message: "Resume is required",
      });
    }

    const previousResume = await CandidateProfile.findOne({
      userId: user._id,
    }).select("_id resume");

    const uploadResponse = await cloudinary.uploader.upload(resume, {
      folder: "Resume",
    });

    const updatedCandidateProfile = await CandidateProfile.findByIdAndUpdate(
      previousResume._id,
      { resume: uploadResponse.secure_url },
      { new: true }
    );

    if (previousResume && previousResume.resume) {
      const parts = previousResume.resume.split("/");
      const previousPublicId = parts[parts.length - 1].split(".")[0];

      await cloudinary.uploader.destroy(`Resume/${previousPublicId}`);
    }

    let previousEligibility = updatedCandidateProfile.eligible;

    let eligibility = checkEligibility(user, updatedCandidateProfile);

    if (eligibility !== previousEligibility) {
      updatedCandidateProfile.eligible = eligibility;
      await updatedCandidateProfile.save();
    }

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
