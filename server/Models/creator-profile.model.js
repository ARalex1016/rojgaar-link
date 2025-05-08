import mongoose from "mongoose";

const creatorProfileSchema = new mongoose.Schema(
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
    card: {
      type: String,
    },
  },
  { strict: true, timestamps: true }
);

const CreatorProfile = mongoose.model("CreatorProfile", creatorProfileSchema);

export default CreatorProfile;
