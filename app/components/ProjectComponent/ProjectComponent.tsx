import React, { useState } from "react";
import styles from "./ProjectComponent.module.css";
import { Project } from "@/app/interfaces/IProject";
import Link from "next/link";
import whiteArrowDown from "../../images/icons/whiteArrowDown.png";
import whiteArrowUp from "../../images/icons/whiteArrowUp.png";

interface ProjectComponentProps {
  project: Project;
}

const ProjectComponent: React.FC<ProjectComponentProps> = ({ project }) => {
  const [showBots, setShowBots] = useState(false);

  const toggleBots = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevents click from bubbling to parent elements
    setShowBots(!showBots);
  };

  return (
    <>
      <div
        className={styles.projectComponent}
        onClick={() => setShowBots(!showBots)}
      >
        <div className={styles.topProjectContainer}>
          <div className={styles.leftContainer}>
            <p>{project.projectName}</p>
          </div>
          <div className={styles.rightContainer}>
            <button onClick={toggleBots} aria-expanded={showBots}>
              {showBots ? (
                <img src={whiteArrowUp.src} alt="Arrow Up" />
              ) : (
                <img src={whiteArrowDown.src} alt="Arrow Down" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.botContainer}>
        {showBots && (
          <ul>
            {project.bots.map((bot) => (
              <Link href={`/dashboard/${bot.idBots}`} key={bot.idBots}>
                <li>
                  {bot.botName} - {bot.isExecuting ? "Running" : "Stopped"}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ProjectComponent;
