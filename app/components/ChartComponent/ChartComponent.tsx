// Chart.tsx

import React, { useEffect, useRef } from "react";
import Chart, { ChartTypeRegistry } from "chart.js/auto";
import styles from "./ChartComponent.module.css";

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

interface ChartProps {
  data: number[];
  labels: string[];
  graphTitle?: string;
  isFilled?: boolean;
  chartType: keyof ChartTypeRegistry; // Use the correct type
  colors?: string[]; // Add colors property
}

const ChartComponent: React.FC<ChartProps> = ({
  data,
  labels,
  graphTitle,
  isFilled,
  chartType,
  colors = [],
}) => {
  if (!validChartTypes.includes(chartType)) {
    throw new Error(`Invalid chart type: ${chartType}`);
  }

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: {
            labels,
            datasets: [
              {
                label: graphTitle,
                data,
                fill: isFilled ? true : false,
                borderColor: colors[0] || "rgba(75,192,192,1)", // Use provided color or default
                backgroundColor: colors[0] || "rgba(75,192,192,0.2)", // Use provided color or default
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
              },
            ],
          },
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, graphTitle, chartType, isFilled, colors]);

  return (
    <div
    className={styles.chartContainer}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
