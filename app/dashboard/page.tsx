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
import useLineChartData from "../hooks/useLineChartData";
import useBarChartData from "../hooks/useBarChartData";
import usePieChartData from "../hooks/usePieChartData";
import useDoughnotChartData from "../hooks/useDoughnotChartData";
import useFetchTransactionsData from "../hooks/useFetchTransactionsData";

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

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * graphColors.length);
    return graphColors[randomIndex].hexCode;
  };

  const { transactions, transactionsLabels } = useFetchTransactionsData();

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
            <div className={styles.topGraphsContainer}>
              <div className={styles.graphLeftContainer}>

              </div>
              <div className={styles.graphCenterContainer}></div>
              <div className={styles.graphRightContainer}></div>
            </div>
            <div className={styles.bottomGraphsContainer}>
              <div className={styles.titleContainer}>
                <p
                className={styles.bottomTitle}
                >{languageValues.dashboard.bottomTitle}</p>
              </div>
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
                <div className={styles.graphRightContainer}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}

/*

*/
