import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

const stripePromise = loadStripe(
  "pk_test_51RArHMH8vXcBquDzkXdS7uNsKqEPSPkMhpbhiTsx0dCUOQ8ryIqg9ilAzBx0vKXrIH5B8FeTIFCCg7P81Z8e2z3N00eqazJv65"
);

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </StrictMode>
);
