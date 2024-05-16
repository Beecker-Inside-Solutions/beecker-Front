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
import ProjectComponent from "../components/ProjectComponent/ProjectComponent";
import { Project } from "../interfaces/IProject";
import AuthRoute from "../components/AuthComponent/AuthComponent";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userName, setUserName] = useState("");

  const { language, setLanguage, languageValues } = useMultilingualValues(
    "en",
    require("@/esValues.json"),
    require("@/enValues.json")
  );

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/users/${localStorage.getItem("userId")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      setUserName(data[0].name);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(
        `${apiURL}/projects/user/${localStorage.getItem("userId")}/bots`,
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
    fetchUser();
  }, [fetchProject]);

  return (
    <>
      <AuthRoute>
        <LateralNavbar
          lateralNavbar={require("@/Constants").lateralNavbarItems}
          logo={logo.src}
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
          <div className={styles.topContainer}>
            <h1 className={styles.title}>
              <div className={styles.welcomeContainer}>
                <p className={styles.welcomeText}>
                  {languageValues.dashboard.welcome},{" "}
                </p>
                <p> {userName}</p>
              </div>
            </h1>
          </div>
          <div className={styles.bottomContainer}>
            {projects.map((project) => (
              <ProjectComponent key={project.idProject} project={project} />
            ))}
          </div>
        </main>
      </AuthRoute>
      <Footer updateLanguage={setLanguage} />
    </>
  );
}
