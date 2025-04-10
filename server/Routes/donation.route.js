import express from "express";

// Controller
import { checkAuthentication } from "../Controllers/auth.controller.js";
import {
  getTopDonorsOfTheMonth,
  createDonationIntent,
  stripePaymentSuccess,
} from "../Controllers/donation.controller.js";

const router = express.Router();

router.get(
  "/top-donrs-of-the-month",
  checkAuthentication,
  getTopDonorsOfTheMonth
);

router.post("/create-payment-intent", createDonationIntent);

router.post("/stripe-payment-success", stripePaymentSuccess);

export default router;
