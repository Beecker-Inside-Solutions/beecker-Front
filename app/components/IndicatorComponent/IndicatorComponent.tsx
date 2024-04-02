import React, { useState } from "react";
import { IIndicators } from "@/app/interfaces/IIndicators";
import styles from "./IndicatorComponent.module.css";
import openArrow from "../../images/icons/openArrow.png";
import closeArrow from "../../images/icons/closeArrow.png";

const IndicatorComponent: React.FC<IIndicators> = ({
  title,
  value,
  status: initialStatus,
  profitActivator,
  profit,
  languageValues,
  type,
}) => {
  const [status, setStatus] = useState(initialStatus);

  let typeSymbol = "";

  switch (type) {
    case "percentage":
      typeSymbol = "%";
      break;
    case "money":
      typeSymbol = "$";
      break;
    case "custom":
      typeSymbol = "Custom Symbol";
      break;
    default:
      typeSymbol = "";
  }

  const toggleDropDown = () => {
    setStatus(!status);
  };

  const renderProfitLoss = () => {
    if (profit > 0) {
      return `+ ${profit}`;
    } else if (profit < 0) {
      return `- ${Math.abs(profit)}`;
    } else {
      return "0";
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return value.toString();
    }
  };

  return (
    <div className={styles.indicatorContainer}>
      <div className={styles.indicatorHeader} onClick={toggleDropDown}>
        <div className={styles.indicatorTitle}>
          <p>{title}</p>
        </div>
        <div className={styles.indicatorArrow}>
          {status ? (
            <img src={openArrow.src} alt="Open Arrow" />
          ) : (
            <img src={closeArrow.src} alt="Close Arrow" />
          )}
        </div>
      </div>
      {status ? (
        <div className={styles.indicatorBody}>
          <p className={styles.indicatorValue}>
            {typeSymbol === "$" && typeSymbol}
            {formatValue(value)}
            {typeSymbol !== "$" && typeSymbol}
          </p>
          <div className={styles.indicatorValuesContainer}>
            <div className={styles.profitContainer}>
              <p className={profit > 0 ? styles.profit : styles.profitLoss}>
                {renderProfitLoss()}%{" "}
              </p>{" "}
              {languageValues.dashboard.lastCut}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IndicatorComponent;
