// Model
import Donation from "../Models/donation.model.js";

// Lib
import stripe from "./../lib/stripe.js";

export const getTopDonorsOfTheMonth = async (req, res) => {
  const { isAuthenticated, user } = req;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const topDonors = await Donation.aggregate([
      // Filter donations within the current month
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      // Sort by donation amount in descending order
      { $sort: { amount: -1 } },
      // Limit to top 10 donations
      { $limit: 10 },
      // Optionally populate donor details if needed
      {
        $lookup: {
          from: "users", // Collection name for User model
          localField: "donorId",
          foreignField: "_id",
          as: "donorDetails",
        },
      },
      // Project required fields
      {
        $project: {
          transactionId: isAuthenticated && user?.role === "admin" ? 1 : 0, // Show transactionId only to admin
          donorId: 1,
          donorDetails: {
            name: 1,
            email: 1, // Include donor's email if required
          },
          amount: 1,
          currency: 1,
          name: 1,
          message: 1,
          keepPrivate: 1,
        },
      },
    ]);

    // Success
    res.status(200).json({
      status: "success",
      message: "",
    });
  } catch (error) {
    // Error
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

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
        paymentType: "Automated",
        status: "Verified",
        verifiedAt: new Date(),
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
