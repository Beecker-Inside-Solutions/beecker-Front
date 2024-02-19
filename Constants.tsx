import { ILanguage } from "./app/interfaces/ILanguages";
import { IRoutes } from "./app/interfaces/IRoutes";
import { ILateralNavbar } from "./app/interfaces/ILateralNavbar";
import dashboardImage from "@/app/images/icons/dashboard.png";
import settingsImage from "@/app/images/icons/settings.png";

export const apiURL = "";

export const languages: ILanguage[] = [
  { value: "en", label: "🇺🇸 English" },
  { value: "es", label: "🇲🇽 Español" },
];

export const routes: IRoutes = {
  login: "/",
  register: "/register",
  forgotPassword: "/forgotPassword",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  logout: "/logout",
};

export const lateralNavbarItems: ILateralNavbar = {
  Home: {
    Dashboard: {
      link: routes.dashboard,
      image: dashboardImage.src,
    },
  },
  Preferences: {
    Settings: {
      link: routes.settings,
      image: settingsImage.src,
    },
  },
};
