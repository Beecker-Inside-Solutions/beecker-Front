"use client";
import styles from "./LanguageSelector.module.css";
interface LanguageSelectorProps {
  languages: { value: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function LanguageSelector({ languages, onChange }: LanguageSelectorProps) {
  return (
    <select onChange={onChange}
    className={styles.languageSelector}
    >
      {languages.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
