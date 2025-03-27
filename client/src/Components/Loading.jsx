// Mui
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

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
