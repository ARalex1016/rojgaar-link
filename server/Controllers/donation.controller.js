// Lib
import stripe from "./../lib/stripe.js";

export const createDonationIntent = async (req, res) => {
  const { amount, name, message, keepPrivate } = req.body;

  // if (!amount) return res.status(400).send({ error: "Amount is required" });

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
