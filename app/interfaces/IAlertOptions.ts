import Swal, { SweetAlertIcon } from "sweetalert2";

export interface AlertOptions {
    title: string;
    text: string;
    type: SweetAlertIcon;
    icon?: SweetAlertIcon; // Adding the icon property
    confirmButtonText: string;
    func?: () => void;
}
