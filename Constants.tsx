import { ILanguage } from "./app/interfaces/ILanguages";
import { IRoutes } from "./app/interfaces/IRoutes";

export const apiURL = "";

export const languages: ILanguage[] = [
  { value: "en", label: "🇺🇸 English" },
  { value: "es", label: "🇲🇽 Español" },
];

export const routes: IRoutes = {
  home: "/",
  register: "/register",
  forgotPassword: "/forgotPassword",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  logout: "/logout",
};
