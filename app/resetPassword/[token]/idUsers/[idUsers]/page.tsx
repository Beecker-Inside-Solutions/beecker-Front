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
  showWarningAlert,
  showErrorAlert,
} from "../../../../lib/AlertUtils";
export default function Home({
  params,
}: {
  params: { token: string; idUser: number };
}) {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );

  const [recoverySent, setRecoverySent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmitRecovery = (e: any) => {
    e.preventDefault();
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
