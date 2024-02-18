import Swal, { SweetAlertIcon } from "sweetalert2";

import { AlertOptions } from "../interfaces/IAlertOptions";

const defaultOptions = {
  icon: "info" as SweetAlertIcon,
  confirmButtonText: "OK",
};

export const showAlert = (options: AlertOptions) => {
  const mergedOptions = { ...defaultOptions, ...options };
  Swal.fire(mergedOptions).then((result) => {
    if (result.isConfirmed && options.func) {
      options.func();
    }
  });
};

export const showSuccessAlert = (
  title: string,
  text: string,
  func?: () => void
) => {
  showAlert({ title, text, type: "success", confirmButtonText: "OK", func });
};

export const showErrorAlert = (
  title: string,
  text: string,
  func?: () => void
) => {
  showAlert({ title, text, type: "error", confirmButtonText: "OK", func });
};

export const showInfoAlert = (
  title: string,
  text: string,
  func?: () => void
) => {
  showAlert({ title, text, type: "info", confirmButtonText: "OK", func });
};

export const showWarningAlert = (
  title: string,
  text: string,
  func?: () => void
) => {
  showAlert({ title, text, type: "warning", confirmButtonText: "OK", func });
};

export const showConfirmAlert = (
  title: string,
  text: string,
  confirmButtonText: string,
  func: () => void
) => {
  showAlert({ title, text, type: "warning", confirmButtonText, func });
};

export const showCustomAlert = (options: AlertOptions) => {
  showAlert(options);
};
