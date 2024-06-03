import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

interface ChartData {
  dataDollars: number[];
  labelsDollars: string[];
}

const dollarsRate = (idBots: number, timeframe: string): ChartData => {
  // Explicitly define the initial state with correct types
  const [chartData, setChartData] = useState<ChartData>({
    dataDollars: [],
    labelsDollars: [],
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${apiURL}/costs/calculate/${idBots}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ timeframe }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        let avgCost = 0;
        let avgRevenue = 0;

        // Calculate total average cost and revenue from the result
        result.forEach((item: any) => {
          avgCost += item.avgCost;
          avgRevenue += item.avgRevenue;
        });

        // Set chart data
        setChartData({
          dataDollars: [avgCost, avgRevenue],
          labelsDollars: ["Average Cost", "Average Revenue"],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProject();
  }, [idBots, timeframe]);

  return chartData;
};

export default dollarsRate;
