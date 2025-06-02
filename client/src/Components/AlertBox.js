import Swal from "sweetalert2";

// icon = success || error || warning || info || question

export const AlertBox = async ({ title, text, icon, draggable }) => {
  return Swal.fire({
    title,
    text,
    icon,
    draggable,
  });
};

// Alert Box Example
// AlertBox({
//         title: "Upload failed",
//         text: error.message || "Something went wrong during the upload.",
//         icon: "error",
//       });

export const ConfirmAlertBox = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor,
  cancelButtonColor,
  reverseButtons = true,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor,
    cancelButtonColor,
    reverseButtons,
  });
  return result.isConfirmed;
};
