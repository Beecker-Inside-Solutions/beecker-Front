import React, { useEffect, useState } from "react";
import styles from "./LanguageSelector.module.css";
import { LanguageSelectorProps } from "@/app/interfaces/ILanguageSelectorProps";
function LanguageSelector({ languages, onChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
      onChange({
        target: { value: savedLanguage },
      } as React.ChangeEvent<HTMLSelectElement>);
    }
  }, [onChange]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setSelectedLanguage(selectedValue);
    localStorage.setItem("selectedLanguage", selectedValue);
    onChange(event);
  };

  return (
    <select
      value={selectedLanguage}
      onChange={handleLanguageChange}
      className={styles.languageSelector}
    >
      {languages.map(({ value, label, icon }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;

/*
          <img src={icon} alt={label} />
*/
