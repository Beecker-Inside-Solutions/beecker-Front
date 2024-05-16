import { ILanguage } from "./app/interfaces/ILanguages";
import { IRoutes } from "./app/interfaces/IRoutes";
import { ILateralNavbar } from "./app/interfaces/ILateralNavbar";
import { IRegex } from "./app/interfaces/IRegex";
import dashboardImage from "./app/images/icons/dashboard.png";
import settingsImage from "./app/images/icons/settings.png";
import mexicoIcon from "./app/images/icons/mexico.png";
import projectsImage from "./app/images/icons/projectsImage.png";
import userList from "./app/images/icons/userList.png";
import ukIcon from "./app/images/icons/uk.png";
import serviceDesk from "./app/images/icons/serviceDesk.png";
import { IDefaultColors } from "./app/interfaces/IDefaultColors";

// export const apiURL = "https://dev.api.dashboard.beecker.ai/api";
export const apiURL = "http://localhost:3001";
export const languages: ILanguage[] = [
  { value: "en", icon: ukIcon.src, label: "🇬🇧 English" },
  { value: "es", icon: mexicoIcon.src, label: "🇲🇽 Español" },
];

export const routes: IRoutes = {
  login: "/",
  register: "/register",
  forgotPassword: "/forgotPassword",
  profile: "/profile",
  settings: "/settings",
  serviceDesk: "/serviceDesk",
  userList: "/userList",
  dashboard: "/dashboard",
  projects: "/projects",
};

export const lateralNavbarItems: ILateralNavbar = {
  Home: {
    Projects: {
      link: routes.projects,
      image: projectsImage.src,
      adminRequired: false,
    },
  },

  Planning: {
    SDesk: {
      link: routes.serviceDesk,
      image: serviceDesk.src,
      adminRequired: false,
    },
  },

  Administration: {
    ["User List"]: {
      link: routes.userList,
      image: userList.src,
      adminRequired: true,
    },
  },
};
export const regex: IRegex = {
  name: /^[a-zA-Z]+$/,
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  password: new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})`
  ),
};

export const graphColors: IDefaultColors[] = [
  { colorName: "rojo", hexCode: "#e74949" },
  { colorName: "azul", hexCode: "#803fe0" },
  { colorName: "morado", hexCode: "#6200d1" },
  { colorName: "azul-oscuro", hexCode: "#0000ff" },
];

export const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Closed", label: "Closed" },
];
