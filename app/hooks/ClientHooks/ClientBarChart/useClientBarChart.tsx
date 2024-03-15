import { useState, useEffect } from "react";
import { apiURL } from "@/Constants";

const clientBarChart = (id: number, intervalTime: number) => {
  const [clientBarData, setclientBarData] = useState<any[]>([]);
  const [clientBarLabels, setclientBarLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiURL}/lineChartClient/`;
      const requestData = {
        id: id,
        timezone: "America/Mexico_City",
        days: intervalTime,
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

        const jsonData: { labels: string[], dataSuccess: any[], dataFailed: any[] } = await response.json();
        console.log("jsonData", jsonData);
        const labels = jsonData.labels;
        const data = jsonData.dataSuccess.concat(jsonData.dataFailed);
        console.log("labels", labels);
        console.log("data", data);
        setclientBarLabels(labels);
        setclientBarData(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, [id, intervalTime]);

  return { clientBarData, clientBarLabels };
};

export default clientBarChart;
