"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../../../hooks/useMultilingualValues";
import logo from "../../../images/logos/logo.png";
import LateralNavbar from "../../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../../components/RightBar/RightBar";
import { IIncidences } from "@/app/interfaces/IIncidences";
import styles from "./page.module.css";
import Footer from "../../../components/Footer/Footer";
import { statusOptions } from "@/Constants";
import Link from "next/link";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);

  const [incidentsData, setIncidentsData] = useState<IIncidences[]>([]);

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
      
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
