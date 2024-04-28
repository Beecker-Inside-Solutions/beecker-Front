import React, { useEffect, useRef } from "react";
import Chart, { ChartTypeRegistry } from "chart.js/auto";
import styles from "./ChartComponent.module.css";

// Define valid chart types
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
  chartType: keyof ChartTypeRegistry;
  borderColor?: string | string[];
  fillColor?: string | string[];
  cName?: string; // Add cName prop for the classname
}

const ChartComponent: React.FC<ChartProps> = ({
  data,
  labels,
  graphTitle,
  isFilled,
  chartType,
  borderColor = "rgba(75,192,192,1)",
  fillColor, // Receive fill color prop
  cName,
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
                borderColor: borderColor,
                backgroundColor: fillColor, // Set fill color
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
              },
            ],
          },
          options: {
            responsive: true, // Make the chart responsive
            maintainAspectRatio: false, // Don't maintain aspect ratio
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, graphTitle, chartType, isFilled, borderColor, fillColor]);

  return (
    <div className={`${styles.chartContainer} ${cName}`}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;
