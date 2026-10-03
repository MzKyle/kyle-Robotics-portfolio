import { T } from "../localized";
import styles from "./projects.module.css";

export function ProjectsIntro() {
  return (
    <section className={styles.projectsIntro} aria-labelledby="projects-title">
      <span className={styles.eyebrow}>PROJECTS / ENGINEERING WORK</span>
      <h1 id="projects-title"><T zh="机器人、视觉与工业软件。" en="Robotics, vision and industrial software." /></h1>
      <div className={styles.introFooter}>
        <p><T zh="构建工业机器人、机器视觉与三维感知系统。" en="Engineering industrial robotics, machine vision and 3D perception systems." /></p>
        <span>Robotics · Industrial Vision · C++ / ROS 2 · 3D Vision</span>
      </div>
    </section>
  );
}
