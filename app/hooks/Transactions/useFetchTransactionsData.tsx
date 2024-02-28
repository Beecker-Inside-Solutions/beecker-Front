import { useState, useEffect } from 'react';
import { apiURL } from '@/Constants';

const useFetchTransactionsData = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionsLabels, setTransactionsLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${apiURL}/transactionsChart/`;
      const body = {
        id: 91,
        timezone: "America/Mexico_City",
        interval_time: "this_month",
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "token c8611ccb12550346b6c35a7b206fba75a43c20de",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const jsonData = await response.json();
        const labels = jsonData.labels_success.concat(jsonData.labels_failed);
        const data = jsonData.data_success.concat(jsonData.data_failed);
        setTransactionsLabels(labels);
        setTransactions(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchData();
  }, []);

  return { transactions, transactionsLabels };
};

export default useFetchTransactionsData;
