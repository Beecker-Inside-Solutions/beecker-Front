import { ILanguage } from "./app/interfaces/ILanguages";
import { IRoutes } from "./app/interfaces/IRoutes";
import { ILateralNavbar } from "./app/interfaces/ILateralNavbar";
import { IRegex } from "./app/interfaces/IRegex";
import dashboardImage from "@/app/images/icons/dashboard.png";
import settingsImage from "@/app/images/icons/settings.png";
import mexicoIcon from "@/app/images/icons/mexico.png";
import ukIcon from "@/app/images/icons/uk.png";
import profileIcon from "@/app/images/icons/profile.png";
import { IDefaultColors } from "./app/interfaces/IDefaultColors";

export const apiURL = "https://dev.api.dashboard.beecker.ai/api";

export const languages: ILanguage[] = [
  { value: "en", icon: ukIcon.src, label: "🇬🇧 English" },
  { value: "es", icon: mexicoIcon.src, label: "🇲🇽 Español" },
];

export const routes: IRoutes = {
  login: "/",
  register: "/register",
  forgotPassword: "/forgotPassword",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
};

export const lateralNavbarItems: ILateralNavbar = {
  Home: {
    Dashboard: {
      link: routes.dashboard,
      image: dashboardImage.src,
      adminRequired: false,
    },
  },

  Profile: {
    Profile: {
      link: routes.profile,
      image: profileIcon.src,
      adminRequired: false,
    },
  },

  Preferences: {
    Settings: {
      link: routes.settings,
      image: settingsImage.src,
      adminRequired: false,
    },
  },
};
export const regex: IRegex = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  password: new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})`
  ),
};


export const graphColors : IDefaultColors[] = [
  { colorName: "rojo", hexCode: "#e74949" },
  { colorName: "azul", hexCode: "#803fe0" },
  { colorName: "morado", hexCode: "#6200d1" },
  { colorName: "verde", hexCode: "#00ff00" },
  { colorName: "naranja", hexCode: "#ff6600" },
  { colorName: "rosa", hexCode: "#ff00ff" },
  { colorName: "cafe", hexCode: "#663300" },
  { colorName: "verde-oscuro", hexCode: "#006600" },
  { colorName: "azul-oscuro", hexCode: "#0000ff" },
];