import React from "react";
import styles from "./Navbar.module.css";
import SearchPages from "../SearchPages/SearchPages";
import { lateralNavbarItems } from "@/Constants";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <SearchPages searchablePages={lateralNavbarItems}
      isAdmin={false}
      />
    </nav>
  );
};

export default Navbar;
