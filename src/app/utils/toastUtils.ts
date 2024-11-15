import { toast, TypeOptions } from "react-toastify";

export const showToast = ({
  message,
  type,
}: {
  message: string;
  type: TypeOptions;
}) => {
  toast(message, {
    type,
  });
};
