"use client";
import React, { useState, useEffect, useCallback } from "react";
import useMultilingualValues from "../hooks/useMultilingualValues";
import logo from ".././images/logos/logo.png";
import configImg from ".././images/icons/config.png";
import deleteImg from ".././images/icons/delete.png";
import excelIcon from ".././images/icons/excelIcon.png";
import addIcon from ".././images/icons/add.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import Footer from "../components/Footer/Footer";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import Link from "next/link";
import AuthRoute from "../components/AuthComponent/AuthComponent";
import { apiURL } from "@/Constants";
import useFetchUserType from "../hooks/useFetchUserType/useFetchUserType";
import {
  showConfirmAlert,
  showSuccessAlert,
  showErrorAlert,
} from "../lib/AlertUtils";
export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [incidentsData, setIncidentsData] = useState<IIncidences[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IIncidences[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 8;

  const { user, fetchUserType } = useFetchUserType();

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);
    //const testData = generateTestData();
    //setIncidentsData(testData);
    fetchUserType();
    fetchData();
  }, []);

  //Pagination logic
  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = filteredIncidents.length
    ? filteredIncidents.slice(indexOfFirstIncident, indexOfLastIncident)
    : incidentsData.slice(indexOfFirstIncident, indexOfLastIncident);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearch = (searchTerm: string) => {
    const filtered = incidentsData.filter((incident) => {
      const idIncident = (
        typeof incident.idIncident === "string" ||
        typeof incident.idIncident === "number"
          ? incident.idIncident
          : ""
      )
        .toString()
        .toLowerCase();
      const incidentName = incident.incidentName.toLowerCase();
      const responsible = incident.responsible.toLowerCase();

      return (
        idIncident.includes(searchTerm.toLowerCase()) ||
        incidentName.includes(searchTerm.toLowerCase()) ||
        responsible.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredIncidents(filtered);
  };

  const exportToExcel = () => {
    const csvContent = [
      Object.keys(incidentsData[0]).join(","),
      ...incidentsData.map((incident) => Object.values(incident).join(",")),
    ].join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "incidents.csv");
    document.body.appendChild(link);
    link.click();
  };

  const parseDate = (dateString: Date | null) => {
    if (dateString === null) {
      return ""; // Or any other appropriate handling for null dates
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const fetchData = useCallback(async () => {
    const response = await fetch(`${apiURL}/incidents`);
    const data = await response.json();
    setIncidentsData(data);
  }, []);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return languageValues.statusTypes.open;
      case 1:
        return languageValues.statusTypes.inProgress;
      case 2:
        return languageValues.statusTypes.queued;
      case 3:
        return languageValues.statusTypes.testing;
      case 4:
        return languageValues.statusTypes.closed;
      case 5:
        return languageValues.statusTypes.cancelled;
      default:
        return "UNKNOWN";
    }
  };

  const fetchDeleteIncident = useCallback(async (idIncident: number) => {
    showConfirmAlert(
      languageValues.incidents.deleteConfirmTitle,
      languageValues.incidents.deleteConfirmText,
      "OK",
      async () => {
        try {
          const response = await fetch(`${apiURL}/incidents/${idIncident}`, {
            method: "DELETE",
          });
          if (response.status === 200) {
            showSuccessAlert(
              languageValues.incidents.deleteSuccessTitle,
              languageValues.incidents.deleteSuccessText
            );
            fetchData();
          } else {
            showErrorAlert(
              languageValues.incidents.deleteErrorTitle,
              languageValues.incidents.deleteErrorText
            );
          }
        } catch (error) {
          showErrorAlert(
            languageValues.incidents.deleteErrorTitle,
            languageValues.incidents.deleteErrorText
          );
        }
      },
      () => {
        // Optional: Do something if cancelled, or leave empty to do nothing
        console.log("Delete cancelled");
      }
    );
  }, []);

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
        <main className={styles.main}>
          <div className={styles.topContainer}>
            <div className={styles.leftContainer}>
              <SearchComponent
                onSearch={handleSearch}
                placeholder={languageValues.incidents.searchInput}
              />
            </div>
            <div className={styles.rightContainer}>
              <button className={styles.exportButton} onClick={exportToExcel}>
                <p className={styles.buttonText}>
                  {languageValues.incidents.exportButton}
                </p>
                <div className={styles.exportIcon}>
                  <img src={excelIcon.src} alt="Excel" />
                </div>
              </button>
              <Link href="/serviceDesk/addIncident">
                <button className={styles.addButton}>
                  <p className={styles.buttonText}>
                    {languageValues.incidents.addButton}
                  </p>
                  <div className={styles.exportIcon}>
                    <img src={addIcon.src} alt="Config" />
                  </div>
                </button>
              </Link>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <table className={styles.incidentTable}>
              <thead>
                <tr>
                  <th className={styles.actionsHeader}>
                    {languageValues.incidents.actions}
                  </th>
                  <th className={styles.incidentIdHeader}>
                    {languageValues.incidents.incidentId}
                  </th>
                  <th className={styles.incidentHeader}>
                    {languageValues.incidents.incident}
                  </th>
                  <th className={styles.statusHeader}>
                    {languageValues.incidents.status}
                  </th>
                  <th className={styles.startDateHeader}>
                    {languageValues.incidents.startDate}
                  </th>
                  <th className={styles.endDateHeader}>
                    {languageValues.incidents.endDate}
                  </th>
                  <th className={styles.progressHeader}>
                    {languageValues.incidents.progress}
                  </th>
                  <th className={styles.responsibleHeader}>
                    {languageValues.incidents.responsible}
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentIncidents.map((incident, index) => (
                  <tr key={index}>
                    <td className={styles.buttonsContainer}>
                      <Link
                        href={`/serviceDesk/incident/${incident.idIncident}`}
                        passHref
                      >
                        <button className={styles.actionButton}>
                          <img src={configImg.src} alt="Config" />
                        </button>
                      </Link>
                      {user.isAdmin && (
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            if (incident.idIncident !== undefined) {
                              fetchDeleteIncident(incident.idIncident);
                            } else {
                              console.error("idIncident is undefined");
                            }
                          }} // Wrap in anonymous function and check for undefined
                        >
                          <img src={deleteImg.src} alt="Delete" />
                        </button>
                      )}
                    </td>
                    <td className={styles.incidentId}>{incident.idIncident}</td>
                    <td className={styles.incident}>{incident.incidentName}</td>
                    <td className={styles.status}>
                      {getStatusLabel(incident.status)}
                    </td>
                    <td className={styles.startDate}>
                      {parseDate(incident.startDate)}
                    </td>
                    <td className={styles.endDate}>
                      {parseDate(incident.endDate)}
                    </td>
                    <td className={styles.progress}>{incident.progress}%</td>
                    <td className={styles.responsible}>
                      {incident.responsible}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className={styles.pagination}>
              {Array.from(
                { length: Math.ceil(incidentsData.length / incidentsPerPage) },
                (_, i) => (
                  <button key={i} onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        </main>
      </AuthRoute>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
