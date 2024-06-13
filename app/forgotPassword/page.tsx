"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import logo from "../../app/images/logos/logo.png";
import useMultilingualValues from "../hooks/useMultilingualValues";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import InputContainer from "../components/InputContainer/InputContainer";
import Footer from "../components/Footer/Footer";
import Link from "next/link";
import { apiURL, routes, regex } from "@/Constants";
import  { showSuccessAlert, showWarningAlert, showErrorAlert } from "../lib/AlertUtils";
export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  const [recoverySent, setRecoverySent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmitRecovery = (e: any) => {
    e.preventDefault();
    if (email === "") {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.emptyFields,
      );
    }else if (!regex.email.test(email)) {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.invalidEmail,
      );
    }else {
      const recoveryData = {
        email: email,
      };
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recoveryData),
      };
      fetch(`${apiURL}/forgot`, requestData)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            showSuccessAlert(
              languageValues.alerts.successAlertTitle,
              languageValues.alerts.recoveryEmailSent,
            );
            setRecoverySent(true);
          } else {
            showErrorAlert(
              languageValues.alerts.errorAlertTitle,
              languageValues.alerts.recoveryEmailFailed,
            );
          }
        })
        .catch(() => {
          showErrorAlert(
            languageValues.alerts.errorAlertTitle,
            languageValues.alerts.recoveryEmailFailed,
          );
        });
    }
  };

  useEffect(() => {
    if (recoverySent) {
      setTimeout(() => {
        setRecoverySent(false);
        window.location.href = "/";
      }, 3000);
    }
  }, [recoverySent]);

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          <Image
            src={logo}
            alt="logo"
            width={300}
            height={300}
            className={styles.logo}
          />
          <form className={styles.form}>
            <h1>{languageValues.recoveryPage.recoveryHeader}</h1>
            <InputContainer
              type="email"
              label={languageValues.recoveryPage.emailLabel}
              id="email"
              name="email"
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <button className={styles.button} onClick={handleSubmitRecovery}>
              {languageValues.recoveryPage.recoveryButton}
            </button>
            {recoverySent && <p>{languageValues.recoveryPage.emailSent}</p>}
          </form>
          <Link href={routes.login} className={styles.backToLogin}>
            {languageValues.recoveryPage.backToLogin}
          </Link>
        </div>
      </main>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
