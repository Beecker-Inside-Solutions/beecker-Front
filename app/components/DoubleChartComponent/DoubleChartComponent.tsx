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
  datasets: {
    data: number[];
    label: string;
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  labels: string[];
  chartType: keyof ChartTypeRegistry;
  graphTitle?: string;
  cName?: string;
}

const DoubleChartComponent: React.FC<ChartProps> = ({
  datasets,
  labels,
  chartType,
  graphTitle,
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
            datasets: datasets.map((dataset) => ({
              ...dataset,
              borderColor: dataset.borderColor || "rgba(75,192,192,1)",
              backgroundColor:
                dataset.backgroundColor || "rgba(75,192,192,0.2)",
              fill: dataset.fill !== undefined ? dataset.fill : false,
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
            })),
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: !!graphTitle,
                text: graphTitle,
              },
              legend: {
                display: datasets.length > 1,
              },
            },
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
  }, [datasets, labels, chartType, graphTitle]);

  return (
    <div className={`${styles.chartContainer} ${cName}`}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DoubleChartComponent;
