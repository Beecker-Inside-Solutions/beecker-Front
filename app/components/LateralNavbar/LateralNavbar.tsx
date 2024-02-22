"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LateralProps } from "@/app/interfaces/ILateralNavbar";
import styles from "./LateralNavbar.module.css";
import Image from "next/image";

interface User {
  isAdmin: boolean;
}

const LateralNavbar: React.FC<LateralProps & { user: User }> = ({
  lateralNavbar,
  logo,
  user,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={toggleNavbar} className={styles.toggleButton}>
        {isOpen ? "← Close Menu" : "☰ Open Menu"}
      </button>

      <div className={`${styles.lateralNavbar} ${isOpen ? styles.open : ""}`}>
        <Image
          src={logo || ""}
          alt="Logo"
          width={100}
          height={100}
          className={styles.logo}
        />
        <ul>
          {Object.keys(lateralNavbar).map((section) => {
            const sectionItems = Object.keys(lateralNavbar[section]).filter(
              (item) => {
                const { adminRequired } = lateralNavbar[section][item];
                // Return true if admin is not required or if the user is an admin
                return !adminRequired || user.isAdmin;
              }
            );

            // If there are no items to render in this section, skip rendering the entire section
            if (sectionItems.length === 0) {
              return null;
            }

            return (
              <li key={section}>
                <strong>{section}</strong>
                <ul className={styles.sectionValue}>
                  {sectionItems.map((item) => {
                    const { link, image } = lateralNavbar[section][item];
                    return (
                      <li key={item}>
                        {image && <img src={image} alt="Icon" />}
                        <Link href={link}>{item}</Link>
                      </li>
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
