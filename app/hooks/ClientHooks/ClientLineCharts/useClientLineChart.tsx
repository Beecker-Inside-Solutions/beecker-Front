import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

const useClientLineChart = (idBots: number, timeframe: string) => {
  // State for success labels and data
  const [clientLineLabelsSuccess, setClientLineLabelsSuccess] = useState<
    string[]
  >([]);
  const [clientLineDataSuccess, setClientLineDataSuccess] = useState<number[]>(
    []
  );

  // State for failure labels and data
  const [clientLineLabelsFailed, setClientLineLabelsFailed] = useState<
    string[]
  >([]);
  const [clientLineDataFailed, setClientLineDataFailed] = useState<number[]>(
    []
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${apiURL}/bots/executions/${idBots}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            timeframe: timeframe,
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();

        // Check if data has necessary properties before setting state
        if (
          data &&
          data.labelsSuccess &&
          data.dataSuccess &&
          data.labelsFailed &&
          data.dataFailed
        ) {
          setClientLineLabelsSuccess(data.labelsSuccess);
          setClientLineDataSuccess(data.dataSuccess);
          setClientLineLabelsFailed(data.labelsFailed);
          setClientLineDataFailed(data.dataFailed);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProject();
  }, [idBots, timeframe]); // Add all dependencies that can trigger re-fetching the data

  return {
    clientLineLabelsSuccess,
    clientLineDataSuccess,
    clientLineLabelsFailed,
    clientLineDataFailed,
  };
};

export default useClientLineChart;
