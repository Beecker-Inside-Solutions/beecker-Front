"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../hooks/useMultilingualValues";
import { apiURL, graphColors } from "@/Constants";
import logo from "../../app/images/logos/logo.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import SearchPages from "../components/SearchPages/SearchPages";
import ChartComponent from "../components/ChartComponent/ChartComponent";
import Footer from "../components/Footer/Footer";
import AuthRoute from "../components/AuthComponent/AuthComponent";
import downArrow from "@/app/images/icons/closeArrow.png";
import upArrow from "@/app/images/icons/openArrow.png";
import useClientLineChart from "../hooks/ClientHooks/ClientLineCharts/useClientLineChart";
import clientBarChart from "../hooks/ClientHooks/ClientBarChart/useClientBarChart";
import useFetchTransactionsData from "../hooks/Transactions/useFetchTransactionsData";
import useBotBarChartData from "../hooks/BotCharts/useBotBarChartData";
import IndicatorComponent from "../components/IndicatorComponent/IndicatorComponent";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  /*
    Charts displays:
  */
  const [ClientCharts, setClientCharts] = useState(true);

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

  /*
    Graph Hooks:
  */

  // ClientCharts Hooks
  const { clientLineData, clientLineLabels } = useClientLineChart(
    14,
    "monthly"
  );
  const { clientBarData, clientBarLabels } = clientBarChart(14, 90);

  /*
    Functions:
  */
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * graphColors.length);
    return graphColors[randomIndex].hexCode;
  };

  /*
    Dropdowns:
  */

  const toggleDropdownClientCharts = () => {
    setClientCharts((prevState) => !prevState);
  };

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
            <h1 className={styles.title}>
              <p>{languageValues.dashboard.welcome} </p>, {userName}
            </h1>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.topGraphsContainer}>
              <div
                className={styles.titleContainer}
                onClick={toggleDropdownClientCharts}
              >
                <p className={styles.bottomTitle}>
                  {languageValues.dashboard.clientCharts}
                </p>
                {ClientCharts ? (
                  <img src={downArrow.src} alt="arrow-up" />
                ) : (
                  <img src={upArrow.src} alt="arrow-down" />
                )}
              </div>
              {ClientCharts && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.graphsContainer}>
                    <div className={styles.graphLeftContainer}>
                      <ChartComponent
                        chartType="bar"
                        data={clientBarData}
                        labels={clientBarLabels}
                        graphTitle={languageValues.dashboard.botBarTitle}
                        borderColor={getRandomColor()}
                      />
                    </div>
                    <div className={styles.graphCenterContainer}>
                      <ChartComponent
                        chartType="line"
                        data={clientLineData}
                        labels={clientLineLabels}
                        graphTitle={languageValues.dashboard.botBarTitle}
                        borderColor={getRandomColor()}
                      />
                    </div>
                    <div className={styles.graphRightContainer}></div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.bottomGraphsContainer}>
              <div className={styles.indicatorContainer}>
                <IndicatorComponent
                  title={languageValues.indicators.roi}
                  value={263858}
                  status={true}
                  profitActivator={true}
                  profit={100}
                  languageValues={languageValues}
                  type="money"
                />
              </div>
              <div className={styles.indicatorContainer}>
                <IndicatorComponent
                  title={languageValues.indicators.hoursSaved}
                  value={1456}
                  status={true}
                  profitActivator={false}
                  profit={-10}
                  languageValues={languageValues}
                  type=""
                />
              </div>
              <div className={styles.indicatorContainer}>
                <IndicatorComponent
                  title={languageValues.indicators.dollarsSaved}
                  value={-1000}
                  status={true}
                  profitActivator={true}
                  profit={-2}
                  languageValues={languageValues}
                  type="money"
                />
              </div>
              <div className={styles.indicatorContainer}>
                <IndicatorComponent
                  title={languageValues.indicators.successRate}
                  value={0.5}
                  status={true}
                  profitActivator={false}
                  profit={0}
                  languageValues={languageValues}
                  type="percentage"
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
