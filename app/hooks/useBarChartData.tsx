import { useEffect, useState } from "react";
import { BarChartData } from "../interfaces/IBarChartData";

const useBarChartData = (
  apiEndpoint: string,
  options: RequestInit = {}
): BarChartData => {
  const [barChartDataLine, setChartDataLine] = useState<number[]>([]);
  const [barChartLinesLabels, setChartLinesLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, options);
        const data = await response.json();
        if (data.message === "SUCCESS") {
          setChartDataLine(data.dataSuccess);
          setChartLinesLabels(data.labels);
        } else {
          alert("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint, JSON.stringify(options)]); // Include options in the dependency array

  return { barChartDataLine, barChartLinesLabels };
};

export default useBarChartData;
