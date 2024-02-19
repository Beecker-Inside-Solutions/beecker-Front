
export interface LanguageSelectorProps {
    languages: { value: string; label: string }[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  