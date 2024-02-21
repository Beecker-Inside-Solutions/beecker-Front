import React, { useState } from "react";
import Link from "next/link";
import styles from "./SearchPages.module.css";

interface PageData {
  adminRequired?: boolean;
  link?: string;
  image?: string;
  [key: string]: any;
}

interface CategoryData {
  [key: string]: PageData;
}

interface SearchablePages {
  [key: string]: CategoryData;
}

interface SearchPagesProps {
  searchablePages: SearchablePages;
  isAdmin: boolean; // Add isAdmin prop
}

const SearchPages = ({ searchablePages, isAdmin }: SearchPagesProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter pages based on search query
  const filteredPages = Object.keys(searchablePages).reduce(
    (acc: CategoryData, category: string) => {
      acc[category] = Object.keys(searchablePages[category])
        .filter((page) =>
          page.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reduce((pageAcc: CategoryData, page: string) => {
          const pageData = searchablePages[category][page];
          // Check if page requires admin and user is admin
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
        placeholder="Search"
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
