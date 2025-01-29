import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    message: String, // Optional message
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
