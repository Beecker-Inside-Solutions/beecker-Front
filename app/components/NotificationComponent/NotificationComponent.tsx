import React from "react";
import { INotificationProps } from "@/app/interfaces/INotificationProps";
import styles from "./NotificationComponent.module.css";

const NotificationComponent: React.FC<INotificationProps> = ({
  idNotifications,
  name,
  description,
  isActive,
}) => {
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
          <div className={styles.notificationName}>{name}</div>
        </div>
        <div className={styles.rightContainer}>
          <button
            className={styles.deleteButton}
            onClick={() => console.log("closeFunction", idNotifications)}
          >
            X
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
