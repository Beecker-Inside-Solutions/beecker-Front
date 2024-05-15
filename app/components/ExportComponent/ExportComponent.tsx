import React from "react";
import styles from "./ExportComponent.module.css";
import pdfImg from "../../images/icons/pdf.png";
import csvImg from "../../images/icons/excel.png";

interface ExportComponentProps {
  pdfText: string;
  csvText: string;
  handlePdfExport: () => void;
  handleCsvExport: () => void;
}

const ExportComponent: React.FC<ExportComponentProps> = ({
  pdfText,
  csvText,
    handlePdfExport,
    handleCsvExport,
}) => {
  return (
    <div className={styles.exportComponent}>
      <div className={styles.leftContainer}>
        <button className={styles.pdfButton}
        onClick={handlePdfExport}
        >
          <div className={styles.imgContainer}>
            <img src={pdfImg.src} alt={pdfText} />
          </div>
          <p className={styles.buttonText}>{pdfText}</p>
        </button>
      </div>
      <div className={styles.rightContainer}>
        <button className={styles.csvButton}
        onClick={handleCsvExport}
        >
          <div className={styles.imgContainer}>
            <img src={csvImg.src} alt={csvText} />
          </div>
          <p className={styles.buttonText}>{csvText}</p>
        </button>
      </div>
    </div>
  );
};

export default ExportComponent;
