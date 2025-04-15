// Icons
import esewaicon from "./../../public/Icons/esewa.png";
import khaltiicon from "./../../public/Icons/khalti.png";
import { X } from "lucide-react";

export const EsewaIcon = ({ handleClick, className }) => {
  const id = "esewa";

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className={`w-16 bg-neutral rounded-md p-2 ${className}`}
      >
        <img src={esewaicon} alt="esewa-icon" />
      </div>
    </>
  );
};

export const KhaltiIcon = ({ handleClick, className }) => {
  const id = "khalti";

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className={`w-16 bg-neutral rounded-md p-2 ${className}`}
      >
        <img src={khaltiicon} alt="khalti-icon" />
      </div>
    </>
  );
};

export const XIcon = ({ handleClick, className }) => {
  return (
    <>
      <X
        onClick={handleClick}
        size={30}
        className={`text-red bg-transparent rounded-full p-1 hover:text-neutral hover:bg-red ${className}`}
      />
    </>
  );
};
