import { useState, useEffect } from "react";
import { LineChartData } from "../interfaces/ILineChartData";

const useLineChartData = (
  apiEndpoint: string,
  options: RequestInit = {}
): LineChartData => {
  const [chartDataLine, setChartDataLine] = useState<number[]>([]);
  const [chartLinesLabels, setChartLinesLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, options);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();

        if (jsonData.message === "SUCCESS") {
          const successData = jsonData.dataSuccess;
          const failedData = jsonData.dataFailed;
          const arrayOFData = successData.concat(failedData);
          const arrayOfLabels = jsonData.labelsSuccess.concat(
            jsonData.labelsFailed
          );
          setChartDataLine(arrayOFData);
          setChartLinesLabels(arrayOfLabels);
        } else {
          console.error("Failed to fetch data: ", jsonData.message);
        }
      } catch (error) {
        console.error("Error fetching line chart data:", error);
      }
    };

    fetchData();
  }, []);

  return { chartDataLine, chartLinesLabels };
};

export default useLineChartData;
