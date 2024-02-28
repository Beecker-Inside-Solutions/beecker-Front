// Chart.tsx

import React, { useEffect, useRef } from "react";
import Chart, { ChartTypeRegistry } from "chart.js/auto";

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
  chartType: keyof ChartTypeRegistry; // Use the correct type
}

const ChartComponent: React.FC<ChartProps> = ({
  data,
  labels,
  graphTitle,
  isFilled,
  chartType,
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
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
              },
            ],
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
  }, [data, labels, graphTitle, chartType, isFilled]);

  return (
    <div>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;