import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate transactions
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "usd",
    },
    name: {
      type: String,
    },
    message: String, // Optional message
    keepPrivate: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["Stripe", "NepaleseBankTransfer"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["Manual", "Automated"],
      required: true,
    },
    manualDetails: {
      bankName: { type: String }, // Optional, for manual payments
      referenceNumber: { type: String }, // User-provided transaction reference
      proofUrl: { type: String }, // URL to uploaded proof (e.g., screenshot)
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"], // Tracks admin verification status
      default: "Pending", // Start as pending for manual payments
    },
    verifiedAt: { type: Date }, // Timestamp of manual verification
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminNote: { type: String }, // Notes from admin for rejected transactions
  },
  { strict: true, timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
