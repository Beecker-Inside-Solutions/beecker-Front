"use client";
import React, { useState, useEffect, useCallback } from "react";
import useMultilingualValues from "../../../hooks/useMultilingualValues";
import logo from "../../../images/logos/logo.png";
import LateralNavbar from "../../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import Footer from "../../../components/Footer/Footer";
import taskIcon from "../../../images/icons/taskIcon.png";
import editIcon from "../../../images/icons/edit.png";
import Link from "next/link";
import AuthRoute from "@/app/components/AuthComponent/AuthComponent";
import { apiURL } from "@/Constants";

export default function Home({ params }: { params: { idIncident: number } }) {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [isEdit, setIsEdit] = useState(false);

  const statusOptions = [
    { value: 0, label: languageValues.statusTypes.open },
    { value: 1, label: languageValues.statusTypes.inProgress },
    { value: 2, label: languageValues.statusTypes.queued },
    { value: 3, label: languageValues.statusTypes.testing },
    { value: 4, label: languageValues.statusTypes.closed },
    { value: 5, label: languageValues.statusTypes.cancelled },
  ];

  // Incidents data
  const [incident, setIncident] = useState<IIncidences>({
    idIncident: 0,
    incidentName: "",
    responsible: "",
    startDate: null,
    endDate: null,
    projectID: null,
    status: 0,
    description: "",
    progress: null,
  });
  // OnClick Edit
  const onClickEdit = () => {
    setIsEdit(!isEdit);
  };

  const cancelEdit = () => {
    setIsEdit(false);
  };
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/incidents/${params.idIncident}`);
      const data = await response.json();
      setIncident(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }, [params.idIncident]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);
    fetchData();
  }, [fetchData]);

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
                <h1 className={styles.incidentTitle}>
                  {incident.incidentName}
                </h1>
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
                        value={incident.status.toString()} // Make sure incident.status is a string
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            status: parseInt(e.target.value), // Parse string value to number
                          })
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
                        value={
                          incident.startDate
                            ? new Date(incident.startDate)
                                .toISOString()
                                .substr(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            startDate: e.target.value
                              ? new Date(e.target.value) // Convert string to Date object
                              : null,
                          })
                        }
                      />
                    ) : (
                      <p className={styles.elementText}>
                        {incident.startDate
                          ? new Date(incident.startDate).toLocaleDateString()
                          : ""}
                      </p>
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
                        value={
                          incident.endDate
                            ? new Date(incident.endDate)
                                .toISOString()
                                .substr(0, 10)
                            : ""
                        }
                        onChange={(e) =>
                          setIncident({
                            ...incident,
                            endDate: e.target.value
                              ? new Date(e.target.value) // Convert string to Date object
                              : null,
                          })
                        }
                      />
                    ) : (
                      <p className={styles.elementText}>
                        {incident.endDate
                          ? new Date(incident.endDate).toLocaleDateString()
                          : ""}
                      </p>
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
