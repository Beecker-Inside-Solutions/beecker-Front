import React from "react";
import Link from "next/link";
import { LateralProps } from "@/app/interfaces/ILateralNavbar";
import styles from "./LateralNavbar.module.css";
import Image from "next/image";

const LateralNavbar: React.FC<LateralProps> = ({ lateralNavbar, logo }) => {
  return (
    <div className={styles.lateralNavbar}>
      <Image
        src={logo || ""}
        alt="Logo"
        width={100}
        height={100}
        className={styles.logo}
      />
      <ul>
        {Object.keys(lateralNavbar).map((section) => (
          <li key={section}>
            <strong>{section}</strong>
            <ul className={styles.sectionValue}>
              {Object.keys(lateralNavbar[section]).map((item) => (
                <li key={item}>
                  {lateralNavbar[section][item].image && (
                    <img src={lateralNavbar[section][item].image} alt="Icon" />
                  )}
                  <Link href={lateralNavbar[section][item].link}>{item}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LateralNavbar;
