import React from "react";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { ChangeEvent } from "react";
import { FooterProps } from "@/app/interfaces/IFooterProps";
import { languages } from "@/Constants";
import styles from "./Footer.module.css";

export default function Footer({ updateLanguage }: FooterProps) {
  // Handler for language change
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    updateLanguage(selectedLanguage);
  };

  return (
    <footer
      className={styles.footer}
    >
      <LanguageSelector languages={languages} onChange={handleChange} />
    </footer>
  );
}
