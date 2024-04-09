import React, { useState } from "react";
import styles from "./IndicatorCheckboxGroup.module.css";

interface IndicatorsState {
  roi: boolean;
  hoursSaved: boolean;
  dollarsSaved: boolean;
  successRate: boolean;
}

interface IndicatorCheckboxGroupProps {
  languageValues: { indicators: { [key: string]: string } };
  checkedIndicators: IndicatorsState;
  onToggleCheckbox: (indicator: keyof IndicatorsState) => void;
}

const IndicatorCheckboxGroup: React.FC<IndicatorCheckboxGroupProps> = ({
  languageValues,
  checkedIndicators,
  onToggleCheckbox,
}) => {
  return (
    <div className={styles.modalContent}>
      {Object.entries(languageValues.indicators).map(([key, value]) => (
        <div className={styles.itemContainer} key={key}>
          <div className={styles.labelContainer}>
            <label>{value}</label>
          </div>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={checkedIndicators[key as keyof IndicatorsState]}
              onChange={() => onToggleCheckbox(key as keyof IndicatorsState)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndicatorCheckboxGroup;
