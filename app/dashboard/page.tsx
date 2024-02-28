"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../hooks/useMultilingualValues";
import { apiURL, routes } from "@/Constants";
import logo from "../../app/images/logos/logo.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import SearchPages from "../components/SearchPages/SearchPages";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import Footer from "../components/Footer/Footer";
import AuthRoute from "../components/AuthComponent/AuthComponent";
import useLineChartData from "../hooks/useLineChartData";
import useBarChartData from "../hooks/useBarChartData";
import usePieChartData from "../hooks/usePieChartData";
export default function Home() {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);
  }, []);

  const lineChartOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "token c8611ccb12550346b6c35a7b206fba75a43c20de",
    },
  };

  const { chartDataLine, chartLinesLabels } = useLineChartData(
    `${apiURL}/lineChartProjects/`,
    {
      ...lineChartOptions,
      body: JSON.stringify({
        id: 73,
        timezone: "America/Mexico_City",
        intervaltime: "yearly",
      }),
    }
  );

  const { barChartDataLine, barChartLinesLabels } = useBarChartData(
    `${apiURL}/barChartClient/`,
    {
      ...lineChartOptions,
      body: JSON.stringify({
        id: 14,
        timezone: "America/Mexico_City",
        days: 90,
      }),
    }
  );

  const { PieChartData, PieChartLines } = usePieChartData(
    `${apiURL}/pieChartClient/`,
    {
      ...lineChartOptions,
      body: JSON.stringify({
        id: 14,
      }),
    }
  );

  console.log("PieChartData", PieChartData);
  console.log("PieChartLines", PieChartLines);

  return (
    <>
      <LateralNavbar
        lateralNavbar={require("@/Constants").lateralNavbarItems}
        logo={logo.src}
        user={{ isAdmin: false }}
      />
      <RightBar
        profileName={userName}
        profileImageUrl={profileImg}
        logoutHeader={languageValues.rightBar.logoutHeader}
        logoutText={languageValues.rightBar.logoutText}
        logoutButton={languageValues.rightBar.logoutButton}
        profileButton={languageValues.rightBar.profileButton}
      />
      <SearchPages
        searchablePages={require("@/Constants").lateralNavbarItems}
        isAdmin={false}
      />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.topContainer}>
            <h1>{`${languageValues.dashboard.welcome}, ${userName}`}</h1>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.topGraphsContainer}>
              <div className={styles.graphLeftContainer}>
                <ChartComponent
                  data={chartDataLine}
                  labels={chartLinesLabels}
                  chartType="line"
                  graphTitle="Line Chart"
                  isFilled={false}
                  borderColor={["#6200d1"]}
                />
              </div>
              <div className={styles.graphCenterContainer}>
                <ChartComponent
                  data={chartDataLine}
                  labels={chartLinesLabels}
                  chartType="line"
                  graphTitle="Line Chart"
                  isFilled={false}
                  borderColor={["#6200d1"]}
                />
              </div>
              <div className={styles.graphRightContainer}>
                <ChartComponent
                  data={barChartDataLine}
                  labels={barChartLinesLabels}
                  chartType="bar"
                  graphTitle="Bar Chart"
                  isFilled={true}
                  borderColor={["#6200d1"]}
                />
              </div>
            </div>
            <div className={styles.bottomGraphsContainer}>
              <div className={styles.graphLeftContainer}>
                <ChartComponent
                  data={chartDataLine}
                  labels={chartLinesLabels}
                  chartType="line"
                  graphTitle="Line Chart"
                  isFilled={false}
                  borderColor={["#6200d1"]}
                />
              </div>
              <div className={styles.graphCenterContainer}>
                <ChartComponent
                  data={PieChartData}
                  labels={PieChartLines}
                  chartType="pie"
                  graphTitle="Line Chart"
                  isFilled={false}
                  cName={styles.pieChart}
                  borderColor={["#6200d1"]}
                />
              </div>
              <div className={styles.graphRightContainer}>
                <ChartComponent
                  data={barChartDataLine}
                  labels={barChartLinesLabels}
                  chartType="bar"
                  graphTitle="Bar Chart"
                  isFilled={true}
                  borderColor={["#6200d1"]}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
