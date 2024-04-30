"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import { apiURL, graphColors } from "@/Constants";
import logo from "../../images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
import SearchPages from "../../components/SearchPages/SearchPages";
import DoubleChartComponent from "../../components/DoubleChartComponent/DoubleChartComponent";
import ChartComponent from "@/app/components/ChartComponent/ChartComponent";
import Footer from "../../components/Footer/Footer";
import AuthRoute from "../../components/AuthComponent/AuthComponent";
import useClientLineChart from "../../hooks/ClientHooks/ClientLineCharts/useClientLineChart";
import useFetchTransactionsData from "../../hooks/Transactions/useFetchTransactionsData";
import useBotBarChartData from "../../hooks/BotCharts/useBotBarChartData";
import IndicatorComponent from "../../components/IndicatorComponent/IndicatorComponent";
import addImg from "../../images/icons/addImage.png";
import pdfImg from "../../images/icons/pdf.png";
import whiteArrowUp from "../../images/icons/whiteArrowUp.png";
import whiteArrowDown from "../../images/icons/whiteArrowDown.png";
import Modal from "../../components/ModalComponent/ModalComponent";
import IndicatorCheckboxGroup from "../../components/IndicatorsGroupComponent/IndicatorCheckboxGroup";
import useSuccessAndFailRate from "@/app/hooks/ClientHooks/successAndFailRate/successAndFailRate";

interface IndicatorsState {
  roi: boolean;
  hoursSaved: boolean;
  dollarsSaved: boolean;
  successRate: boolean;
}

export default function Home({ params }: { params: { idBot: number } }) {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  const [getSelectedTime, setSelectedTime] = useState("monthly");
  /*
        Charts displays:
      */
  const [ClientCharts, setClientCharts] = useState(true);

  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );

  /*
    Indicators:   
  */
  // roi
  const [roi, setRoi] = useState(0);
  const [roiProfit, setRoiProfit] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRoi = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/bots/roi/${params.idBot}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ timeframe: getSelectedTime }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setRoi(result.data[0].netProfit);
      setRoiProfit(result.data[0].roi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [params.idBot, getSelectedTime]);

  /*
        Graph Hooks:
      */

  // ClientCharts Hooks

  const {
    clientLineLabelsSuccess,
    clientLineDataSuccess,
    clientLineLabelsFailed,
    clientLineDataFailed,
  } = useClientLineChart(params.idBot, getSelectedTime);

  const { dataSF, labelsSF } = useSuccessAndFailRate(
    params.idBot,
    getSelectedTime
  );
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
  useEffect(() => {
    fetchRoi();
  }, [fetchRoi, getSelectedTime]);

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
      <AuthRoute>
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
                  <div className={styles.mediumSelectContainer}>
                    <select
                      value={getSelectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className={styles.select}
                    >
                      <option value="weekly">
                        {languageValues.dashboard.weekly}
                      </option>

                      <option value="monthly">
                        {languageValues.dashboard.monthly}
                      </option>
                      <option value="yearly">
                        {languageValues.dashboard.yearly}
                      </option>
                    </select>
                  </div>
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
                      <div className={styles.graphLeftContainer}>
                        <ChartComponent
                          data={dataSF}
                          labels={labelsSF}
                          chartType="pie"
                          graphTitle="Success and Failure Rates"
                          fillColor={["#803fe0", "#F44336"]} // green and red
                          borderColor={["#803fe0", "#F44336"]} // same as fillColor for border
                          isFilled={true} // if applicable to pie chart, typically not used
                        />
                      </div>
                      <div className={styles.graphCenterContainer}>
                        <DoubleChartComponent
                          chartType="line"
                          datasets={[
                            {
                              label: languageValues.dashboard.success,
                              data: clientLineDataSuccess,
                              borderColor: "#6200d1",
                              backgroundColor: "#803fe0",
                              fill: false,
                            },
                            {
                              label: languageValues.dashboard.failed,
                              data: clientLineDataFailed,
                              borderColor: "#e74949",
                              backgroundColor: "#e74949",
                              fill: false,
                            },
                          ]}
                          labels={clientLineLabelsSuccess}
                          graphTitle={languageValues.dashboard.botPerformance}
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
                      value={roi}
                      status={true}
                      profitActivator={true}
                      profit={roiProfit}
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
      </AuthRoute>

      <Footer updateLanguage={setLanguage} />
    </>
  );
}
