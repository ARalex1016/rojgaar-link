import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import { LoadingCircle } from "../../Components/Loading";

// Lucide Icons
import { CircleCheckBig, HandHeart } from "lucide-react";

// Store
import { useDonationStore } from "../../Store/useDonationStore";

const ThanksPageStripe = () => {
  const { stripePaymentSuccess } = useDonationStore();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const paymentIntent = queryParams.get("payment_intent");

  const [donationData, setDonationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const varifyPaymentIntent = async () => {
      setLoading(true);
      try {
        let res = await stripePaymentSuccess(paymentIntent);

        setDonationData(res.data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    varifyPaymentIntent();
  }, [paymentIntent]);

  if (loading) {
    return <LoadingCircle className="mt-32" />;
  }

  return (
    <>
      <section className="w-full max-w-96 bg-[#1F2936] rounded-md flex flex-col justify-center items-center gap-y-2 px-6 py-6 mx-auto mt-20">
        <CircleCheckBig size={45} className="text-customGreen" />

        <div className="w-full text-center">
          <h2 className="text-customGreen text-xl font-bold">
            Donation Successful
          </h2>

          <p className="text-xs text-neutral/60 mt-1">
            Thank you for your support{" "}
            <span className="text-neutral/80 font-medium">
              Mr. {donationData?.name || "User"}
            </span>
          </p>
        </div>

        <div className="w-full bg-[#343E4D] rounded-md grid grid-cols-2 gap-x-4 gap-y-2 mt-4 px-6 py-2">
          <p className="text-neutral/40 font-medium">Amount</p>
          <p className="text-customGreen font-medium text-right">
            {donationData?.amount}
          </p>

          <p className="text-neutral/40 font-medium">Currency</p>
          <p className="text-customGreen font-medium text-right">
            {donationData?.currency.toUpperCase()}
          </p>
        </div>

        <div className="w-full text-neutral font-medium bg-customGreen rounded-md flex flex-row justify-center items-center gap-x-1 py-2">
          <HandHeart size={20} /> Thanks for Trusting us!
        </div>

        <Link
          to={"/support-us"}
          className="w-full text-red text-center font-medium bg-[#343E4D] rounded-md cursor-pointer py-2"
        >
          Back
        </Link>

        <button></button>
      </section>
    </>
  );
};

export default ThanksPageStripe;
