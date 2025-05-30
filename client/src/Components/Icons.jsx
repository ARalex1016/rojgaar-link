// Icons
import {
  X,
  Plus,
  Minus,
  Download,
  ArrowRight,
  LoaderCircle,
  Upload,
  Eye,
  BadgeCheck,
} from "lucide-react";

export const PNGIcon = ({ handleClick, png, className }) => {
  const id = "ime-pay";

  return (
    <>
      <div
        onClick={() => handleClick(id)}
        className={`w-20 overflow-hidden bg-neutral rounded-md p-2 ${className}`}
      >
        <img src={png} alt="khalti-icon" />
      </div>
    </>
  );
};

export const XIcon = ({ handleClick, size = 30, className }) => {
  return (
    <>
      <X
        onClick={handleClick}
        size={size}
        className={`text-red bg-transparent rounded-full p-1 hover:text-neutral hover:bg-red cursor-pointer ${className}`}
      />
    </>
  );
};

export const PlusIcon = ({ handleClick, size = 30, className }) => {
  return (
    <>
      <Plus
        onClick={handleClick}
        size={size}
        className={`bg-transparent rounded-full p-1 hover:text-neutral ${className}`}
      />
    </>
  );
};

export const MinusIcon = ({ handleClick, size = 30, className }) => {
  return (
    <>
      <Minus
        onClick={handleClick}
        size={size}
        className={`bg-transparent rounded-full p-1 hover:text-neutral ${className}`}
      />
    </>
  );
};

export const DownloadIcon = ({ className, size = 24 }) => {
  return (
    <>
      <Download size={size} className={`${className}`} />
    </>
  );
};

export const ArrowRightIcon = ({ className, size = 24 }) => {
  return (
    <>
      <ArrowRight size={size} className={`${className}`} />
    </>
  );
};

export const LoaderCircleIcon = ({ className }) => {
  return (
    <>
      <LoaderCircle size={24} className={`${className}`} />
    </>
  );
};

export const UploadIcon = ({ className }) => {
  return (
    <>
      <Upload size={24} className={`${className}`} />
    </>
  );
};

export const ViewIcon = ({ className, size = 24 }) => {
  return (
    <>
      <Eye size={size} className={`${className}`} />
    </>
  );
};

export const BadgeCheckIcon = ({ className, size = 24 }) => {
  return (
    <>
      <BadgeCheck size={size} className={`${className}`} />
    </>
  );
};
