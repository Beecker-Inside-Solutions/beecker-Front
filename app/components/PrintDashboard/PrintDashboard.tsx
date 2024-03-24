"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../images/logos/logo.png";
import ChartComponent from "../../components/ChartComponent/ChartComponent";
import useClientLineChart from "../../hooks/ClientHooks/ClientLineCharts/useClientLineChart";
import clientBarChart from "../../hooks/ClientHooks/ClientBarChart/useClientBarChart";
import { renderToStaticMarkup } from "react-dom/server";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { title } from "process";

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
    padding: 5,
    backgroundColor: "#ffffff",
  },

  headerSection: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    borderBottom: "2px solid #803fe0",
  },

  leftSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexGrow: 1,
    width: "25%",
  },

  centerSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    width: "75%",
  },

  titleHeader: {
    fontSize: 24,
    color: "#000000",
    textAlign: "center",
    fontWeight: "bold",
  },

  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },

  sectionHeader: {
    fontSize: 20,
    color: "#803fe0",
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "2px solid #803fe0",
  },

  sectionTitleContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    width: "30%",
    padding: 10,
    borderRadius: 5,
    margin: 2,
  },

  graphsContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    padding: 10,
  },

  graphContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    height: "100%",
  },

  topBottomGraph: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50%",
  },
});

export default function PrintDashboard() {
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

  const printToPDF = () => {
    window.print();
  };

  return (
    <>
      <div>
        <button onClick={printToPDF}>Print to PDF</button>
      </div>

      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerSection}>
            <div style={styles.leftSection}>
              <Image src={logo.src} alt="Logo" width={200} height={50} />
            </div>
            <View style={styles.centerSection}>
              <Text style={styles.titleHeader}>Client Report</Text>
            </View>
          </View>
          <View style={styles.section}>
            <div style={styles.sectionTitleContainer}>
              <Text style={styles.sectionHeader}>Charts</Text>
            </div>
            <div style={styles.graphsContainer}>
              <div style={styles.topBottomGraph}>
                <div style={styles.graphContainer}>
                  <ChartComponent
                    chartType="line"
                    data={clientLineData}
                    labels={clientLineLabels}
                    graphTitle={languageValues.dashboard.botBarTitle}
                  />
                </div>
                <div style={styles.graphContainer}>
                  {" "}
                  <ChartComponent
                    chartType="bar"
                    data={clientBarData}
                    labels={clientBarLabels}
                    graphTitle={languageValues.dashboard.botBarTitle}
                  />
                </div>
              </div>
              <div style={styles.topBottomGraph}>
                <div style={styles.graphContainer}>
                  <ChartComponent
                    chartType="line"
                    data={clientLineData}
                    labels={clientLineLabels}
                    graphTitle={languageValues.dashboard.botBarTitle}
                  />
                </div>
                <div style={styles.graphContainer}>
                  {" "}
                  <ChartComponent
                    chartType="bar"
                    data={clientBarData}
                    labels={clientBarLabels}
                    graphTitle={languageValues.dashboard.botBarTitle}
                  />
                </div>
              </div>
            </div>
          </View>
          <View style={styles.section}>
            <div style={styles.sectionTitleContainer}>
              <Text style={styles.sectionHeader}>Indicators</Text>
            </div>
          </View>
        </Page>
      </Document>
    </>
  );
}
