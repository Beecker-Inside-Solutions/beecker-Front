"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
import Footer from "../../components/Footer/Footer";
import AuthRoute from "@/app/components/AuthComponent/AuthComponent";
import { statusOptions, lateralNavbarItems } from "@/Constants";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import { apiURL } from "@/Constants";
import { Project } from "@/app/interfaces/IProject";
import { IUser } from "@/app/interfaces/IUser";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  const [incidentsData, setIncidentsData] = useState<IIncidences[]>([]);
  const [fileInputs, setFileInputs] = useState(["file-0"]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [responsibles, setResponsibles] = useState([]);

  useEffect(() => {
    // Fetch user data logic
    // setUserName(fetchedUserName);
    // setProfileImg(fetchedProfileImg || logo.src);
  }, []);

  useEffect(() => {
    // Fetch incidents data logic
    // setIncidentsData(fetchedIncidentsData);
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      fetch(`${apiURL}/projects/user/${localStorage.getItem("userId")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
        });
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  }, []);

  const fetchResponsibles = useCallback(async () => {
    try {
      fetch(`${apiURL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const responsibleFullNames = data.map(
            (responsible: IUser) =>
              `${responsible.name} ${responsible.lastName}`
          );

          setResponsibles(responsibleFullNames);
          console.log(responsibleFullNames);
        });
    } catch (error) {
      console.error("Error fetching responsibles: ", error);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchResponsibles();
  }, [fetchProjects, fetchResponsibles]);

  const addFileInput = () => {
    if (fileInputs.length < 3) {
      setFileInputs([...fileInputs, `file-${fileInputs.length}`]);
    }
  };

  const removeFileInput = (index: number) => {
    setFileInputs(fileInputs.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const data = {
      incidentName: formData.get("incidentName"),
      responsible: formData.get("responsible"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      projects: formData.get("projects"),
      status: formData.get("status"),
      description: formData.get("description"),
    };

    fetch(`${apiURL}/incidents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <>
      <AuthRoute>
        <LateralNavbar lateralNavbar={lateralNavbarItems} logo={logo.src} />
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
                    <select
                      name="responsible"
                      id="responsible"
                      className={styles.input}
                    >
                      {responsibles.map((responsible) => (
                        <option key={responsible} value={responsible}>
                          {responsible}
                        </option>
                      ))}
                    </select>
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
                    <label htmlFor="projects">
                      {languageValues.incidents.projects}
                    </label>
                    <select
                      name="projects"
                      id="projects"
                      className={styles.input}
                    >
                      {projects.map((project) => (
                        <option
                          key={project.idProject}
                          value={project.idProject}
                        >
                          {project.projectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.rightContainer}>
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
                  {fileInputs.map((fileInput, index) => (
                    <div className={styles.inputContainer} key={fileInput}>
                      <label htmlFor={fileInput}>
                        {languageValues.addIncident.file} {index + 1}
                      </label>
                      <input
                        type="file"
                        name={fileInput}
                        id={fileInput}
                        className={styles.input}
                      />
                      <button
                        type="button"
                        onClick={() => removeFileInput(index)}
                        className={styles.removeButton}
                      >
                        {languageValues.addIncident.removeFileButton}
                      </button>
                    </div>
                  ))}
                  {fileInputs.length < 3 && (
                    <button
                      type="button"
                      onClick={addFileInput}
                      className={styles.addButton}
                    >
                      {languageValues.addIncident.addFileButton}
                    </button>
                  )}
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
                <button type="button" className={styles.cancelButton}>
                  {languageValues.addIncident.cancelButton}
                </button>
              </Link>
            </div>
          </form>
        </main>
      </AuthRoute>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
