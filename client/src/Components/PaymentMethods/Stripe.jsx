import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Lucide Icons
import { LoaderCircle } from "lucide-react";

// Stripe
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RArHMH8vXcBquDzkXdS7uNsKqEPSPkMhpbhiTsx0dCUOQ8ryIqg9ilAzBx0vKXrIH5B8FeTIFCCg7P81Z8e2z3N00eqazJv65"
);

// Store
import { useDonationStore } from "../../Store/useDonationStore";

const StripeCheckOutPage = ({ data, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [donating, setDonating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const paymentElementOptions = {
    layout: "accordion",
  };

  const validateAmount = () => {
    if (data?.amount < 2) {
      alert("Minimum amount to donate is $2.00");
      return false;
    }

    return true;
  };

  const handleDonte = async () => {
    let validAmount = validateAmount();
    if (!validAmount) return;

    if (!stripe || !elements) {
      return;
    }

    setDonating(true);
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/support-us/thanks?amount=${data.amount}&name=${data.name}`,
        },
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setDonating(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="w-full flex justify-center items-center">
        <LoaderCircle className="animate-spin text-neutral" size={40} />
      </div>
    );
  }

  return (
    <>
      <PaymentElement
        id="payment-element"
        options={paymentElementOptions}
        className="w-full"
      />

      {errorMessage && <p>{errorMessage}</p>}

      {/* Button (Donate Now) */}
      <motion.button
        variants={{
          initial: {
            scale: 1,
          },
          final: {
            scale: 0.97,
          },
        }}
        whileTap="final"
        disabled={donating}
        onClick={!stripe || handleDonte}
        className="w-full text-lg text-black font-medium bg-neutral rounded-md cursor-pointer py-2 disabled:bg-gray disabled:cursor-not-allowed disabled:animate-pulse"
      >
        {donating ? "Processing..." : `Donate $${data.amount}`}
      </motion.button>
    </>
  );
};

const StripeElement = ({ data }) => {
  const { createDonationIntent } = useDonationStore();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createStripeIntent = async () => {
      setLoading(true);
      try {
        const res = await createDonationIntent(data);
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        console.error("Error creating Stripe intent:", error);
        alert(
          "Failed to initialize the payment process. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    if (data && data.amount) {
      createStripeIntent();
    }
  }, [data]);

  const appearance = {
    theme: "night",
  };

  const loader = "auto";

  if (!data.amount) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className="text-red text-lg font-medium">No Amount Provided</p>
      </div>
    );
  }

  if (loading || !clientSecret) {
    return (
      <div className="w-full flex justify-center items-center">
        <LoaderCircle className="animate-spin text-neutral" size={40} />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance, loader }}
    >
      <StripeCheckOutPage data={data} clientSecret={clientSecret} />
    </Elements>
  );
};

export default StripeElement;
