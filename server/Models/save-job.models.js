import mongoose from "mongoose";

const saveJobSchema = new mongoose.Schema(
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
  },
  { strict: true, timestamps: true }
);

const SaveJob = mongoose.model("SaveJob", saveJobSchema);

export default SaveJob;
