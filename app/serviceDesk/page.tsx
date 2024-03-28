"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../hooks/useMultilingualValues";
import logo from ".././images/logos/logo.png";
import configImg from ".././images/icons/config.png";
import deleteImg from ".././images/icons/delete.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [incidentsData, setIncidentsData] = useState<IIncidences[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 8;

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);

    //setIncidentsData(testData);
  }, []);

  // Pagination logic
  const indexOfLastIncident = currentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = incidentsData.slice(
    indexOfFirstIncident,
    indexOfLastIncident
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <main className={styles.main}>
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
                  <button className={styles.actionButton}>
                    <img src={configImg.src} alt="Config" />
                  </button>
                  <button className={styles.actionButton}>
                    <img src={deleteImg.src} alt="Delete" />
                  </button>
                </td>
                <td className={styles.incidentId}>{incident.incidentId}</td>
                <td className={styles.incident}>{incident.incident}</td>
                <td className={styles.status}>{incident.status}</td>
                <td className={styles.startDate}>{incident.startDate}</td>
                <td className={styles.endDate}>{incident.endDate}</td>
                <td className={styles.progress}>{incident.progress}</td>
                <td className={styles.responsible}>{incident.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
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
      </main>
    </>
  );
}
