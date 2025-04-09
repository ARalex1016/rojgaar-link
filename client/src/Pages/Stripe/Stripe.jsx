import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// Components
import { LoadingCircle } from "../../Components/Loading";

// Stripe
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Store
import { useDonationStore } from "../../Store/useDonationStore";
import { useUserStore } from "../../Store/useUserStore";

const stripePromise = loadStripe(
  "pk_test_51RArHMH8vXcBquDzkXdS7uNsKqEPSPkMhpbhiTsx0dCUOQ8ryIqg9ilAzBx0vKXrIH5B8FeTIFCCg7P81Z8e2z3N00eqazJv65"
);

const StripeCheckOutPage = ({ data, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [donating, setDonating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const paymentElementOptions = {
    layout: "tabs",
    defaultCollapsed: false,
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
          return_url: `${window.location.origin}/stripe/thanks`,
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
    return <LoadingCircle className="h-96" />;
  }

  return (
    <>
      <section className="w-full text-center bg-neutral/80 rounded-md px-4 py-2 my-2">
        <h2 className="font-bold">Almost There!</h2>

        <p className="text-sm">
          Please enter your payment details to complete your donation securely.
        </p>
      </section>

      {stripe && elements && (
        <section className="w-full bg-white rounded-md flex flex-col justify-center items-center gap-y-2 px-2 py-4 ">
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
            className="w-full text-lg text-neutral font-medium bg-black rounded-md cursor-pointer py-2 disabled:bg-gray disabled:cursor-not-allowed disabled:animate-pulse"
          >
            {donating ? "Processing..." : `Donate $${data.amount}`}
          </motion.button>
        </section>
      )}
    </>
  );
};

const StripeElement = () => {
  const location = useLocation();
  const data = location.state;

  const { createDonationIntent } = useDonationStore();
  const { user } = useUserStore();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createStripeIntent = async () => {
      setLoading(true);
      try {
        const res = await createDonationIntent({
          donorId: user ? user?._id : null,
          amount: data?.amount,
          name: data?.name,
          message: data?.message,
          keepPrivate: data?.keepPrivate,
        });

        setClientSecret(res.data.clientSecret);
      } catch (error) {
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
    theme: "stripe",
  };

  const loader = "auto";

  if (loading || !clientSecret) {
    return <LoadingCircle className="h-96" />;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
        loader,
      }}
    >
      <StripeCheckOutPage data={data} clientSecret={clientSecret} />
    </Elements>
  );
};

export default StripeElement;
