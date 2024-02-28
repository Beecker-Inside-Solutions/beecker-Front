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

import useFetchTransactionsData from "../hooks/useFetchTransactionsData";
import useBotBarChartData from "../hooks/useBotBarChartData";
export default function Home() {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  /*
    Charts displays:
  */
  const [BotCharts, setBotCharts] = useState(true);
  const [EnvironmentCharts, setEnvironmentCharts] = useState(true);
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

  // Bot Hooks
  const { transactions, transactionsLabels } = useFetchTransactionsData();
  const { botBarData, botBarLabels } = useBotBarChartData();

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
  const toggleDropdownBotCharts = () => {
    setBotCharts((prevState) => !prevState);
  };

  const toggleDropdownEnvironmentCharts = () => {
    setEnvironmentCharts((prevState) => !prevState);
  };

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
            <h1
              className={styles.title}
            >{`${languageValues.dashboard.welcome}, ${userName}`}</h1>
          </div>
          <div className={styles.bottomContainer}>
            {/* TopCharts */}

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
                  <div className={styles.botGraphsContainer}>
                    <div className={styles.graphLeftContainer}></div>
                    <div className={styles.graphCenterContainer}></div>
                    <div className={styles.graphRightContainer}></div>
                  </div>
                </div>
              )}
            </div>
            {/* MediumCharts */}
            <div className={styles.bottomGraphsContainer}>
              <div
                className={styles.titleContainer}
                onClick={toggleDropdownEnvironmentCharts}
              >
                <p className={styles.bottomTitle}>
                  {languageValues.dashboard.environmentCharts}
                </p>
                {EnvironmentCharts ? (
                  <img src={downArrow.src} alt="arrow-up" />
                ) : (
                  <img src={upArrow.src} alt="arrow-down" />
                )}
              </div>
              {EnvironmentCharts && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.botGraphsContainer}>
                    <div className={styles.graphLeftContainer}></div>
                    <div className={styles.graphCenterContainer}></div>
                    <div className={styles.graphRightContainer}></div>
                  </div>
                </div>
              )}
            </div>
            {/* BottomCharts */}
            <div className={styles.bottomGraphsContainer}>
              <div
                className={styles.titleContainer}
                onClick={toggleDropdownBotCharts}
              >
                <p className={styles.bottomTitle}>
                  {languageValues.dashboard.botCharts}
                </p>
                {BotCharts ? (
                  <img src={downArrow.src} alt="arrow-up" />
                ) : (
                  <img src={upArrow.src} alt="arrow-down" />
                )}
              </div>
              {BotCharts && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.botGraphsContainer}>
                    <div className={styles.graphLeftContainer}>
                      <ChartComponent
                        chartType="line"
                        data={transactions}
                        labels={transactionsLabels}
                        graphTitle={languageValues.dashboard.transactionsTitle}
                        borderColor={getRandomColor()}
                      />
                    </div>
                    <div className={styles.graphCenterContainer}></div>
                    <div className={styles.graphRightContainer}>
                      <ChartComponent
                        chartType="bar"
                        data={botBarData}
                        labels={botBarLabels}
                        graphTitle={languageValues.dashboard.botBarTitle}
                        borderColor={getRandomColor()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
