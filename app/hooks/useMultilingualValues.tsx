import { useState, useEffect } from "react";
import { Values } from "../interfaces/IValues";


function useMultilingualValues(defaultLanguage: string, esValues: Values, enValues: Values) {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const [languageValues, setLanguageValues] = useState<Values>(defaultLanguage === "en" ? enValues : esValues);

  useEffect(() => {
    const values: Values = language === "es" ? { ...esValues } : { ...enValues };
    setLanguageValues(prevValues => ({
        ...prevValues,
        ...values
    }));
  }, [language, esValues, enValues]);

  return { language, setLanguage, languageValues };
}

export default useMultilingualValues;
