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
          // Ensure that labels, dataSuccess, and dataFailed are defined
          if (data.labels && data.dataSuccess && data.dataFailed) {
            const labels = data.labels;
            const dataSuccess = data.dataSuccess;
            const dataFailed = data.dataFailed;
            const arrayOfData = [dataSuccess, dataFailed];
            setChartDataLine(arrayOfData);
            setChartLinesLabels(labels);
            console.log("labels", labels);
            console.log("arrayOfData", arrayOfData);
          } else {
            console.error("Labels or data not found in API response");
            // Handle the case when labels or data are missing
          }
        } else {
          alert("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiEndpoint, JSON.stringify(options)]);

  return { barChartDataLine, barChartLinesLabels };
};

export default useBarChartData;
