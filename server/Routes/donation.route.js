import express from "express";

// Controller
import { createDonationIntent } from "../Controllers/donation.controller.js";

const router = express.Router();

router.post("/create-payment-intent", createDonationIntent);

router.post("/webhooks/stripe", createDonationIntent);

export default router;
