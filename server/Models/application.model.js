import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    profileSnapshot: {
      contact: {
        phoneNumber: String,
        email: String,
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
      resume: {
        title: String,
        url: String,
      },
    },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "hired", "rejected"],
      default: "pending",
    },
  },
  { strict: true, timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
