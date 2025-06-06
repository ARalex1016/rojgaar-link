import { useState } from "react";

export const useMultiStepForm = (steps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((pre) => pre + 1);
    }
  };

  const back = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((pre) => pre - 1);
    }
  };

  const goTo = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    next,
    back,
    goTo,
  };
};
