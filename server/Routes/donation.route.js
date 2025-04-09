import express from "express";

// Controller
import {
  createDonationIntent,
  stripePaymentSuccess,
} from "../Controllers/donation.controller.js";

const router = express.Router();

router.post("/create-payment-intent", createDonationIntent);

router.post("/stripe-payment-success", stripePaymentSuccess);

export default router;
