"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../../../hooks/useMultilingualValues";
import logo from "../../../images/logos/logo.png";
import LateralNavbar from "../../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import Footer from "../../../components/Footer/Footer";
import { statusOptions } from "@/Constants";
import taskIcon from "../../../images/icons/taskIcon.png";
import editIcon from "../../../images/icons/edit.png";
import Link from "next/link";
import AuthRoute from "@/app/components/AuthComponent/AuthComponent";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [isEdit, setIsEdit] = useState(false);

  // Incidents data
  const [incident, setIncident] = useState<IIncidences>({
    idIncident: "PIPO-52",
    incidentName: "Incidente1",
    status: "Pending",
    startDate: "20-12-2024",
    endDate: "21-12-2024",
    progress: "75%",
    responsible: "Antonio Niguerron",
    description: "Description",
  });

  // OnClick Edit
  const onClickEdit = () => {
    setIsEdit(!isEdit);
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };

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
          <div className={styles.header}>
            <Link href="/serviceDesk">
              <h1 className={styles.returnDesk}>
                {languageValues.incidents.return}
              </h1>
            </Link>
          </div>
          <div className={styles.topContainer}>
            <div className={styles.topLeftContainer}>
              <div className={styles.imgContainer}>
                <img src={taskIcon.src} alt="taskIcon" />
              </div>
            </div>
            <div className={styles.topMediumContainer}>
              {isEdit ? (
                <input
                  type="text"
                  className={styles.input}
                  value={incident.incidentName}
                  onChange={(e) =>
                    setIncident({ ...incident, incidentName: e.target.value })
                  }
                />
              ) : (
                <h1 className={styles.incidentTitle}>{incident.incidentName}</h1>
              )}
            </div>
            <div className={styles.topRightContainer}>
              {isEdit ? null : (
                <div className={styles.imgEditContainer} onClick={onClickEdit}>
                  <img src={editIcon.src} alt="editIcon" />
                </div>
              )}
            </div>
          </div>
          <div className={styles.mediumContainer}>
            <div className={styles.titleContainer}>
              <h1 className={styles.incidentTitle}>
                {languageValues.addIncident.addIncidentHeader}
              </h1>
            </div>
            <div className={styles.mediumContent}>
              <div className={styles.leftContainer}>
                <div className={styles.elementContainer}>
                  <div className={styles.labelContainer}>
                    <label className={styles.label}>
                      {languageValues.incidents.status}: &nbsp;
                    </label>
                  </div>
                  <div className={styles.valueContainer}>
                    {isEdit ? (
                      <select
                        className={styles.select}
                        value={incident.status}
                        onChange={(e) =>
                          setIncident({ ...incident, status: e.target.value })
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className={styles.elementText}>{incident.status}</p>
                    )}
                  </div>
                </div>
                <div className={styles.elementContainer}>
                  <div className={styles.labelContainer}>
                    <label className={styles.label}>
                      {languageValues.incidents.responsible}: &nbsp;
                    </label>
                  </div>
                  <div className={styles.valueContainer}>
                    {isEdit ? (
                      <input
                        type="text"
                        className={styles.input}
                        value={incident.responsible}
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            responsible: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className={styles.elementText}>
                        {incident.responsible}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.rightContainer}>
                <div className={styles.elementContainer}>
                  <div className={styles.labelContainer}>
                    <label className={styles.label}>
                      {languageValues.incidents.startDate}: &nbsp;
                    </label>
                  </div>
                  <div className={styles.valueContainer}>
                    {isEdit ? (
                      <input
                        type="date"
                        className={styles.input}
                        value={incident.startDate}
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            startDate: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className={styles.elementText}>{incident.startDate}</p>
                    )}
                  </div>
                </div>
                <div className={styles.elementContainer}>
                  <div className={styles.labelContainer}>
                    <label className={styles.label}>
                      {languageValues.incidents.endDate}: &nbsp;
                    </label>
                  </div>
                  <div className={styles.valueContainer}>
                    {isEdit ? (
                      <input
                        type="date"
                        className={styles.input}
                        value={incident.endDate}
                        onChange={(e) =>
                          setIncident({ ...incident, endDate: e.target.value })
                        }
                      />
                    ) : (
                      <p className={styles.elementText}>{incident.endDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.titleContainer}>
              <h1 className={styles.incidentTitle}>
                {languageValues.addIncident.description}
              </h1>
            </div>
            <div className={styles.mediumContent}>
              <div className={styles.elementContainer}>
                <div className={styles.labelContainer}>
                  <label className={styles.label}>
                    {languageValues.incidents.description}: &nbsp;
                  </label>
                </div>
                <div className={styles.valueContainer}>
                  {isEdit ? (
                    <textarea
                      className={styles.textarea}
                      value={incident.description}
                      onChange={(e) =>
                        setIncident({
                          ...incident,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className={styles.elementText}>{incident.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isEdit ? (
            <div className={styles.buttonsContainer}>
              <button className={styles.buttonSave}>
                {languageValues.incidents.save}
              </button>
              <button className={styles.buttonCancel} onClick={cancelEdit}>
                {languageValues.incidents.cancel}
              </button>
            </div>
          ) : null}
        </main>
      </AuthRoute>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
