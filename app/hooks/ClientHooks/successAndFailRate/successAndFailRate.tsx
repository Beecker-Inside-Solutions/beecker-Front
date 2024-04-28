import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

interface ChartData {
  dataSF: number[];
  labelsSF: string[];
}

const useSuccessAndFailRate = (
  idBots: number,
  timeframe: string
): ChartData => {
  // Explicitly define the initial state with correct types
  const [chartData, setChartData] = useState<ChartData>({
    dataSF: [],
    labelsSF: [],
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(
          `${apiURL}/bot/executionsRate/${idBots}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ timeframe }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        let success = 0;
        let failure = 0;

        result.data.forEach((item: any) => {
          success += parseInt(item.successCount, 10);
          failure += parseInt(item.failureCount, 10);
        });

        // Use TypeScript's tuple type for setChartData to ensure type safety
        setChartData({
          dataSF: [success, failure],
          labelsSF: ["Success", "Failure"],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProject();
  }, [idBots, timeframe]);

  return chartData;
};

export default useSuccessAndFailRate;
