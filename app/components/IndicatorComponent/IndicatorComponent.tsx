import React, { useState } from "react";
import { IIndicators } from "@/app/interfaces/IIndicators";
import styles from "./IndicatorComponent.module.css";

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
      <div className={styles.indicatorBody}>
        <div className={styles.indicatorHeader}>
          <p>{title}</p>
        </div>
        <p className={styles.indicatorValue}>
          {typeSymbol === "$" && typeSymbol}
          {formatValue(value ? value : 0)}
          {typeSymbol !== "$" && typeSymbol}
        </p>
        <div className={styles.profitContainer}>
          <p className={profit > 0 ? styles.profit : styles.profitLoss}>
            {renderProfitLoss()}%{" "}
          </p>{" "}
          <p className={styles.since}> {languageValues.dashboard.lastCut}</p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorComponent;
