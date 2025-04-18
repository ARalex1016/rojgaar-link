// Icons
import { X, Download, ArrowRight } from "lucide-react";

export const EsewaIcon = ({ handleClick, className }) => {
  const id = "esewa";

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className={`w-16 bg-neutral rounded-md p-2 ${className}`}
      >
        <img src="/Icons/esewa.png" alt="esewa-icon" />
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
        <img src="/Icons/khalti.png" alt="khalti-icon" />
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

export const DownloadIcon = ({ className }) => {
  return (
    <>
      <Download size={24} className={`${className}`} />
    </>
  );
};

export const ArrowRightIcon = ({ className }) => {
  return (
    <>
      <ArrowRight size={24} className={`${className}`} />
    </>
  );
};
