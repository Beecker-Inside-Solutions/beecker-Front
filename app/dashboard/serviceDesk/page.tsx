"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../../app/images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
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

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);

    // Fetch your incidents data and set it to incidentsData state
    // Example fetch:
    fetchIncidentsData().then((data) => {
      setIncidentsData(data);
    });
  }, []);

  // Function to fetch incidents data, replace it with your actual fetching logic
  const fetchIncidentsData = async () => {
    // Example fetch
    const response = await fetch("url_to_fetch_incidences_data");
    const data = await response.json();
    return data;
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
      <main className={styles.main}>
        <table className={styles.incidentTable}>
          <thead>
            <tr>
              <th>{languageValues.incidents.actions}</th>
              <th>{languageValues.incidents.incidentId}</th>
              <th>{languageValues.incidents.incident}</th>
              <th>{languageValues.incidents.status}</th>
              <th>{languageValues.incidents.startDate}</th>
              <th>{languageValues.incidents.endDate}</th>
              <th>{languageValues.incidents.progress}</th>
              <th>{languageValues.incidents.responsible}</th>
            </tr>
          </thead>
          <tbody>
            {incidentsData.map((incident, index) => (
              <tr key={index}>
                <td>
                  <button>{languageValues.incidents.configure}</button>
                  <button>{languageValues.incidents.delete}</button>
                </td>
                <td>{incident.incidentId}</td>
                <td>{incident.incident}</td>
                <td>{incident.status}</td>
                <td>{incident.startDate}</td>
                <td>{incident.endDate}</td>
                <td>{incident.progress}</td>
                <td>{incident.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
