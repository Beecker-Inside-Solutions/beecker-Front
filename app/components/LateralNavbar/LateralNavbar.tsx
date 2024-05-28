"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { LateralProps } from "@/app/interfaces/ILateralNavbar";
import { routes } from "@/Constants";
import styles from "./LateralNavbar.module.css";
import useFetchUserType from "@/app/hooks/useFetchUserType/useFetchUserType";

const LateralNavbar: React.FC<LateralProps> = ({ lateralNavbar, logo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const { user, fetchUserType } = useFetchUserType();

  useEffect(() => {
    fetchUserType();
  }, [fetchUserType]);

  return (
    <>
      <button onClick={toggleNavbar} className={styles.toggleButton}>
        {isOpen ? (
          <p className={styles.openCloseButton}>←</p>
        ) : (
          <p className={styles.openCloseButton}>☰</p>
        )}
      </button>

      <div className={`${styles.lateralNavbar} ${isOpen ? styles.open : ""}`}>
        <Link href={routes.projects}>
          <img src={logo || ""} alt="Logo" className={styles.logo} />
        </Link>
        <ul>
          {Object.keys(lateralNavbar).map((section) => {
            const sectionItems = Object.keys(lateralNavbar[section]).filter(
              (item) => {
                const { adminRequired } = lateralNavbar[section][item];
                return !adminRequired || user.isAdmin;
              }
            );

            if (sectionItems.length === 0) {
              return null;
            }

            return (
              <li key={section}>
                <p className={styles.sectionTitle}>{section}</p>
                <ul className={styles.sectionValue}>
                  {sectionItems.map((item) => {
                    const { link, image } = lateralNavbar[section][item];
                    return (
                      <Link href={link} key={item}>
                        <li>
                          {image && <img src={image} alt="Icon" />}
                          {item}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default LateralNavbar;
