import React, { useState } from "react";
import styles from "./IndicatorCheckboxGroup.module.css";
import { ChartTypeRegistry } from "chart.js/auto";

interface IndicatorsState {
  roi: boolean;
  hoursSaved: boolean;
  dollarsSaved: boolean;
  successRate: boolean;
}

interface IndicatorCheckboxGroupProps {
  languageValues: { indicators: { [key: string]: string } };
  secondLanguageValues: { charts: { [key: string]: string } };
  checkedIndicators: IndicatorsState;
  onToggleCheckbox: (indicator: keyof IndicatorsState) => void;
  visualizeMetrics: string;
  chartType: string;
}

const validChartTypes: Array<keyof ChartTypeRegistry> = [
  "line",
  "bar",
  "radar",
  "doughnut",
  "polarArea",
  "bubble",
  "pie",
  "scatter",
];

const IndicatorCheckboxGroup: React.FC<IndicatorCheckboxGroupProps> = ({
  languageValues,
  secondLanguageValues,
  checkedIndicators,
  onToggleCheckbox,
  visualizeMetrics,
  chartType,
}) => {
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
          <h2 className={styles.title}>{chartType}</h2>
        </div>
        {Object.entries(secondLanguageValues.charts).map(([key, value]) => (
          <div className={styles.selectContainer}>
            <div className={styles.labelContainerTwo}>
              <label className={styles.label} key={key}>
                {value}
              </label>
            </div>
            <div className={styles.selectContainerTwo}>
              <select className={styles.select}>
                {validChartTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndicatorCheckboxGroup;
