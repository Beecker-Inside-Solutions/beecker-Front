"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import { apiURL, graphColors } from "@/Constants";
import logo from "../../images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
import SearchPages from "../../components/SearchPages/SearchPages";
import ChartComponent from "../../components/DoubleChartComponent/DoubleChartComponent";
import DoubleChartComponent from "../../components/DoubleChartComponent/DoubleChartComponent";
import Footer from "../../components/Footer/Footer";
import AuthRoute from "../../components/AuthComponent/AuthComponent";
import useClientLineChart from "../../hooks/ClientHooks/ClientLineCharts/useClientLineChart";
import clientBarChart from "../../hooks/ClientHooks/ClientBarChart/useClientBarChart";
import useFetchTransactionsData from "../../hooks/Transactions/useFetchTransactionsData";
import useBotBarChartData from "../../hooks/BotCharts/useBotBarChartData";
import IndicatorComponent from "../../components/IndicatorComponent/IndicatorComponent";
import addImg from "../../images/icons/addImage.png";
import pdfImg from "../../images/icons/pdf.png";
import whiteArrowUp from "../../images/icons/whiteArrowUp.png";
import whiteArrowDown from "../../images/icons/whiteArrowDown.png";
import Modal from "../../components/ModalComponent/ModalComponent";
import IndicatorCheckboxGroup from "../../components/IndicatorsGroupComponent/IndicatorCheckboxGroup";

interface IndicatorsState {
  roi: boolean;
  hoursSaved: boolean;
  dollarsSaved: boolean;
  successRate: boolean;
}

export default function Home({ params }: { params: { idBot: number } }) {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  console.log(params.idBot);
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  /*
        Graph Hooks:
      */

  // ClientCharts Hooks

  const {
    clientLineLabelsSuccess,
    clientLineDataSuccess,
    clientLineLabelsFailed,
    clientLineDataFailed,
  } = useClientLineChart(params.idBot, "monthly");
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [activeIndicators, setActiveIndicators] = useState<IndicatorsState>({
    roi: false,
    hoursSaved: false,
    dollarsSaved: false,
    successRate: false,
  });

  const [checkedIndicators, setCheckedIndicators] = useState<IndicatorsState>({
    roi: true,
    hoursSaved: true,
    dollarsSaved: true,
    successRate: true,
  });
  const handleToggleCheckbox = (indicator: keyof IndicatorsState) => {
    setCheckedIndicators((prevState) => ({
      ...prevState,
      [indicator]: !prevState[indicator],
    }));
  };

  const printToPDF = () => {
    window.print();
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
            <div className={styles.buttonsContainer}>
              <div className={styles.leftButtonContainer}>
                <button className={styles.leftButton} onClick={toggleModal}>
                  <img src={addImg.src} alt="plus" />
                </button>
              </div>
              <div className={styles.rightButtonContainer}>
                <button className={styles.rightButton} onClick={printToPDF}>
                  <p className={styles.downloadText}>
                    {languageValues.dashboard.downloadPDF}
                  </p>
                  <img
                    src={pdfImg.src}
                    alt="pdf"
                    className={styles.downloadIcon}
                  />
                </button>
              </div>
            </div>
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
                  <img src={whiteArrowDown.src} alt="arrow-up" />
                ) : (
                  <img src={whiteArrowUp.src} alt="arrow-down" />
                )}
              </div>
              {ClientCharts && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.graphsContainer}>
                    <div className={styles.graphLeftContainer}></div>
                    <div className={styles.graphCenterContainer}>
                      <DoubleChartComponent
                        chartType="line"
                        datasets={[
                          {
                            label: "Success",
                            data: clientLineDataSuccess,
                            borderColor: getRandomColor(), // or a specific color for success
                            backgroundColor: "rgba(75, 192, 192, 0.2)", // translucent green
                            fill: false,
                          },
                          {
                            label: "Failed",
                            data: clientLineDataFailed,
                            borderColor: getRandomColor(), // or a specific color for failure
                            backgroundColor: "rgba(255, 99, 132, 0.2)", // translucent red
                            fill: false,
                          },
                        ]}
                        labels={clientLineLabelsSuccess} // Assuming success and failed share the same labels
                        graphTitle="Performance Over Time"
                      />
                    </div>
                    <div className={styles.graphRightContainer}></div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.bottomGraphsContainer}>
              {checkedIndicators.roi ? (
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
              ) : (
                <></>
              )}

              {checkedIndicators.hoursSaved ? (
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
              ) : (
                <></>
              )}
              {checkedIndicators.dollarsSaved ? (
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
              ) : (
                <></>
              )}
              {checkedIndicators.successRate ? (
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
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <IndicatorCheckboxGroup
          languageValues={{
            indicators: {
              roi: "Return on Investment",
              hoursSaved: "Hours Saved",
              dollarsSaved: "Dollars Saved",
              successRate: "Success Rate",
            },
          }}
          checkedIndicators={checkedIndicators}
          onToggleCheckbox={handleToggleCheckbox}
        />{" "}
      </Modal>

      <Footer updateLanguage={setLanguage} />
    </>
  );
}