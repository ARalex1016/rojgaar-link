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
            <LinearProgress color="primary" />
          </Stack>
        )}
      </div>
    </>
  );
};

export const LoadingCircle = ({ className, size = 40 }) => {
  return (
    <>
      <div className={`w-full flex justify-center items-center ${className}`}>
        <LoaderCircle size={size} className="animate-spin text-neutral" />
      </div>
    </>
  );
};
