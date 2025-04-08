// Model
import Donation from "../Models/donation.model.js";
import stripePackage from "stripe";

// Lib
import stripe from "./../lib/stripe.js";

export const createDonationIntent = async (req, res) => {
  const { amount, name, message, keepPrivate } = req.body;

  if (!amount) return res.status(400).send({ error: "Amount is required" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Success
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  console.log(1);

  const payload = req.body;
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // Extract necessary details
      const { amount, metadata } = paymentIntent;

      // Create a donation record
      const donation = new Donation({
        donor: metadata.donorId,
        amount: amount / 100, // Convert to dollars
        message: metadata.message,
        keepPrivate: metadata.keepPrivate === "true",
        paymentMethod: "Stripe",
      });

      // Success
      await donation.save();

      console.log(donation);

      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(400).send({ error: "Unhandled event type" });
    }
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: `Webhook Error: ${error.message}` || "Internal server error",
    });
  }
};
