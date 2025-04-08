import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in your environment variables."
  );
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
