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
      default: "USD",
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
      enum: ["Stripe", "Visa", "Mastercard", "GooglePay"],
      required: true,
    },
  },
  { strict: true, timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
