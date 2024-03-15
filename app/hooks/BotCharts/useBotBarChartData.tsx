import { useState, useEffect } from 'react';
import { apiURL } from '@/Constants';

const useBotBarChartData = () => {
  const [botBarData, setBotBarData] = useState([]);
  const [botBarLabels, setBotBarLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiURL}/barChartBot/`;
      const data = {
        id: 91,
        timezone: "America/Mexico_City",
        days: 10,
      };
      const headers = {
        "Content-Type": "application/json",
        Authorization: "token c8611ccb12550346b6c35a7b206fba75a43c20de",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        setBotBarLabels(responseData.labels);
        const concatOfSuccessAndFailed = responseData.dataSuccess.concat(
          responseData.dataFailed
        );
        setBotBarData(concatOfSuccessAndFailed);
        
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
;
    fetchData();
  }, []);

  return { botBarData, botBarLabels };
};

export default useBotBarChartData;
