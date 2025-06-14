import mongoose from "mongoose";
import { jobCategories } from "../lib/jobCategories.js";

const jobSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    location: {
      country: { type: String, required: true },
      state: { type: String, required: true },
    },
    companyName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: jobCategories,
      required: true,
    },
    otherCategory: {
      type: String,
      required: function () {
        return this.category === "Others";
      },
    },
    experienceLevel: {
      type: String,
      enum: ["beginer", "intermediate", "skilled"],
    },
    requirements: {
      type: [String],
      required: true,
    },
    maximumWorkers: {
      type: Number,
      required: true,
    },
    workersHired: {
      type: Number,
      default: 0,
    },
    lastSubmissionDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "filled", "expired"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedDate: {
      type: Date,
    },
  },
  { strict: true, timestamps: true }
);

const Jobs = mongoose.model("Job", jobSchema);

export default Jobs;
