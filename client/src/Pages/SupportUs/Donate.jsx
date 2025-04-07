import { useState, useEffect } from "react";

// Stripe
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Components
import {
  FloatingLabelInput,
  TextAreaFloatingLabel,
  RadioInput,
} from "../../Components/Input";

// Store
import { useAuthStore } from "../../Store/useAuthStore";
import { useDonationStore } from "../../Store/useDonationStore";

const Donate = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { createDonationIntent } = useDonationStore();

  const stripe = useStripe();
  const elements = useElements();

  const initialDonation = {
    name: "",
    amount: "",
    message: "",
    keepPrivate: false,
  };

  const [donation, setDonation] = useState(initialDonation);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDonation((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  // For Amount Options
  const handleRadioChange = (e) => {
    setDonation((pre) => ({
      ...pre,
      amount: e.target.value,
    }));
  };

  const handleDonteClick = async () => {
    if (!donation.amount) {
      alert("Please enter the amount to donate.");
      return;
    }

    if (Number(donation.amount) < 2) {
      alert("Minimum donation amount is $3.");
      return;
    }

    setIsLoading(true);

    try {
      let res = await createDonationIntent(donation);

      const { clientSecret } = res.data;

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: donation.name },
        },
      });

      if (paymentResult.error) {
        alert(paymentResult.error.message);
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          setSuccess("Donation successful!");
          alert("successful donation");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync user.name to donation.name when available
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      setDonation((prev) => ({
        ...prev,
        name: user.name,
      }));
    }
  }, [isAuthenticated, user?.name]);

  return (
    <>
      <p className="text-neutral text-xl text-center font-medium">
        Support Our Mission
      </p>

      <p className="text-neutral/70 text-sm text-center font-medium">
        Your Contribution Makes a Difference
      </p>

      {/* Donation Input Form */}
      <section className="w-full max-w-[400px] flex flex-col justify-center items-center gap-y-2 mt-5">
        {/* Name */}
        <FloatingLabelInput
          label="Name"
          id="name"
          name="name"
          readOnly={isAuthenticated && user?.name}
          value={donation.name}
          handleInputChange={handleInputChange}
        />

        {/* Amount Input */}
        <FloatingLabelInput
          type="number"
          label="Amount"
          id="amount"
          name="amount"
          value={donation.amount}
          handleInputChange={handleInputChange}
        />

        {/* Amount OPT */}
        <section className="w-full flex flex-row justify-between gap-x-2 overflow-auto scrollbar-hide">
          {[3, 5, 10, 50, 100].map((amount) => (
            <RadioInput
              key={amount}
              label={`$${amount}`}
              id={`amount-${amount}`}
              name="amount-opt"
              value={amount}
              checked={amount.toString() === donation.amount.toString()}
              handleInputChange={handleRadioChange}
            />
          ))}
        </section>

        {/* Message */}
        <TextAreaFloatingLabel
          label="Message"
          id="message"
          name="message"
          value={donation.message}
          handleInputChange={handleInputChange}
        />

        {/* Check Box */}
        <div className="w-full flex flex-row gap-x-1">
          <input
            type="checkbox"
            name="checkbox"
            id="checkbox"
            checked={donation.keepPrivate}
            onChange={(e) => {
              setDonation((pre) => ({
                ...pre,
                keepPrivate: !pre.keepPrivate,
              }));
            }}
            className="cursor-pointer"
          />

          <label htmlFor="checkbox" className="text-neutral/70 text-sm">
            Keep my name hidden on the donation list.
          </label>
        </div>

        {!stripe || !elements ? (
          <p className="text-yellow-500 text-sm">Stripe is not loaded</p>
        ) : null}

        <CardElement
          options={{ style: { base: { fontSize: "16px" } } }}
          className="border p-2 rounded bg-white"
        />

        {/* Button (Donate Now) */}
        <button
          disabled={!stripe || isLoading}
          onClick={handleDonteClick}
          className="w-full text-lg text-neutral/80 font-medium bg-main/80 rounded-md cursor-pointer py-1 mt-2 hover:text-neutral hover:bg-main"
        >
          {isLoading ? "Processing..." : "Donate"}
        </button>
      </section>
    </>
  );
};

export default Donate;
