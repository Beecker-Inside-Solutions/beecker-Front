export interface ILateralNavbar {
  [key: string]: {
    [key: string]: {
      link: string;
      image?: string;
      adminRequired?: boolean;
    };
  };
}

export interface LateralProps {
  lateralNavbar: ILateralNavbar;
  logo?: string;
}
