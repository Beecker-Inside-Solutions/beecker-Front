import React from "react";
import styles from "./TableComponent.module.css";
import { exec } from "child_process";

interface DataProps {
  labels: string[];
  successData: number[];
  failureData: number[];
  excutionDate: string;
  successCount: string;
  failureCount: string;
}

const TableComponent: React.FC<DataProps> = ({
  labels,
  successData,
  failureData,
  excutionDate,
  successCount,
  failureCount,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            {excutionDate}
          </th>
          <th>
            {successCount}
          </th>
          <th>
            {failureCount}
          </th>
        </tr>
      </thead>
      <tbody>
        {labels.map((label, index) => (
          <tr key={index}>
            <td>{label}</td>
            <td>{successData[index]}</td>
            <td>{failureData[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
