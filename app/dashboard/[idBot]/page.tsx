"use client";
import React, { useState, useEffect, useCallback, use } from "react";
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
import IndicatorComponent from "../../components/IndicatorComponent/IndicatorComponent";
import filterImg from "../../images/icons/filter.png";
import Modal from "../../components/ModalComponent/ModalComponent";
import ExportComponent from "@/app/components/ExportComponent/ExportComponent";
import IndicatorCheckboxGroup from "../../components/IndicatorsGroupComponent/IndicatorCheckboxGroup";
import useSuccessAndFailRate from "@/app/hooks/ClientHooks/successAndFailRate/successAndFailRate";
import customizeImg from "../../images/icons/settings.png";
import { ChartTypeRegistry } from "chart.js/auto";
import { Charts } from "@/app/interfaces/ICharts";
import { IndicatorsState } from "@/app/interfaces/IIndicatorsState";

export default function Home({ params }: { params: { idBot: number } }) {
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  const [botName, setBotName] = useState("");
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

  // hours saved
  const [hoursSaved, setHoursSaved] = useState(0);
  const [hoursSavedProfit, setHoursSavedProfit] = useState(0);

  // success rate
  const [successRate, setSuccessRate] = useState(0);
  const [successRateProfit, setSuccessRateProfit] = useState(0);

  /*
    Modal Hooks:
  */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const fetchBotInfo = useCallback(async () => {
    const url = `${apiURL}/bots/${params.idBot}`;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch bot info");

      const result = await response.json();
      setBotName(result[0].botName);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [params.idBot]);
  const fetchRoi = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/bots/roi/${params.idBot}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ timeframe: "yearly" }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setRoi(result.data[0].netProfit);
      setRoiProfit(parseFloat(result.data[0].roi.toFixed(2)));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [params.idBot, getSelectedTime]);

  const fetchSavedHours = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/bots/savedHours/${params.idBot}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ timeframe: getSelectedTime }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setHoursSaved(result.data[0].savedHours);
      setHoursSavedProfit(
        parseFloat(result.data[0].savedPercentage.toFixed(2))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [params.idBot, getSelectedTime]);

  const fetchSuccessRate = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/bots/averageSuccess/${params.idBot}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ timeframe: getSelectedTime }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      const correctExecutions = result.data[0].successCount;
      const totalExecutions = result.data[0].totalExecutions;
      const calculatedSuccessRate = correctExecutions;
      setSuccessRate(calculatedSuccessRate);
      setSuccessRateProfit(parseFloat(calculatedSuccessRate.toFixed(2)));
      setSuccessRateProfit(
        parseFloat(result.data[0].averageSuccessRate.toFixed(2))
      );
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleExportModal = () => {
    setIsExportModalOpen(!isExportModalOpen);
  };

  // Call all the fetch functions on mount
  useEffect(() => {
    fetchBotInfo();
    fetchRoi();
    fetchSavedHours();
    fetchSuccessRate();
  }, [
    fetchBotInfo,
    fetchRoi,
    fetchSavedHours,
    fetchSuccessRate,
    getSelectedTime,
  ]);

  const [checkedIndicators, setCheckedIndicators] = useState<IndicatorsState>({
    roi: true,
    hoursSaved: true,
    dollarsSaved: true,
    successRate: true,
  });

  const [selectedChart, setSelectedChart] = useState<Charts>({
    chartOne: "pie",
    chartTwo: "line",
    chartThree: "bar",
  });

  const handleToggleCheckbox = (indicator: keyof IndicatorsState) => {
    setCheckedIndicators((prevState) => ({
      ...prevState,
      [indicator]: !prevState[indicator],
    }));
  };
  const handleChartTypeChange = (
    type: keyof ChartTypeRegistry,
    chartId: keyof Charts
  ) => {
    setSelectedChart((prevSelectedChart) => ({
      ...prevSelectedChart,
      [chartId]: type,
    }));
  };

  const printToPDF = () => {
    window.print();
  };

  const exportToCSV = useCallback(async () => {
    const url = `${apiURL}/bots/${params.idBot}/export-statistics`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ timeframe: getSelectedTime }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch bot info");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `bot_statistics_${params.idBot}_${getSelectedTime}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [params.idBot, getSelectedTime]);

  return (
    <>
      <AuthRoute>
        <LateralNavbar
          lateralNavbar={require("@/Constants").lateralNavbarItems}
          logo={logo.src}
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
          <div className={styles.topContainer}>
            <div className={styles.botNameContainer}>
              <h1>{botName}</h1>
            </div>
            <div className={styles.topBottomContainer}>
              <div className={styles.indicatorsContainer}>
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
                      value={hoursSaved}
                      status={true}
                      profitActivator={false}
                      profit={hoursSavedProfit}
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
                      value={successRate}
                      status={true}
                      profitActivator={false}
                      profit={successRateProfit}
                      languageValues={languageValues}
                      type=""
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.controllersContainer}>
                <div className={styles.controllerContainer}>
                  <button
                    className={styles.controllerButton}
                    onClick={toggleModal}
                  >
                    <div className={styles.iconContainer}>
                      <img src={customizeImg.src} alt="" />
                    </div>
                    <p className={styles.controllerButtonText}>
                      {languageValues.dashboard.customize}
                    </p>
                  </button>
                </div>
                <div className={styles.controllerContainer}>
                  <div className={styles.icon}>
                    <img src={filterImg.src} alt="add" />
                  </div>
                  <div className={styles.controllerElement}>
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
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.topBottomContainer}>
              <div className={styles.topLeftContainer}>
                <h2 className={styles.graphTitle}>
                  {languageValues.dashboard.clientCharts}
                </h2>
              </div>
              <div className={styles.topRightContainer}>
                <button
                  className={styles.exportButton}
                  onClick={toggleExportModal}
                >
                  {languageValues.dashboard.exportReport}
                </button>
              </div>
            </div>
            <div className={styles.graphsContainer}>
              <div className={styles.graphContainer}>
                <ChartComponent
                  data={dataSF}
                  labels={labelsSF}
                  chartType={selectedChart.chartOne as keyof ChartTypeRegistry}
                  graphTitle={languageValues.dashboard.successFailRate}
                  fillColor={["#803fe0", "#F44336"]} // green and red
                  borderColor={["#803fe0", "#F44336"]} // same as fillColor for border
                  isFilled={true} // if applicable to pie chart, typically not used
                />
              </div>
              <div className={styles.graphContainer}>
                <DoubleChartComponent
                  chartType={selectedChart.chartTwo as keyof ChartTypeRegistry}
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
              <div className={styles.graphContainer}></div>
            </div>
          </div>
        </main>
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <IndicatorCheckboxGroup
            languageValues={{
              indicators: {
                roi: languageValues.indicators.roi,
                hoursSaved: languageValues.indicators.hoursSaved,
                dollarsSaved: languageValues.indicators.dollarsSaved,
                successRate: languageValues.indicators.successRate,
              },
            }}
            secondLanguageValues={{
              charts: selectedChart,
            }}
            visualizeMetrics={languageValues.dashboard.visualizeMetrics}
            chartTitle={languageValues.dashboard.ChartTypes}
            checkedIndicators={checkedIndicators}
            onToggleCheckbox={handleToggleCheckbox}
            onChartTypeChange={handleChartTypeChange}
          />
        </Modal>
        <Modal isOpen={isExportModalOpen} onClose={toggleExportModal}>
          <ExportComponent
            pdfText={languageValues.dashboard.downloadPDF}
            csvText={languageValues.dashboard.downloadXLSX}
            handlePdfExport={printToPDF}
            handleCsvExport={exportToCSV}
          />
        </Modal>
      </AuthRoute>

      <Footer updateLanguage={setLanguage} />
    </>
  );
}
