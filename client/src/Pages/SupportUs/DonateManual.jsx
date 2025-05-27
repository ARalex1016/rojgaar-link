import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import {
  PNGIcon,
  XIcon,
  DownloadIcon,
  ArrowRightIcon,
} from "../../Components/Icons";
import { CopyableText } from "../../Components/Input";

// Utils
import { capitalize } from "../../Utils/StringManager";

const DonateManual = () => {
  const popUpBox = useRef();

  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "imepay",
      name: "IME-Pay",
      icon: "/Icons/ime-pay.png",
      details: {
        id: "ime-pay id",
        qrSrc: "/Icons/ime-pay.png",
      },
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: "/Icons/khalti.png",
      details: {
        id: "khalti id",
        qrSrc: "/Icons/khalti.png",
      },
    },
  ];

  const SelectedIcon = selectedMethod ? selectedMethod?.icon : null;

  const handleIconClick = (method) => {
    setSelectedMethod(method);
  };

  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      // Close if clicking outside the pop-up
      if (popUpBox.current && !popUpBox.current.contains(event.target)) {
        setSelectedMethod(null);
      }
    };

    const handleScroll = () => {
      setSelectedMethod(null); // Close on scroll
    };

    if (selectedMethod) {
      // Listen to mouse, key, and scroll events
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("keydown", handleOutsideInteraction);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Cleanup listeners
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("keydown", handleOutsideInteraction);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedMethod]);

  return (
    <>
      <section className="w-full relative pb-2">
        <h1 className="text-2xl text-neutral font-medium text-center mt-4">
          Support Our Mission
        </h1>

        <p className="text-neutral/70 text-sm text-center font-medium">
          {/* Your Contribution Makes a Difference */}
          Let’s help build a stronger and self-reliant Nepali community
        </p>

        {/* Payment Icons as Tabs */}
        <div className="flex flex-row items-center justify-center gap-x-4 my-4">
          {paymentMethods.map((method) => {
            return (
              <PNGIcon
                key={method.id}
                png={method.icon}
                handleClick={() => handleIconClick(method)}
                className={`bg-neutral/90 shadow-sm shadow-gray hover:bg-neutral cursor-pointer`}
              />
            );
          })}
        </div>

        {/* Pop Up */}
        <AnimatePresence>
          {selectedMethod && (
            <motion.div
              variants={{
                initial: {
                  scale: 0,
                },
                final: {
                  scale: 1,
                },
              }}
              initial="initial"
              animate="final"
              exit="initial"
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              ref={popUpBox}
              className="w-full bg-neutral rounded-md shadow-md shadow-gray flex flex-col items-center absolute top-0 z-40 px-4 pt-2 pb-4"
            >
              <XIcon
                handleClick={() => setSelectedMethod(null)}
                className="absolute right-0 mr-2"
              />

              <PNGIcon png={selectedMethod.icon} />

              <div className="w-full grid grid-cols-3 gap-y-4">
                <p className="text-left font-medium flex items-center px-2 col-span-1">
                  {capitalize(selectedMethod?.name)} Id
                </p>

                <CopyableText
                  text={selectedMethod?.details?.id}
                  className="border-[1px] border-black col-span-2"
                />

                <img
                  src={selectedMethod?.details?.qrSrc}
                  alt={`${capitalize(selectedMethod?.name)}-QR`}
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
                    href={selectedMethod?.details?.qrSrc}
                    download={`${selectedMethod?.id}-qr.png`}
                    className="flex gap-x-2"
                  >
                    <p>Download QR</p>

                    <DownloadIcon className="text-neutral" />
                  </a>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-sm text-neutral/80 font-medium italic text-center flex flex-row">
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
            Donate With Card
          </h2>

          <iframe
            id="kofiframe"
            title="rojgaarlink"
            src="https://ko-fi.com/rojgaarlink/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{
              border: "none",
              width: "100%",
              maxWidth: "400px",
              padding: "4px",
              background: "#f9f9f9",
            }}
            height="712"
            allow="payment"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default DonateManual;
