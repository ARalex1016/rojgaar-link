// Lib
import stripe from "./../lib/stripe.js";

export const createDonationIntent = async (req, res) => {
  const { amount, name, message, keepPrivate } = req.body;

  if (!amount) return res.status(400).send({ error: "Amount is required" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(amount * 100), // amount in cents
      currency: "usd",
      metadata: { name, message, keepPrivate: keepPrivate.toString() },
      automatic_payment_methods: { enabled: true }, // Enables multiple payment options
    });

    // Success
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};
