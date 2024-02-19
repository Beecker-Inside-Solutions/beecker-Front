import React from "react";
import { ILateralNavbar } from "@/app/interfaces/ILateralNavbar";
import { lateralNavbarItems } from "@/Constants"; // Importing lateralNavbarItems directly
import Link from "next/link";

const LateralNavbar: React.FC = () => {
  return (
    <div>
      <h2>Lateral Navbar</h2>
      <ul>
        {Object.keys(lateralNavbarItems).map((section) => ( // Using lateralNavbarItems instead of lateralNavbar
          <li key={section}>
            <strong>{section}</strong>
            <ul>
              {Object.keys(lateralNavbarItems[section]).map((item) => (
                <li key={item}>
                  <a href={lateralNavbarItems[section][item]}>{item}</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LateralNavbar;
