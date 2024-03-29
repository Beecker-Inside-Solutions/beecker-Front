import React, { useState, ChangeEvent, FormEvent } from "react";
import styles from "./SearchComponent.module.css";

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
  placeholder: string;
  searchPlaceholder?: string; // Make the prop optional
  clearPlaceholder?: string; // Make the prop optional
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  placeholder,
  searchPlaceholder,
  clearPlaceholder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        {searchPlaceholder || "Search"}
      </button>
      <button
        type="button"
        className={styles.clearButton}
        onClick={handleClear}
      >
        {clearPlaceholder || "Clear"}
      </button>
    </form>
  );
};

export default SearchComponent;
