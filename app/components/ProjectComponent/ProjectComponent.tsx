import React, { useState } from "react";
import styles from "./ProjectComponent.module.scss";
import { Project } from "@/app/interfaces/IProject";
import Link from "next/link";
import whiteArrowDown from "../../images/icons/whiteArrowDown.png";
import whiteArrowUp from "../../images/icons/whiteArrowUp.png";

interface ProjectComponentProps {
  project: Project;
}

const ProjectComponent: React.FC<ProjectComponentProps> = ({ project }) => {
  return (
    <>
      <div className={styles.container}>
        <details className={styles.details}>
          <summary className={styles.summary}>
            <p>{project.projectName}</p>
          </summary>
          <ul className={styles.unoredList}>
            {project.bots.length > 0 ? (
              project.bots.map((bot) => (
                <Link href={`/dashboard/${bot.idBots}`} key={bot.idBots}>
                  <li>
                    <span className={styles.leftContainerBots}>
                      {bot.botName}
                    </span>
                    <div className={styles.rightContainerBots}>
                      <p>{bot.isExecuting ? "Running" : "Stopped"}</p>
                    </div>
                  </li>
                </Link>
              ))
            ) : (
              <p className={styles.noBots}>No bots</p>
            )}
          </ul>
        </details>
      </div>
    </>
  );
};

export default ProjectComponent;
