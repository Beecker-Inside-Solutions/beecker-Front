import React from "react";
import dynamic from "next/dynamic";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { ChangeEvent } from "react";

interface FooterProps {
  updateLanguage: (selectedLanguage: string) => void;
}

export default function Footer({ updateLanguage }: FooterProps) {
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
  ];

  // Handler for language change
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    updateLanguage(selectedLanguage);
  };

  return (
    <footer>
      <LanguageSelector languages={languages} onChange={handleChange} />
    </footer>
  );
}
