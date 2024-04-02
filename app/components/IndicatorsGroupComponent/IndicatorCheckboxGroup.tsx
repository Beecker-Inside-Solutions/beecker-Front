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
}

const IndicatorCheckboxGroup: React.FC<IndicatorCheckboxGroupProps> = ({
  languageValues,
}) => {
  const [activeIndicators, setActiveIndicators] = useState<IndicatorsState>({
    roi: false,
    hoursSaved: false,
    dollarsSaved: false,
    successRate: false,
  });

  const toggleCheckbox = (indicator: keyof IndicatorsState) => {
    setActiveIndicators((prevState) => ({
      ...prevState,
      [indicator]: !prevState[indicator],
    }));
  };

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
              checked={activeIndicators[key as keyof IndicatorsState]}
              onChange={() => toggleCheckbox(key as keyof IndicatorsState)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndicatorCheckboxGroup;
