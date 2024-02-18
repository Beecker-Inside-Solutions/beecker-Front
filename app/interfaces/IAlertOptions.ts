import Swal, { SweetAlertIcon } from "sweetalert2";

export interface AlertOptions {
    title: string;
    text: string;
    type: SweetAlertIcon;
    confirmButtonText: string;
    func?: () => void;
}