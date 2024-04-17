import { Slide, toast, ToastContent, ToastOptions } from "react-toastify";

// Default options for toast notifications
export const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Slide,
};

/**
 * Displays a toast notification with the provided content and options.
 * @param content The content to display in the toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showToast = (content: ToastContent, options?: ToastOptions) => {
  const mergedOptions = { ...defaultToastOptions, ...options };
  toast(content, mergedOptions);
};

/**
 * Displays a success toast notification with the provided content and options.
 * @param content The content to display in the success toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showSuccessToast = (
  content: ToastContent,
  options?: ToastOptions
) => {
  showToast(content, { ...options, className: "success-toast" });
};

/**
 * Displays an error toast notification with the provided content and options.
 * @param content The content to display in the error toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showErrorToast = (
  content: ToastContent,
  options?: ToastOptions
) => {
  showToast(content, { ...options, className: "error-toast" });
};

/**
 * Displays an info toast notification with the provided content and options.
 * @param content The content to display in the info toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showInfoToast = (
  content: ToastContent,
  options?: ToastOptions
) => {
  showToast(content, { ...options, className: "info-toast" });
};

/**
 * Displays a warning toast notification with the provided content and options.
 * @param content The content to display in the warning toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showWarningToast = (
  content: ToastContent,
  options?: ToastOptions
) => {
  showToast(content, { ...options, className: "warning-toast" });
};

/**
 * Displays a default toast notification with the provided content and options.
 * @param content The content to display in the default toast notification.
 * @param options (Optional) Custom options to override default options.
 */
export const showDefaultToast = (
  content: ToastContent,
  options?: ToastOptions
) => {
  showToast(content, { ...options, className: "default-toast" });
};
