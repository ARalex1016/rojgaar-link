// Mui
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
// import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const Button = ({ children, onClick, className }) => {
  return (
    <>
      <Button
        onClick={onClick}
        className={`cursor-pointer disabled:text-neutral disabled:cursor-not-allowed disabled:bg-gray ${className}`}
      >
        {children}
      </Button>
    </>
  );
};

export const ProgressMobileStepper = ({
  steps,
  activeStep,
  next,
  back,
  actionTextLastStep = "Submit",
}) => {
  const theme = useTheme();

  return (
    <MobileStepper
      variant="progress"
      steps={steps}
      position="static"
      activeStep={activeStep}
      sx={{ backgroundColor: "transparent", maxWidth: 400, flexGrow: 1 }}
      nextButton={
        <Button
          onClick={next}
          //   disabled={activeStep >= steps - 1}
        >
          {steps - 1 === activeStep ? actionTextLastStep : "Next"}
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button onClick={back} disabled={activeStep === 0}>
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    />
  );
};
