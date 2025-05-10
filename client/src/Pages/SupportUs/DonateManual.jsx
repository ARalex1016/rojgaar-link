import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Components
import {
  EsewaIcon,
  KhaltiIcon,
  XIcon,
  DownloadIcon,
  ArrowRightIcon,
} from "../../Components/Icons";
import { CopyableText } from "../../Components/Input";

// Utils
import { capitalize } from "../../Utils/StringManager";

const DonateManual = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedMethodObj, setSelectedMethodObj] = useState(null);

  const paymentMethods = [
    {
      id: "esewa",
      name: "Esewa",
      icon: EsewaIcon,
      details: {
        id: "esewa id",
        qrSrc: "/Icons/esewa.png",
      },
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: KhaltiIcon,
      details: {
        id: "khalti id",
        qrSrc: "/Icons/khalti.png",
      },
    },
  ];

  const SelectedIcon = selectedMethodObj ? selectedMethodObj?.icon : null;

  const handleIconClick = (method) => {
    setSelectedMethod(method);
  };

  useEffect(() => {
    if (selectedMethod) {
      setSelectedMethodObj(
        paymentMethods.find((method) => method.id === selectedMethod)
      );
    } else {
      setSelectedMethodObj(null);
    }
  }, [selectedMethod]);

  return (
    <>
      <section className="w-full relative">
        <p className="text-neutral text-xl text-center font-medium">
          Support Our Mission
        </p>

        <p className="text-neutral/70 text-sm text-center font-medium">
          {/* Your Contribution Makes a Difference */}
          Let’s help build a stronger, self-reliant Nepali community
        </p>

        {/* Payment Icons as Tabs */}
        <div className="flex flex-row items-center justify-center gap-x-4 my-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;

            return (
              <Icon
                key={method.id}
                selectedMethod={selectedMethod}
                handleClick={handleIconClick}
                className={`hover:bg-accent cursor-pointer ${
                  selectedMethod === method.id ? "bg-customBlue" : "bg-neutral"
                }`}
              />
            );
          })}
        </div>

        <p className="text-sm text-neutral/80 font-medium italic text-center flex">
          <ArrowRightIcon />
          Click on your preferred donation method to proceed, and make your
          contribution.
        </p>

        <p className="text-neutral text-xl font-medium text-center italic py-2">
          OR
        </p>

        {/* Ko-fi */}
        <div className="bg-white rounded-t-2xl">
          <h2 className="text-primary font-medium text-center text-lg py-2">
            Pay With Card
          </h2>

          <iframe
            id="kofiframe"
            title="rojgaarlink"
            src="https://ko-fi.com/rojgaarlink/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: "none",
              width: "100%",
              maxWidth: "400px",
              height: "712px",
              padding: "4px",
              background: "#f9f9f9",
            }}
            // className="rounded-b-md"
          ></iframe>
        </div>

        {/* Pop Up */}
        {selectedMethod && selectedMethodObj && (
          <motion.div className="w-full bg-neutral rounded-md shadow-md shadow-gray flex flex-col items-center absolute top-0 z-40 px-4 pt-2 pb-4">
            <XIcon
              handleClick={() => setSelectedMethod(null)}
              className="absolute right-0 mr-2"
            />

            <SelectedIcon className="w-[100px] mb-2" />

            <div className="w-full grid grid-cols-3 gap-y-4">
              <p className="text-left font-medium flex items-center px-2 col-span-1">
                {capitalize(selectedMethod)} Id
              </p>

              <CopyableText
                text={selectedMethodObj?.details?.id}
                className="border-[1px] border-black col-span-2"
              />

              <img
                src={selectedMethodObj?.details?.qrSrc}
                alt={`${capitalize(selectedMethod)}-QR`}
                className="w-10/12 aspect-square object-contain col-span-3 m-auto"
              />

              <motion.button
                variants={{
                  initial: {
                    scale: 1,
                  },
                  hover: {
                    scale: 1.05,
                  },
                  tap: {
                    scale: 0.95,
                  },
                }}
                whileHover="hover"
                whileTap="tap"
                title="Download QR"
                className="text-neutral bg-customBlue rounded-md shadow-md shadow-gray px-4 py-2 cursor-pointer col-span-3 m-auto"
              >
                <a
                  href={
                    paymentMethods.find(
                      (method) => method.id === selectedMethod
                    ).details.qrSrc
                  }
                  download={`${
                    paymentMethods.find(
                      (method) => method.id === selectedMethod
                    ).id
                  }-qr.png`}
                  className="flex gap-x-2"
                >
                  <p>Download QR</p>

                  <DownloadIcon className="text-neutral" />
                </a>
              </motion.button>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default DonateManual;
