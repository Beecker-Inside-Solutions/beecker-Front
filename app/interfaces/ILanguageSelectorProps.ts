
export interface LanguageSelectorProps {
    languages: { value: string; icon?:string; label: string }[];
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }
  