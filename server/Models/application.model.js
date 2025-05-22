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
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CandidateProfile",
      required: true,
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
