"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import Link from "next/link";
import logo from "../app/images/logos/logo.png";
import Footer from "./components/Footer/Footer";
import useMultilingualValues from "./hooks/useMultilingualValues";
export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  useEffect(() => {
    console.log("Language changed to: ", language);
  }, [language]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <Image
            src={logo}
            alt="logo"
            width={200}
            height={200}
            className={styles.logo}
          />
          <form className={styles.form}>
            <h1 className={styles.title}>
              {languageValues.loginPage.loginHeader}
            </h1>
            <div className={styles.inputContainer}>
              <label htmlFor="email">
                {languageValues.loginPage.emailLabel}
              </label>
              <input type="email" id="email" name="email" />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">
                {languageValues.loginPage.passwordLabel}
              </label>
              <input type="password" id="password" name="password" />
            </div>
            <button type="submit" className={styles.button}>
              {languageValues.loginPage.loginButton}
            </button>
            <div className={styles.forgotPassword}>
              <Link className={styles.forgotPassword} href="/forgotPassword">
                {languageValues.loginPage.forgotPassword}
              </Link>
            </div>
          </form>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
