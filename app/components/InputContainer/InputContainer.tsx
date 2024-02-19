import React from "react";
import styles from "./inputContainer.module.css";
import { InputProps } from "@/app/interfaces/IInputProps";

const InputContainer: React.FC<InputProps> = ({
  label,
  type,
  id,
  name,
  onChange,
}) => {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} name={name} onChange={onChange} />
    </div>
  );
};

export default InputContainer;
