"use client";
import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { LateralProps } from "@/app/interfaces/ILateralNavbar";
import { routes } from "@/Constants";
import styles from "./LateralNavbar.module.css";
import { apiURL } from "@/Constants";

const LateralNavbar: React.FC<LateralProps> = ({ lateralNavbar, logo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    isAdmin: false,
    isBeecker: false,
  });

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const fetchUserType = useCallback(async () => {
    try {
      const response = await fetch(`${apiURL}/users/${localStorage.userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      const { Roles_idRole } = data[0];

      switch (Roles_idRole) {
        case 1:
          setUser({ isAdmin: true, isBeecker: true });
          break;
        case 2:
          setUser({ isAdmin: false, isBeecker: true });
          break;
        case 3:
          setUser({ isAdmin: false, isBeecker: false });
          break;
        default:
          setUser({ isAdmin: false, isBeecker: false });
      }
    } catch (error) {
      console.error("Error fetching user type:", error);
      setUser({ isAdmin: false, isBeecker: false });
    }
  }, []);

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
