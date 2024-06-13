"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import logo from "../../../../images/logos/logo.png";
import useMultilingualValues from "../../../../hooks/useMultilingualValues";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import InputContainer from "../../../../components/InputContainer/InputContainer";
import Footer from "../../../../components/Footer/Footer";
import Link from "next/link";
import { apiURL, routes, regex } from "@/Constants";
import {
  showSuccessAlert,
  showErrorAlert,
  showInfoAlert,
} from "../../../../lib/AlertUtils";
export default function Home({
  params,
}: {
  params: { token: string; idUsers: number };
}) {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  const [recoverySent, setRecoverySent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitRecovery = async (e: any) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        const response = await fetch(`${apiURL}/resetPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: params.token,
            password,
            userId: params.idUsers,
          }),
        });
        if (response.ok) {
          showSuccessAlert(
            languageValues.alerts.successAlertTitle,
            languageValues.alerts.successPassword
          );
          setRecoverySent(true);
          window.location.href = "/";
        } else {
          const data = await response.json();
          showErrorAlert(languageValues.alerts.errorAlertTitle, data.message);
        }
      } catch (error) {
        showErrorAlert(
          languageValues.alerts.errorTitle,
          languageValues.alerts.error
        );
      }
    }
  };

  const validatePassword = () => {
    if (password === "") {
      showErrorAlert(
        languageValues.registerPage.passwordEmptyTitle,
        languageValues.registerPage.passwordEmpty
      );
      return false;
    }
    if (!regex.password.test(password)) {
      showErrorAlert(
        languageValues.registerPage.passwordInvalidTitle,
        languageValues.registerPage.passwordInvalid
      );
      return false;
    }
    if (password !== confirmPassword) {
      showErrorAlert(
        languageValues.registerPage.passwordsNotMatchTitle,
        languageValues.registerPage.passwordsNotMatch
      );
      return false;
    }
    return true;
  };

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
              type="password"
              label={languageValues.registerPage.passwordLabel}
              id="password"
              name="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
            <InputContainer
              type="password"
              label={languageValues.registerPage.confirmPasswordLabel}
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e: any) => setConfirmPassword(e.target.value)}
            />
            <button className={styles.button} onClick={handleSubmitRecovery}>
              {languageValues.recoveryPage.recoveryButton}
            </button>
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
