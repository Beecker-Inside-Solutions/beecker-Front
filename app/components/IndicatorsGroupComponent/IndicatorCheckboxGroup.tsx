import React from "react";
import styles from "./IndicatorCheckboxGroup.module.css";
import { ChartTypeRegistry } from "chart.js/auto";
import { Charts } from "@/app/interfaces/ICharts";

interface IndicatorsState {
  roi: boolean;
  hoursSaved: boolean;
  dollarsSaved: boolean;
  successRate: boolean;
}

interface IndicatorCheckboxGroupProps {
  languageValues: { indicators: { [key: string]: string } };
  secondLanguageValues: { charts: Charts };
  checkedIndicators: IndicatorsState;
  onToggleCheckbox: (indicator: keyof IndicatorsState) => void;
  visualizeMetrics: string;
  chartTitle: string;
  onChartTypeChange: (
    type: keyof ChartTypeRegistry,
    chartId: keyof Charts
  ) => void;
}

const validChartTypes: Array<keyof ChartTypeRegistry> = [
  "bar",
  "line",
  "pie",
  "doughnut",
  "polarArea",
  "radar",
];

const IndicatorCheckboxGroup: React.FC<IndicatorCheckboxGroupProps> = ({
  languageValues,
  secondLanguageValues,
  checkedIndicators,
  onToggleCheckbox,
  visualizeMetrics,
  chartTitle,
  onChartTypeChange,
}) => {
  const handleChartTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    chartId: keyof Charts
  ) => {
    const selectedType = event.target.value as keyof ChartTypeRegistry;
    onChartTypeChange(selectedType, chartId);
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.leftContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{visualizeMetrics}</h2>
        </div>
        {Object.entries(languageValues.indicators).map(([key, value]) => (
          <div className={styles.itemContainer} key={key}>
            <div className={styles.labelContainer}>
              <label>{value}</label>
            </div>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                className={styles.checkbox}
                id="checkbox"
                checked={checkedIndicators[key as keyof IndicatorsState]}
                onChange={() => onToggleCheckbox(key as keyof IndicatorsState)}
              />
              <span className={styles.check}></span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{chartTitle}</h2>
        </div>
        {Object.entries(secondLanguageValues.charts).map(
          ([chartId, chartType]) => (
            <div className={styles.selectContainer} key={chartId}>
              <p className={styles.chartTitle}></p>
              <select
                className={styles.select}
                value={chartType}
                onChange={(e) =>
                  handleChartTypeChange(e, chartId as keyof Charts)
                }
              >
                {validChartTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default IndicatorCheckboxGroup;
