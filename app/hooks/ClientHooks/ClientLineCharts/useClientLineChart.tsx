import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

const useClientLineChart = (id: number, intervalTime: string) => {
  const [clientLineData, setClientLineData] = useState<any[]>([]);
  const [clientLineLabels, setClientLineLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiURL}/lineChartClient/`;
      const requestData = {
        id: id,
        timezone: "America/Mexico_City",
        intervaltime: intervalTime,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "token c8611ccb12550346b6c35a7b206fba75a43c20de",
      };

      try {
        const response: Response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData: { labelsSuccess: string[], dataSuccess: any[], dataFailed: any[] } = await response.json();
        const labels = jsonData.labelsSuccess; // Adjusted to use labelsSuccess
        const data = jsonData.dataSuccess.concat(jsonData.dataFailed);
        setClientLineLabels(labels);
        setClientLineData(data);
        
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, [id, intervalTime]);

  return { clientLineData, clientLineLabels };
};

export default useClientLineChart;
