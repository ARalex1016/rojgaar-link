import mongoose from "mongoose";

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contact: {
      phoneNumber: String,
      socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
      },
    },
    location: {
      country: { type: String },
      state: { type: String },
    },
    education: [
      {
        degree: String,
        institution: String,
        yearOfGraduation: Number,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        yearsOfExperience: Number,
        description: String,
      },
    ],
    skills: [String],
    resume: { type: String },
  },
  { strict: true, timestamps: true }
);

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
);

export default CandidateProfile;
