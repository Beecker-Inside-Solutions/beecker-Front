"use client";
import React, { useState, useEffect } from "react";
import useMultilingualValues from "../../hooks/useMultilingualValues";
import logo from "../../../app/images/logos/logo.png";
import LateralNavbar from "../../components/LateralNavbar/LateralNavbar";
import RightBar from "../../components/RightBar/RightBar";

import styles from "./page.module.css";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(logo.src);
  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) setUserName(storedUserName);
    if (storedProfileImg) setProfileImg(storedProfileImg);
  }, []);
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
        <table className={styles.incidentTable}>
          <thead>
            <tr></tr>
          </thead>
        </table>
      </main>
    </>
  );
}
