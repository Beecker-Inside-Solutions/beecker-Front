import React, { useState, ChangeEvent, FormEvent } from "react";

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
  placeholder: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchComponent;
