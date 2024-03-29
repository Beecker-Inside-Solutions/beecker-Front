import React, { useState } from "react";
import Link from "next/link";
import esValues from "@/esValues.json";
import enValues from "@/enValues.json";
import styles from "./SearchPages.module.css";
import { SearchPagesProps, CategoryData } from "@/app/interfaces/IPageData";
import useMultilingualValues from "@/app/hooks/useMultilingualValues";

const SearchPages = ({ searchablePages, isAdmin }: SearchPagesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    esValues,
    enValues
  );
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredPages = Object.keys(searchablePages).reduce(
    (acc: CategoryData, category: string) => {
      acc[category] = Object.keys(searchablePages[category])
        .filter((page) =>
          page.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reduce((pageAcc: CategoryData, page: string) => {
          const pageData = searchablePages[category][page];
          if (!pageData.adminRequired || isAdmin) {
            pageAcc[page] = pageData;
          }
          return pageAcc;
        }, {});
      return acc;
    },
    {}
  );

  return (
    <div className={styles.searchPages}>
      <input
        type="text"
        placeholder={languageValues.searchBar.placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        className={styles.searchInput}
      />
      {searchQuery &&
        Object.keys(filteredPages).map((category) => (
          <div key={category} className={styles.suggestedPages}>
            <ul className={styles.category}>
              {Object.keys(filteredPages[category]).map((page) => (
                <Link href={filteredPages[category][page].link} key={page}>
                  <li className={styles.page}>
                    {filteredPages[category][page].image && (
                      <img
                        src={filteredPages[category][page].image}
                        alt="Icon"
                      />
                    )}
                    {page}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default SearchPages;
