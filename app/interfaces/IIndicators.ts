import { Values } from "./IValues";

export interface IIndicators {
  title: string;
  value?: number;
  status: boolean;
  profitActivator: boolean;
  profit: number;
  languageValues: Values;
  type: string;
}
