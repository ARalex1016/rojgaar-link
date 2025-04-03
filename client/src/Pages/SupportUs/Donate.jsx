import { useState } from "react";

// Components
import {
  FloatingLabelInput,
  TextAreaFloatingLabel,
  RadioInput,
} from "../../Components/Input";

// Store
import { useAuthStore } from "../../Store/useAuthStore";

const Donate = () => {
  const { user, isAuthenticated } = useAuthStore();

  const initialDonation = {
    name: "",
    amount: "",
    message: "",
    keepPrivate: false,
  };

  const [donation, setDonation] = useState(initialDonation);

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

  const handleDonteClick = () => {
    if (!donation.amount) {
      alert("Please enter the amount to donate.");
      return;
    }

    if (Number(donation.amount) < 3) {
      alert("Minimum donation amount is $3.");
      return;
    }

    // Donation Logic
    console.log(donation);
  };

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
          value={isAuthenticated && user?.name}
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

        {/* Button (Donate Now) */}
        <button
          onClick={handleDonteClick}
          className="w-full text-lg text-neutral/80 font-medium bg-main/80 rounded-md cursor-pointer py-1 mt-2 hover:text-neutral hover:bg-main"
        >
          Donate Now
        </button>
      </section>
    </>
  );
};

export default Donate;
