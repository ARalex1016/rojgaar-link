import { useState } from "react";

const ExpandableText = ({ text, maxLength = 150, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <p className="text-neutral/80">{text}</p>;
  }

  return (
    <p
      className={`text-neutral/80 ${
        isExpanded ? "text-xs" : "text-sm"
      } ${className}`}
    >
      {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-orange/80 font-medium ml-2"
      >
        {isExpanded ? "See Less" : "See More"}
      </button>
    </p>
  );
};

export default ExpandableText;
