"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import Link from "next/link";

export default function Home() {
  const [language, setLanguage] = useState("en"); // Default language is English

  // Choose the language values based on the selected language
  const languageValues = language === "es" ? esValues : enValues;

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
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
        <div>
          <button onClick={() => setLanguage(language === "en" ? "es" : "en")}>
            {language === "en" ? "Switch to Spanish" : "Switch to English"}
          </button>
        </div>
      </main>
    </>
  );
}
