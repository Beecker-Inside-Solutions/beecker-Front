import { useEffect, useState } from "react";
import { DoughnotChartData } from "../interfaces/IDoughnotChartData";
const useDoughnotChartData = (
  apiEndpoint: string,
  options: RequestInit = {}
): DoughnotChartData => {
  const [doughnotChartDataLine, setChartDataLine] = useState<number[]>([]);
  const [doughnotChartLinesLabels, setChartLinesLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, options);
        const responseData = await response.json();
        if (responseData.message === "SUCCESS") {
          // Ensure that data is defined
          if (responseData.data) {
            const chartDataLine = responseData.data.map((item: any) => item.value);
            const chartLinesLabels = responseData.data.map((item: any) => item.name);
            setChartDataLine(chartDataLine);
            setChartLinesLabels(chartLinesLabels);
          } else {
            console.error("Data not found in API response");
          }
        } else {
          console.error("API request failed:", responseData.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    

    fetchData();
  }, [apiEndpoint, JSON.stringify(options)]);

  return { doughnotChartDataLine, doughnotChartLinesLabels };
};

export default useDoughnotChartData;
