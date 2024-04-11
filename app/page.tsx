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
    if (emailLogin === " " || passwordLogin === " ") {
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
        },
        body: JSON.stringify(loginData),
      };

      fetch(`${apiURL}/login/`, requestData)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.message === "login success") {
            showSuccessAlert(
              languageValues.alerts.successAlertTitle,
              languageValues.alerts.loginSuccess
            );
            window.location.href = routes.dashboard;
            Object.entries(data).forEach(([key, value]) => {
              if (localStorageKeys.hasOwnProperty(key)) {
                localStorage.setItem(localStorageKeys[key], value as string);
                console.log(
                  `Key: ${key}, Value: ${value}, Local Storage Key: ${localStorageKeys[key]}`
                );
              }
            });
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
            <button type="submit" className={styles.button}>
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
