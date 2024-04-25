"use client";
import React, { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import useMultilingualValues from "../hooks/useMultilingualValues";
import { apiURL, graphColors } from "@/Constants";
import logo from "../../app/images/logos/logo.png";
import LateralNavbar from "../components/LateralNavbar/LateralNavbar";
import RightBar from "../components/RightBar/RightBar";
import SearchPages from "../components/SearchPages/SearchPages";
import Footer from "../components/Footer/Footer";

import Link from "next/link";
import Modal from "../components/ModalComponent/ModalComponent";
import IndicatorCheckboxGroup from "../components/IndicatorsGroupComponent/IndicatorCheckboxGroup";

interface IProject {
  _id: string;
  projectName: string;
  projectDescription: string;
}

export default function Home() {
  const [projects, setProjects] = useState<IProject[]>([]);

  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/projects/user/${localStorage.getItem("userId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  console.log(projects);
  return (
    <>
      <LateralNavbar
        lateralNavbar={require("@/Constants").lateralNavbarItems}
        logo={logo.src}
        user={{ isAdmin: false }}
      />
      <RightBar
        logoutHeader={languageValues.rightBar.logoutHeader}
        logoutText={languageValues.rightBar.logoutText}
        logoutButton={languageValues.rightBar.logoutButton}
        profileButton={languageValues.rightBar.profileButton}
      />
      <SearchPages
        searchablePages={require("@/Constants").lateralNavbarItems}
        isAdmin={false}
      />
      <main className={styles.main}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.sectionContent}>
          <div className={styles.sectionContentTitle}></div>
          <div className={styles.sectionContentProjects}>
            {projects.map((project) => (
              <div className={styles.projectCard} key={project._id}>
                <Link href={`/projects/${project._id}`}>
                  <p>
                    <h3>{project.projectName}</h3>
                    <p>{project.projectDescription}</p>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer updateLanguage={setLanguage} />
    </>
  );
}
