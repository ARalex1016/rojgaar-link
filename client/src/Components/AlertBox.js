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
  title,
  text,
  icon,
  showCancelButton = true,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  reverseButtons = true,
}) => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton,
    confirmButtonText,
    cancelButtonText,
    reverseButtons,
  });
};
