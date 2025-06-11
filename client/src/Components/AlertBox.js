import Swal from "sweetalert2";

// icon = success || error || warning || info || question

export const AlertBox = async ({ title, text, icon, draggable, footer }) => {
  return Swal.fire({
    title,
    text,
    icon,
    draggable,
    footer,
  });
};

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

export const CloseAlertBox = () => {
  Swal.close();
};
