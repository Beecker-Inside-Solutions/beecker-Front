import { SweetAlertIcon } from "sweetalert2";

export interface AlertOptions {
  title: string;
  text: string;
  icon?: SweetAlertIcon;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  func?: () => void;
  cancelFunc?: () => void;
}
