import { useEffect, useState } from "react";
import { ChartData } from "../interfaces/IChartData";
const useLineChartData = (
  apiEndpoint: string,
  options: RequestInit = {}
): ChartData => {
  const [chartDataLine, setChartDataLine] = useState<any[]>([]);
  const [chartLinesLabels, setChartLinesLabels] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint, options);
        const data = await response.json();
        if (data.line_chart_client && data.line_chart_client.length > 0) {
          const lineChartData =
            data.line_chart_client[0].this_month.dataSuccess;
          const lineChartLabels =
            data.line_chart_client[0].this_month.labelsSuccess;
          setChartDataLine(lineChartData);
          setChartLinesLabels(lineChartLabels);
          console.log("Data fetched", data);
        } else {
          alert("No data found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  return { chartDataLine, chartLinesLabels };
};

export default useLineChartData;
