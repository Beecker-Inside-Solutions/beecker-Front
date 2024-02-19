export interface ILateralNavbar {
  [key: string]: {
    [key: string]: {
      link: string;
      image?: string;
    };
  };
}

export interface LateralProps {
  lateralNavbar: ILateralNavbar;
  logo?: string;
}
