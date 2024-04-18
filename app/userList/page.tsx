"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../hooks/useMultilingualValues";
import logo from ".././images/logos/logo.png";
import configImg from ".././images/icons/config.png";
import deleteImg from ".././images/icons/delete.png";
import excelIcon from ".././images/icons/excelIcon.png";
import editIcon from ".././images/icons/editIcon.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import { IUserList } from "../interfaces/IIUserList";
import styles from "./page.module.css";
import Footer from "../components/Footer/Footer";
import SearchComponent from "../components/SearchComponent/SearchComponent";
import Modal from "../components/ModalComponent/ModalComponent";
import UserList from "../components/UserEditComponent/UserEditComponent";
import { apiURL } from "@/Constants";
export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [userListData, setuserListData] = useState<IUserList[]>([]);
  const [filteredUserList, setfilteredUserList] = useState<IUserList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const incidentsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(0);

  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);

    const fetchData = async () => {
      try {
        const data = await fetchUserList();
        setuserListData(data);
      } catch (error) {
        console.error("Error fetching user data:", error); // Log fetch error
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setfilteredUserList(userListData);
  }, [userListData]);

  // Pagination logic
  const indexOfLastUser = currentPage * incidentsPerPage;
  const indexOfFirstUser = indexOfLastUser - incidentsPerPage;
  const currentUsers = filteredUserList.length
    ? filteredUserList.slice(indexOfFirstUser, indexOfLastUser)
    : userListData.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const fetchUserList = async (): Promise<IUserList[]> => {
    const response = await fetch(`${apiURL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    return data;
  };

  const exportToExcel = () => {
    const csvContent = [
      Object.keys(userListData[0]).join(","),
      ...userListData.map((incident) => Object.values(incident).join(",")),
    ].join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditIconClick = (userId: number) => {
    setSelectedUser(userId);
    toggleModal();
  };

  const getRoleName = (roleId: number): string => {
    switch (roleId) {
      case 1:
        return "Administrator";
      case 2:
        return "Internal Client";
      case 3:
        return "External Client";
      default:
        return "Unknown Role";
    }
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
        <div className={styles.topContainer}>
          <div className={styles.leftContainer}>
            <SearchComponent
              onSearch={console.log}
              placeholder={languageValues.userList.searchInput}
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
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <table className={styles.incidentTable}>
            <thead>
              <tr>
                <th className={styles.actionsHeader}>
                  {languageValues.userList.name}
                </th>
                <th className={styles.incidentIdHeader}>
                  {languageValues.userList.email}
                </th>
                <th className={styles.incidentHeader}>
                  {languageValues.userList.role}
                </th>
                <th className={styles.statusHeader}>
                  {languageValues.userList.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((incident) => (
                <tr key={incident.idUsers}>
                  <td>{incident.name}</td>
                  <td>{incident.email}</td>
                  <td>{getRoleName(incident.Roles_idRole)}</td>{" "}
                  <td className={styles.actions}>
                    <img
                      src={editIcon.src}
                      onClick={(event: any) =>
                        handleEditIconClick(incident.idUsers)
                      } // Fix: Pass incident.id instead of incident
                      alt="Config"
                    />
                    <img src={deleteImg.src} alt="Delete" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.pagination}>
            {Array.from(
              { length: Math.ceil(userListData.length / incidentsPerPage) },
              (_, i) => (
                <button key={i} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <UserList languageValues={languageValues} Roles_idRole={selectedUser} />
      </Modal>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
