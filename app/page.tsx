"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import Link from "next/link";
import logo from "../app/images/logos/logo.png";
import Footer from "./components/Footer/Footer";
import InputContainer from "./components/InputContainer/InputContainer";
import useMultilingualValues from "./hooks/useMultilingualValues";
import {
  showSuccessAlert,
  showWarningAlert,
  showErrorAlert,
} from "./lib/AlertUtils";
import { apiURL, routes, regex } from "@/Constants";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const handleUsernameLogin = (e: any) => {
    setUsernameLogin(e.target.value);
  };

  const handlePasswordLogin = (e: any) => {
    setPasswordLogin(e.target.value);
  };

  const handleSubmitLogin = (e: any) => {
    e.preventDefault();
    if (usernameLogin === "" || passwordLogin === "") {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.loginFailed
      );
    } else if (!regex.email.test(usernameLogin)) {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.invalidEmail
      );
    } else {
      const loginData = {
        username: usernameLogin,
        password: passwordLogin,
      };
      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      };

      fetch(`${apiURL}/login`, requestData)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showSuccessAlert(
              languageValues.alerts.successAlertTitle,
              languageValues.alerts.loginSuccess
            );
          } else {
            showWarningAlert(
              languageValues.alerts.warningAlertTitle,
              languageValues.alerts.loginFailed
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
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
            <h1 className={styles.title}>
              {languageValues.loginPage.loginHeader}
            </h1>
            <InputContainer
              label={languageValues.loginPage.emailLabel}
              type="email"
              id="email"
              name="email"
              onChange={handleUsernameLogin}
            />
            <InputContainer
              label={languageValues.loginPage.passwordLabel}
              type="password"
              id="password"
              name="password"
              onChange={handlePasswordLogin}
            />
            <button
              type="submit"
              className={styles.button}
              onClick={handleSubmitLogin}
            >
              {languageValues.loginPage.loginButton}
            </button>
            <div className={styles.forgotPassword}>
              <Link
                className={styles.forgotPassword}
                href={routes.forgotPassword}
              >
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
