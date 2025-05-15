import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import CountUp from "react-countup";

const CounterUp = ({ number }) => {
  const counterRef = useRef();
  const isInView = useInView(counterRef, { once: true });

  let step = Math.max(1, Math.floor(number / 50));

  return (
    <p ref={counterRef} className="text-2xl font-bold text-main">
      {isInView && (
        <CountUp
          start={0}
          end={number}
          duration={2}
          delay={0}
          formattingFn={(value) =>
            value >= number ? number : Math.floor(value / step) * step
          }
        />
      )}
    </p>
  );
};

const ScoreBoard = ({ title, score }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-sm font-medium text-black/90 border-b-2 border-gray/50 px-2">
        {title}
      </p>
      <CounterUp number={score} />
    </div>
  );
};

export default ScoreBoard;
