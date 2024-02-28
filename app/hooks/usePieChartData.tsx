import { useEffect, useState } from "react";
import { PieChartData } from "../interfaces/IPieChartData";

const usePieChartData = (
  apiEndpoint: string,
  options: RequestInit = {}
): PieChartData => {
  const [PieChartData, setChartDataLine] = useState<number[]>([]);
  const [PieChartLines, setChartLinesLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, options);
        const data = await response.json();
        if (data.message === "SUCCESS") {
          // Ensure that labels and data are defined
          if (data.labels && data.data) {
            const labels = data.labels;
            const dataInfo = data.data;
            setChartDataLine(dataInfo);
            setChartLinesLabels(labels);

          } else {
            console.error("Labels or data not found in API response");
          }
        } else {
          console.error("API request failed:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint, JSON.stringify(options)]);

  return { PieChartData, PieChartLines };
};

export default usePieChartData;
