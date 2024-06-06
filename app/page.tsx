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

  const [emailLogin, setemailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const handleemailLogin = (e: any) => {
    setemailLogin(e.target.value);
  };

  const handlePasswordLogin = (e: any) => {
    setPasswordLogin(e.target.value);
  };

  const localStorageKeys = {
    token: "token",
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    phone: "phone",
    profileImg: "profile_img",
  } as { [key: string]: string };

  const handleSubmitLogin = (e: any) => {
    e.preventDefault();
    if (emailLogin.trim() === "" || passwordLogin.trim() === "") {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.loginFailed
      );
    } else if (!regex.email.test(emailLogin)) {
      showErrorAlert(
        languageValues.alerts.errorAlertTitle,
        languageValues.alerts.invalidEmail
      );
    } else {
      const loginData = {
        email: emailLogin,
        password: passwordLogin,
      };

      const requestData = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(loginData),
      };

      fetch(`${apiURL}/login`, requestData)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message === "Login successful") {
            showSuccessAlert(
              languageValues.alerts.successAlertTitle,
              languageValues.alerts.loginSuccess
            );
            window.location.href = routes.projects;
            Object.entries(data).forEach(([key, value]) => {
              const localStorageKeys: { [key: string]: string } = {
                token: "token",
                userId: "userId",
              };
              if (localStorageKeys.hasOwnProperty(key)) {
                localStorage.setItem(localStorageKeys[key], String(value));
              }
            });
          } else if (data.message === "invalid password") {
            showWarningAlert(
              languageValues.alerts.warningAlertTitle,
              languageValues.alerts.invalidPassword
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
          showErrorAlert(
            languageValues.alerts.errorAlertTitle,
            languageValues.alerts.loginFailed
          );
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
          <form className={styles.form} onSubmit={handleSubmitLogin}>
            <h1 className={styles.title}>
              {languageValues.loginPage.loginHeader}
            </h1>
            <InputContainer
              label={languageValues.loginPage.emailLabel}
              type="email"
              id="email"
              name="email"
              onChange={handleemailLogin}
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
              className={`${styles.button} ${
                emailLogin.trim() === "" ||
                passwordLogin.trim() === "" ||
                !regex.email.test(emailLogin)
                  ? styles.disabled
                  : ""
              }`}
              disabled={
                emailLogin.trim() === "" ||
                passwordLogin.trim() === "" ||
                !regex.email.test(emailLogin)
              }
            >
              {languageValues.loginPage.loginButton}
            </button>
            <div className={styles.forgotPasswordContainer}>
              <Link className={styles.register} href={routes.register}>
                {languageValues.loginPage.register}
              </Link>
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
