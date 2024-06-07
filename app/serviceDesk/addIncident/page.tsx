"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";
import Footer from "../../components/Footer/Footer";
import AuthRoute from "@/app/components/AuthComponent/AuthComponent";
import { lateralNavbarItems, apiURL } from "@/Constants";
import { IIncidences } from "@/app/interfaces/IIncidences";
import { Project } from "@/app/interfaces/IProject";
import { IUser } from "@/app/interfaces/IUser";
import { showSuccessAlert, showErrorAlert } from "@/app/lib/AlertUtils";
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
  const [fileInputs, setFileInputs] = useState(["file-0"]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [responsibles, setResponsibles] = useState([]);
  const [formError, setFormError] = useState<string | null>(null);

  const statusOptions = [
    { value: 0, label: languageValues.statusTypes.open },
    { value: 1, label: languageValues.statusTypes.inProgress },
    { value: 2, label: languageValues.statusTypes.queued },
    { value: 3, label: languageValues.statusTypes.testing },
    { value: 4, label: languageValues.statusTypes.closed },
    { value: 5, label: languageValues.statusTypes.cancelled },
  ];

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
      const response = await fetch(
        `${apiURL}/projects/user/${localStorage.getItem("userId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects: ", error);
    }
  }, []);

  const fetchResponsibles = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      const responsibleFullNames = data.map(
        (responsible: IUser) => `${responsible.name} ${responsible.lastName}`
      );
      setResponsibles(responsibleFullNames);
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
    if (fileInputs.length > 1) {
      setFileInputs(fileInputs.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    let hasFileAttached = false;
    let fileTooLarge = false;

    fileInputs.forEach((fileInput) => {
      const file = formData.get(fileInput) as File;
      if (file) {
        hasFileAttached = true;
        if (file.size > 2 * 1024 * 1024) {
          fileTooLarge = true;
        }
      }
    });

    if (!hasFileAttached) {
      setFormError(languageValues.addIncident.fileRequiredError);
      return;
    }

    if (fileTooLarge) {
      setFormError(languageValues.addIncident.fileTooLargeError);
      return;
    }

    const data: IIncidences = {
      incidentName: formData.get("incidentName") as string,
      responsible: formData.get("responsible") as string,
      startDate: formData.get("startDate")
        ? new Date(formData.get("startDate") as string)
        : null,
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate") as string)
        : null,
      Project_idProject: formData.get("projects")
        ? Number(formData.get("projects") as string)
        : null,
      status: formData.get("status")
        ? Number(formData.get("status") as string)
        : 0,
      description: formData.get("description") as string,
      progress: 0,
    };

    try {
      const response = await fetch(`${apiURL}/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        showSuccessAlert(
          languageValues.alerts.successAlertTitle,
          languageValues.addIncident.successMessage
        );
        await fetchAddFiles(result.incidentID); // Ensure the correct key name here
        form.reset();
        window.location.href = "/serviceDesk";
      } else {
        showErrorAlert(
          languageValues.alerts.errorAlertTitle,
          languageValues.addIncident.errorSubmittingForm
        );
        setFormError("An error occurred while submitting the form.");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.addIncident.errorSubmittingForm
      );
      setFormError("An error occurred while submitting the form.");
    }
  };

  const fetchAddFiles = async (incidentId: number) => {
    const form = document.querySelector("form");

    if (!form) {
      console.error("Form not found");
      return;
    }

    const formData = new FormData(form);
    const files = Array.from(fileInputs).map(
      (fileInput) => formData.get(fileInput) as File
    );

    for (const file of files) {
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          continue;
        }

        const data = new FormData();
        data.append("file", file);
        data.append("incidentID", incidentId.toString()); // Ensure the correct key name here

        try {
          const response = await fetch(`${apiURL}/files`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: data,
          });
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.error("Error uploading file: ", error);
        }
      }
    }
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
          <form className={styles.form} onSubmit={handleFormSubmit}>
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
                      {fileInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFileInput(index)}
                          className={styles.removeButton}
                        >
                          {languageValues.addIncident.removeFileButton}
                        </button>
                      )}
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
            {formError && <p className={styles.error}>{formError}</p>}
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
