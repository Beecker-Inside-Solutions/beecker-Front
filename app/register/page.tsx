"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Footer from "../components/Footer/Footer";
import useMultilingualValues from "../hooks/useMultilingualValues";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import logo from "../images/logos/logo.png";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );
  return (
    <>
      <main className={styles.main}>
        <div className={styles.leftContainer}>
          <img src={logo.src} alt="logo" className={styles.logo} />
          <form className={styles.form}>
            <div className={styles.leftFormContainer}>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="name">
                    {languageValues.registerPage.nameLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder={languageValues.registerPage.nameLabel}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="email">
                    {languageValues.registerPage.emailLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={languageValues.registerPage.emailLabel}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="password">
                    {languageValues.registerPage.passwordLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder={languageValues.registerPage.passwordLabel}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
            <div className={styles.rightFormContainer}>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="lastName">
                    {languageValues.registerPage.lastNameLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={languageValues.registerPage.lastNameLabel}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="dateOfBirth">
                    {languageValues.registerPage.dateOfBirthLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    placeholder={languageValues.registerPage.dateOfBirthLabel}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="confirmPassword">
                    {languageValues.registerPage.confirmPasswordLabel}
                  </label>
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={
                      languageValues.registerPage.confirmPasswordLabel
                    }
                    className={styles.input}
                  />
                </div>
              </div>
            </div>
          </form>
          <button className={styles.button}>
            {languageValues.registerPage.registerButton}
          </button>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.textWrapper}>
            <p className={styles.representationText}>
              {languageValues.registerPage.representationText}
            </p>
          </div>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
