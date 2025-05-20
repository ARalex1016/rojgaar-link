import Swal from "sweetalert2";

export const AlertBox = async ({ title, icon, draggable }) => {
  return Swal.fire({
    title,
    icon,
    draggable,
  });
};
