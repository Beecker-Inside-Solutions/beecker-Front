"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../hooks/useMultilingualValues";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import Footer from "../components/Footer/Footer";
import Link from "next/link";
import { routes } from "@/Constants";
import logo from "../../app/images/logos/logo.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import { lateralNavbarItems } from "@/Constants";
import RightBar from "../components/RightBar/RightBar";
import SearchPages from "../components/SearchPages/SearchPages";
import AuthRoute from "../components/AuthComponent/AuthComponent";
export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  const [userName, setUserName] = useState("");
  const [getProfileImg, setProfileImg] = useState("");
  useEffect(() => {
    const storedUserName = localStorage.getItem("first_name");
    const storedProfileImg = localStorage.getItem("profile_img");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (storedProfileImg) {
      setProfileImg(storedProfileImg);
    } else {
      setProfileImg(logo.src);
    }
  }, []);

  return (
    <>
      <AuthRoute>
        <LateralNavbar
          lateralNavbar={lateralNavbarItems}
          logo={logo.src}
          user={{ isAdmin: false }}
        />
        <RightBar
          profileName={userName}
          profileImageUrl={getProfileImg}
          logoutHeader={languageValues.rightBar.logoutHeader}
          logoutText={languageValues.rightBar.logoutText}
          logoutButton={languageValues.rightBar.logoutButton}
          profileButton={languageValues.rightBar.profileButton}
        />

        <SearchPages searchablePages={lateralNavbarItems} isAdmin={false} />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.topContainer}>
              <h1>
                {languageValues.dashboard.welcome}, {userName}
              </h1>
            </div>
            <div className={styles.bottomContainer}>
              <h1>b</h1>
            </div>
          </div>
        </main>
        <Footer updateLanguage={setLanguage} />
      </AuthRoute>
    </>
  );
}
