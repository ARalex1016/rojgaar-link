// Model
import Donation from "../Models/donation.model.js";

// Lib
import stripe from "./../lib/stripe.js";

export const createDonationIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).send({ error: "Amount is required" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "usd",
      metadata: req.body,
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

export const stripePaymentSuccess = async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    // Check if a donation with this transactionId already exists
    const existingDonation = await Donation.findOne({
      transactionId: paymentIntentId,
    });
    if (existingDonation) {
      return res.status(200).json({
        status: "success",
        message: "Donation already recorded",
        data: existingDonation,
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      const metadata = paymentIntent.metadata;

      const donation = new Donation({
        transactionId: paymentIntent.id,
        donor: metadata.donorId,
        amount: metadata.amount,
        currency: paymentIntent.currency,
        name: metadata.name,
        message: metadata.message,
        keepPrivate: metadata.keepPrivate,
        paymentMethod: "Stripe",
      });
      await donation.save();
      // Success
      return res.status(201).json({
        status: "success",
        message: "Donation recorded successfully",
        data: donation,
      });
    } else {
      return res.status(400).json({
        message: "Payment not successful",
      });
    }
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
