import { ChartTypeRegistry } from "chart.js/auto";

export interface Charts {
  [key: string]: keyof ChartTypeRegistry;
}
