"use client";
import React, { useState } from "react";
import Link from "next/link";
import { LateralProps } from "@/app/interfaces/ILateralNavbar";
import { routes } from "@/Constants";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import styles from "./LateralNavbar.module.css";
import Image from "next/image";
import useMultilingualValues from "@/app/hooks/useMultilingualValues";
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
  const { languageValues } = useMultilingualValues("en", esValues, enValues);
  return (
    <>
      <button onClick={toggleNavbar} className={styles.toggleButton}>
        {isOpen
          ? languageValues.lateralNavbar.closeMenu
          : languageValues.lateralNavbar.openMenu}
      </button>

      <div className={`${styles.lateralNavbar} ${isOpen ? styles.open : ""}`}>
        <Link href={routes.dashboard}>
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
                      <Link href={link}>
                        <li key={item}>
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
