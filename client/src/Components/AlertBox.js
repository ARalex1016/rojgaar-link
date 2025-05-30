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

export const ConfirmAlertBox = async ({
  title = "Are you sure?",
  text = "You won't be able to revert this!",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  reverseButtons = true,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });
  return result.isConfirmed;
};
