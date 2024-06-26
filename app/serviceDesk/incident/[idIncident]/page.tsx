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
import { IFiles } from "@/app/interfaces/IFiles";
import downloadPDFIcon from "../../../images/icons/downloadPDF.png";
import downloadFileIcon from "../../../images/icons/downloadFile.png";
import { showConfirmAlert } from "@/app/lib/AlertUtils";
import { showErrorToast, showSuccessToast } from "@/app/lib/toastUtils";
import { IUser } from "@/app/interfaces/IUser";

export default function Home({ params }: { params: { idIncident: number } }) {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState<IFiles[]>([]);
  const [fileInputs, setFileInputs] = useState(["file-0"]);
  const [responsibles, setResponsibles] = useState([]);

  const [incident, setIncident] = useState<IIncidences>({
    idIncident: 0,
    incidentName: "",
    responsible: "",
    startDate: null,
    endDate: null,
    Project_idProject: null,
    status: 0,
    description: "",
    progress: null,
  });

  const statusOptions = [
    { value: 0, label: languageValues.statusTypes.open },
    { value: 1, label: languageValues.statusTypes.inProgress },
    { value: 2, label: languageValues.statusTypes.queued },
    { value: 3, label: languageValues.statusTypes.testing },
    { value: 4, label: languageValues.statusTypes.closed },
    { value: 5, label: languageValues.statusTypes.cancelled },
  ];

  const progressOptions = [
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%" },
  ];
  const onClickEdit = () => setIsEdit(!isEdit);
  const cancelEdit = () => setIsEdit(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/incidents/${params.idIncident}`);
      const data = await response.json();
      setIncident(data);
    } catch (error) {
      console.error(error);
    }
  }, [params.idIncident]);

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

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);
    fetchData();
    getFiles();
    fetchResponsibles();
  }, [fetchData]);

  const deleteFile = async (idFiles: number) => {
    try {
      // Display a confirmation alert
      showConfirmAlert(
        languageValues.deleteAlert.titleDeleteFile,
        languageValues.deleteAlert.textDeleteFile,
        languageValues.deleteAlert.confirmButton,
        async () => {
          // If confirmed, proceed with file deletion
          try {
            const response = await fetch(`${apiURL}/files/${idFiles}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            if (response.ok) {
              // Update state after successful deletion
              setFiles(files.filter((file) => file.idFiles !== idFiles));
            } else {
              console.error("Error deleting file");
            }
          } catch (error) {
            console.error(error);
          }
        },
        () => {
          // If canceled, do nothing
          console.log("File deletion canceled");
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleAddNotification = async (
    responsibleId: number,
    incidentName: string
  ) => {
    try {
      const response = await fetch(`${apiURL}/notifications/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: `${languageValues.notifications.titleIncident} `,
          description: `${languageValues.notifications.changeTitle} ${incidentName}`,
          isActive: true,
          Users_idUsers: responsibleId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add notification");
      }
      showSuccessToast(`⚠️ ${languageValues.notifications.titleIncident} `);
    } catch (error) {
      console.error("Error adding notification:", error);
      showErrorToast("Failed to add notification");
    }
  };

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

  const updateIncident = useCallback(async () => {
    try {
      const updatedIncident = {
        ...incident,
        Project_idProject: incident.Project_idProject,
      };

      const response = await fetch(`${apiURL}/incidents/${params.idIncident}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedIncident),
      });

      if (response.ok) {
        const responseData = await response.json();
        setIsEdit(false);
        handleAddNotification(
          responseData.responsibleUserID,
          responseData.incidentName
        );
      } else {
        console.error("Error updating incident");
      }
    } catch (error) {
      console.error(error);
    }
  }, [incident, params.idIncident]);

  const getFiles = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/files/incidents/${params.idIncident}`
      );
      const data = await response.json();

      const filesData = Array.isArray(data) ? data : [data];

      const decodedFiles = filesData.map((file: any) => ({
        idFiles: file.idFiles,
        file: Buffer.from(file.file, "binary").toString("base64"), // Convert buffer to base64 string
        fileType: file.fileType,
        Incidents_idIncident: file.Incidents_idIncident,
      }));

      setFiles(decodedFiles);
    } catch (error) {
      console.error(error);
    }
  }, [params.idIncident]);

  const createDownloadUrl = (content: string, fileType: string) => {
    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileType });
    return URL.createObjectURL(blob);
  };

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

  const renderFiles = () => {
    const handleDownload = (url: string, fileName: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newFile = event.target.files?.[0];
      if (newFile) {
        const formData = new FormData();
        formData.append("file", newFile);
        try {
          const response = await fetch(
            `${apiURL}/files/incidents/${params.idIncident}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );
          if (response.ok) {
            const newFileData = await response.json();
            setFiles([...files, newFileData]);
          } else {
            console.error("Error uploading file");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    return (
      <div className={styles.filesContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.incidentTitle}>
            {languageValues.incidents.files}
          </h2>
        </div>
        <ul className={styles.filesList}>
          {files.map((file) => (
            <li key={file.idFiles} className={styles.fileItem}>
              {file.fileType.startsWith("image/") ? (
                <button
                  onClick={() =>
                    handleDownload(
                      createDownloadUrl(file.file, file.fileType),
                      `image_${file.idFiles}`
                    )
                  }
                  className={styles.imageButton}
                  id="imageButton"
                >
                  <div className={styles.iconContainer}>
                    <img
                      src={downloadFileIcon.src}
                      alt="file"
                      className={styles.fileImage}
                    />
                  </div>
                  <div className={styles.buttonTextContainer}>
                    <span className={styles.buttonText}>
                      {languageValues.incidents.downloadImage}
                    </span>
                  </div>
                </button>
              ) : file.fileType === "application/pdf" ? (
                <button
                  onClick={() =>
                    handleDownload(
                      createDownloadUrl(file.file, file.fileType),
                      `pdf_${file.idFiles}`
                    )
                  }
                  className={styles.pdfButton}
                >
                  <div className={styles.iconContainer}>
                    <img
                      src={downloadPDFIcon.src}
                      alt="file"
                      className={styles.fileImage}
                    />
                  </div>
                  <div className={styles.buttonTextContainer}>
                    <span className={styles.buttonText}>
                      {languageValues.incidents.downloadPDF}
                    </span>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleDownload(
                      createDownloadUrl(file.file, file.fileType),
                      `file_${file.idFiles}`
                    )
                  }
                  className={styles.downloadButton}
                >
                  <div className={styles.iconContainer}>
                    <img
                      src={downloadFileIcon.src}
                      alt="file"
                      className={styles.fileImage}
                    />
                  </div>
                  <div className={styles.buttonTextContainer}>
                    <span className={styles.buttonText}>
                      {languageValues.incidents.downloadPDF}
                    </span>
                  </div>
                </button>
              )}
              {isEdit && (
                <button
                  onClick={() => deleteFile(file.idFiles)}
                  className={styles.deleteFile}
                  aria-label="Delete file"
                >
                  X
                </button>
              )}
            </li>
          ))}
        </ul>
        {isEdit && (
          <>
            {fileInputs.map((input, index) => (
              <div key={input} className={styles.addFileContainer}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className={styles.input}
                />
                {index === fileInputs.length - 1 && (
                  <button
                    className={styles.addButton}
                    onClick={() => addFileInput()}
                  >
                    {languageValues.addIncident.addFileButton}
                  </button>
                )}
                {index !== 0 && (
                  <button
                    className={styles.removeButton}
                    onClick={() => removeFileInput(index)}
                  >
                    {languageValues.addIncident.removeFileButton}
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    );
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
            <div className={styles.top_MediumContainer}>
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
                          value={incident.status.toString()}
                          onChange={(e) =>
                            setIncident({
                              ...incident,
                              status: parseInt(e.target.value),
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
                        <p className={styles.elementText}>
                          {getStatusLabel(incident.status)}
                        </p>
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
                        <select
                          value={incident.responsible}
                          className={styles.select}
                          onChange={(e) =>
                            setIncident({
                              ...incident,
                              responsible: e.target.value,
                            })
                          }
                        >
                          {responsibles.map((responsible) => (
                            <option key={responsible} value={responsible}>
                              {responsible}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className={styles.elementText}>
                          {incident.responsible}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.elementContainer}>
                    <div className={styles.labelContainer}>
                      <label className={styles.label}>
                        {languageValues.incidents.progress}: &nbsp;
                      </label>
                    </div>
                    <div className={styles.valueContainer}>
                      {isEdit ? (
                        <select
                          value={incident.progress?.toString() || ""}
                          className={styles.select}
                          onChange={(e) =>
                            setIncident({
                              ...incident,
                              progress: parseInt(e.target.value),
                            })
                          }
                        >
                          {progressOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className={styles.elementText}>
                          {incident.progress}%
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
                                ? new Date(e.target.value)
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
                                ? new Date(e.target.value)
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
            <div className={styles.bottom_MediumContainer}>{renderFiles()}</div>
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
              <button className={styles.buttonSave} onClick={updateIncident}>
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
