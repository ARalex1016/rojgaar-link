import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Components
import { EsewaIcon, KhaltiIcon, XIcon } from "../../Components/Icons";
import { CopyableText } from "../../Components/Input";

// Utils
import { capitalize } from "../../Utils/StringManager";

const DonateManual = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "esewa",
      name: "Esewa",
      icon: EsewaIcon,
      details: {
        id: "esewa id",
      },
    },
    {
      id: "khalti",
      name: "Khalti",
      icon: KhaltiIcon,
      details: {
        id: "khalti id",
      },
    },
  ];

  const SelectedIcon = selectedMethod
    ? paymentMethods.find((method) => method.id === selectedMethod)?.icon
    : null;

  const handleIconClick = (method) => {
    setSelectedMethod(method);
  };

  return (
    <>
      <section className="w-full relative">
        <p className="text-neutral text-xl text-center font-medium">
          Support Our Mission
        </p>

        <p className="text-neutral/70 text-sm text-center font-medium">
          Your Contribution Makes a Difference
        </p>

        <div className="flex flex-row items-center justify-center gap-x-4 my-4">
          <EsewaIcon
            selectedMethod={selectedMethod}
            handleClick={handleIconClick}
            className=""
          />

          <KhaltiIcon
            selectedMethod={selectedMethod}
            handleClick={handleIconClick}
            className=""
          />
        </div>

        {selectedMethod && (
          <motion.div className="w-full h-[80vh] bg-neutral rounded-md shadow-md shadow-gray flex flex-col items-center absolute top-0 z-40 p-2">
            <XIcon
              handleClick={() => setSelectedMethod(null)}
              className="absolute right-0 mr-2"
            />

            <SelectedIcon className="w-[100px]" />

            <div className="w-full grid grid-cols-3">
              <p className="text-left flex items-center px-2 col-span-1">
                {capitalize(selectedMethod)} Id
              </p>

              <CopyableText
                text={
                  paymentMethods.find((method) => method.id === selectedMethod)
                    .details.id
                }
                className="border-2 border-black col-span-2"
              />
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default DonateManual;
