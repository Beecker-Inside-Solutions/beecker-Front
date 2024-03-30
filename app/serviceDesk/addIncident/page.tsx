"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import Footer from "../../components/Footer/Footer";
import { statusOptions } from "@/Constants";
import Link from "next/link";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [incidentsData, setIncidentsData] = useState<IIncidences[]>([]);

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
        <form className={styles.form}>
          <div className={styles.topContainer}>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>
                {languageValues.addIncident.addIncidentHeader}
              </h1>
            </div>
            <div className={styles.flexContainer}>
              <div className={styles.inputsContainer}>
                <div className={styles.leftContainer}>
                  <div className={styles.inputContainer}>
                    <label htmlFor="incidentName">
                      {languageValues.addIncident.incidentName}
                    </label>
                    <input
                      type="text"
                      name="incidentName"
                      id="incidentName"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="responsible">
                      {languageValues.incidents.responsible}
                    </label>
                    <input
                      name="responsible"
                      id="responsible"
                      className={styles.textarea}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="startDate">
                      {languageValues.incidents.startDate}
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="endDate">
                      {languageValues.incidents.endDate}
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <label htmlFor="status">
                      {languageValues.incidents.status}
                    </label>
                    <select name="status" id="status" className={styles.input}>
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.rightContainer}>
                {/* File upload */}
                <div className={styles.inputContainer}>
                  <label htmlFor="file">
                    {languageValues.addIncident.file}
                  </label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.inputContainer}>
              <label htmlFor="description">
                {languageValues.addIncident.description}
              </label>
              <textarea
                name="description"
                id="description"
                className={styles.textarea}
              ></textarea>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              {languageValues.addIncident.submitButton}
            </button>
            <Link href="/serviceDesk">
              <button className={styles.cancelButton}>
                {languageValues.addIncident.cancelButton}
              </button>
            </Link>
          </div>
        </form>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
