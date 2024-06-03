import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

const dollarsRate = (idBots: number, timeframe: string) => {
  // State for success labels and data
  const [clientLineLabelsCosts, setClientLineLabelsSuccess] = useState<
    string[]
  >([]);
  const [clientLineDataCosts, setClientLineDataSuccess] = useState<number[]>(
    []
  );

  // State for failure labels and data
  const [clientLineLabelsRevenue, setClientLineLabelsFailed] = useState<
    string[]
  >([]);
  const [clientLineDataRevenue, setDataRevenue] = useState<number[]>(
    []
  );

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${apiURL}/costs/chart/${idBots}`, {
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
        console.log(data);

        // Check if data has necessary properties before setting state
        if (
          data &&
          data.labelsCosts &&
          data.dataCosts &&
          data.labelsRevenue &&
          data.dataRevenue
        ) {
          setClientLineLabelsSuccess(data.labelsCosts);
          setClientLineDataSuccess(data.dataCosts);
          setClientLineLabelsFailed(data.labelsRevenue);
          setDataRevenue(data.dataRevenue);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProject();
  }, [idBots, timeframe]); // Add all dependencies that can trigger re-fetching the data

  return {
    clientLineLabelsCosts,
    clientLineDataCosts,
    clientLineLabelsRevenue,
    clientLineDataRevenue,
  };
};

export default dollarsRate;
