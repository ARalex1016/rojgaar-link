// Mui
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

// Lucide Icons
import { LoaderCircle } from "lucide-react";

export const LoadingLinear = ({ isVisible }) => {
  return (
    <>
      <div className="w-full mt-menuHeight absolute">
        {isVisible && (
          <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
            <LinearProgress color="secondary" />
          </Stack>
        )}
      </div>
    </>
  );
};

export const LoadingCircle = ({ className }) => {
  return (
    <>
      <div className={`w-full flex justify-center items-center ${className}`}>
        <LoaderCircle className="animate-spin text-neutral" size={40} />
      </div>
    </>
  );
};
