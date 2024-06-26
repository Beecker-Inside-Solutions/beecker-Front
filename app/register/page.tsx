"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import Footer from "../components/Footer/Footer";
import useMultilingualValues from "../hooks/useMultilingualValues";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import Link from "next/link";
import logo from "../images/logos/logo.png";
import { apiURL, routes, regex } from "@/Constants";
import { IUser } from "../interfaces/IUser";
import {
  showSuccessAlert,
  showWarningAlert,
  showErrorAlert,
} from "../lib/AlertUtils";

export default function Home() {
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );
  const [user, setUser] = useState<IUser>({
    email: "",
    password: "",
    name: "",
    lastName: "",
    dateOfBirth: "",
    userTypeId: 2,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    name: "",
    lastName: "",
    dateOfBirth: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
    }

    // Reset errors
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Validate the input fields
    if (name === "email" && !regex.email.test(value)) {
      setErrors((prev) => ({ ...prev, email: languageValues.errorsAlerts.invalidEmail }));
    } else if (name === "password" && !regex.password.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: languageValues.errorsAlerts.invalidPassword,
      }));
    } else if (
      (name === "name" || name === "lastName") &&
      !regex.name.test(value)
    ) {
      setErrors((prev) => ({ ...prev, [name]: languageValues.errorsAlerts.invalidName }));
    } else if (name === "dateOfBirth" && !isValidDate(value)) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: languageValues.errorsAlerts.invalidDate,
      }));
    } else if (name === "confirmPassword" && value !== user.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: languageValues.errorsAlerts.passwordsDontMatch,
      }));
    }
  };

  const isValidDate = (dateString: string) => {
    const selectedDate = new Date(dateString);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    return selectedDate <= maxDate && selectedDate >= minDate;
  };

  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => error === "") &&
      Object.values(user).every((value) => value !== "") &&
      confirmPassword === user.password
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid()) {
      showErrorAlert("Please ensure all fields are filled correctly.", "");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(`${apiURL}/register`, requestOptions);
      if (!response.ok) throw new Error("Network response was not ok");
      await response.json();
      showSuccessAlert("Registration successful!", "");
      window.location.href = "/";
    } catch (error) {
      console.error("Error registering user:", error);
      showErrorAlert("Failed to register user", "");
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.leftContainer}>
          <img src={logo.src} alt="logo" className={styles.logo} />
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
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
                      value={user.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className={styles.error}>{errors.name}</p>
                    )}
                  </div>
                </div>
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
                      value={user.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <p className={styles.error}>{errors.lastName}</p>
                    )}
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
                      value={user.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className={styles.error}>{errors.password}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.rightFormContainer}>
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
                      value={user.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className={styles.error}>{errors.email}</p>
                    )}
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
                      max={new Date().toISOString().split("T")[0]} // Sets the max date attribute to today
                      value={user.dateOfBirth}
                      onChange={handleChange}
                    />
                    {errors.dateOfBirth && (
                      <p className={styles.error}>{errors.dateOfBirth}</p>
                    )}
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
                      value={confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && (
                      <p className={styles.error}>{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button
              className={styles.button}
              type="submit"
              disabled={!isFormValid()}
            >
              {languageValues.registerPage.registerButton}
            </button>
          </form>
          <div className={styles.returnLogin}>
            <Link className={styles.register} href={routes.login}>
              {languageValues.registerPage.backToLogin}
            </Link>
          </div>
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
