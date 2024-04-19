import React from "react";
import { INotificationProps } from "@/app/interfaces/INotificationProps";
import styles from "./NotificationComponent.module.css";
const NotificationComponent: React.FC<INotificationProps> = ({
  name,
  description,
  isActive,
}) => {
  return (
    <div className={styles.notificationContaier}>
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
        <div className={styles.rightContainer}>
          <div className={styles.notificationName}>{name}</div>
        </div>
      </div>
      <div className={styles.notificationBody}>
        <div className={styles.notificationDescription}>{description}</div>
      </div>
    </div>
  );
};

export default NotificationComponent;
