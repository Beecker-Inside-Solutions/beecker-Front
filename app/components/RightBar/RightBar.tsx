"use client";
import React, { useEffect, useState } from "react";
import styles from "./RightBar.module.css";
import { IRightBar } from "@/app/interfaces/IRightBar";
import downArrow from "@/app/images/icons/closeArrow.png";
import upArrow from "@/app/images/icons/openArrow.png";
import Link from "next/link";
import profile from "@/app/images/icons/profile.png";
import logout from "@/app/images/icons/logout.png";
import notification from "@/app/images/icons/notification.png";
import { routes, apiURL } from "@/Constants";
import { showSuccessAlert } from "../../lib/AlertUtils";
import NotificationComponent from "../NotificationComponent/NotificationComponent";
import { INotificationProps } from "@/app/interfaces/INotificationProps";
import logo from "../../images/logos/logo.png";

const RightBar: React.FC<IRightBar> = ({
  logoutHeader,
  logoutText,
  logoutButton,
  profileButton,
}: IRightBar) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);
  const [getLogout, setLogout] = useState("");
  const [profileName, setProfileName] = useState("");
  const [notifications, setNotifications] = useState<INotificationProps[]>([]);

  const fetchLogout = () => {
    showSuccessAlert(logoutHeader, logoutText);
    localStorage.removeItem("token");
    window.location.href = routes.login;
  };

  const fetchInformation = async () => {
    try {
      const response = await fetch(`${apiURL}/users/${localStorage.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user information");
      }
      const data = await response.json();
      setProfileName(data[0].name);
    } catch (error) {
      console.error("Error fetching user information:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${apiURL}/notifications/user/${localStorage.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setLogout(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const toggleAlertDropdown = () => {
    setShowAlertDropdown((prevState) => !prevState);
    fetchNotifications();
  };

  const handleLogout = () => {
    fetchLogout();
    localStorage.clear();
  };

  useEffect(() => {
    fetchInformation();
  }, []);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.topContainer}>
        <div className={styles.notification} onClick={toggleAlertDropdown}>
          <img src={notification.src} alt="notification" />
        </div>
        <div className={styles.profileImage}>
          <img src={logo.src} alt={profileName} width={50} height={50} />
        </div>
        <div className={styles.profileNameContainer}>
          <p className={styles.profileName}>{profileName}</p>
        </div>
        <div className={styles.arrowContainer} onClick={toggleDropdown}>
          {showDropdown ? (
            <img src={downArrow.src} alt="arrow-up" />
          ) : (
            <img src={upArrow.src} alt="arrow-down" />
          )}
        </div>
      </div>
      {showAlertDropdown && (
        <div className={styles.dropdownMenuAlerts}>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationComponent
                  key={notification.idNotifications}
                  name={notification.name}
                  description={notification.description}
                  isActive={notification.isActive}
                  idNotifications={notification.idNotifications}
                  fetchNotificationsCallback={fetchNotifications}
                />
              ))
            ) : (
              <li className={styles.noNotifications}>No notifications</li>
            )}
          </ul>
        </div>
      )}

      {showDropdown && (
        <div className={styles.dropdownMenu}>
          <ul>
            <Link href="/profile">
              <li>
                <img className={styles.profileIcon} src={profile.src} />
                <p>{profileButton}</p>
              </li>
            </Link>
            <Link
              href="/"
              onClick={() => {
                handleLogout();
              }}
            >
              <li>
                <img className={styles.logout} src={logout.src} />
                <p>{logoutButton}</p>
              </li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RightBar;
