import React from "react";
import { INotificationProps } from "@/app/interfaces/INotificationProps";
import styles from "./NotificationComponent.module.css";
import { apiURL } from "@/Constants";

interface NotificationComponentProps extends INotificationProps {
  fetchNotificationsCallback: () => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({
  idNotifications,
  name,
  description,
  isActive,
  fetchNotificationsCallback,
}) => {
  const deleteNotification = async (idNotifications: number) => {
    try {
      const response = await fetch(
        `${apiURL}/notifications/delete/${idNotifications}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to delete notification with id ${idNotifications}`
        );
      }
      const data = await response.json();
      // After successful deletion, call the callback function to fetch notifications again
      fetchNotificationsCallback();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notificationHeader}>
        <div className={styles.leftContainer}>
          <div
            className={
              isActive
                ? styles.notificationCircleActive
                : styles.notificationCircleInactive
            }
          ></div>
        </div>
        <div className={styles.mediumContainer}>
          <p className={styles.notificationName}>{name}</p>
        </div>
        <div className={styles.rightContainer}>
          <button
            className={styles.deleteButton}
            onClick={() => deleteNotification(idNotifications)}
          >
            x
          </button>
        </div>
      </div>
      <div className={styles.notificationBody}>
        <div className={styles.notificationDescription}>{description}</div>
      </div>
    </div>
  );
};

export default NotificationComponent;
