import type { ProjectDetail } from "../../lib/portfolio";
import { Localized } from "../localized";
import { Pipeline, ProjectFigure, ProjectLink, SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

export function RoboMasterProjectSection({ project }: { project: ProjectDetail }) {
  return (
    <section className={styles.section} id="robomaster" aria-labelledby="robomaster-title">
      <SectionLabel number="03" year={project.year}>ROBOTICS</SectionLabel>
      <h2 className={styles.projectTitle} id="robomaster-title">{project.title}</h2>
      <p className={styles.subtitle}><Localized text={project.subtitle} /></p>
      <div className={styles.robotFigure}><ProjectFigure src={project.image!} alt="RoboMaster robot / RoboMaster 机器人" number="03" caption={{ zh: "RoboMaster 机器人与视觉开发", en: "RoboMaster robot and vision development" }} /></div>
      <Pipeline steps={["Armor Detection", "PnP", "EKF / Prediction", "UART / Control"]} />
      <div className={styles.sectionFoot}><TechList items={["ROS 2", "C++", "OpenCV", "Embedded"]} /><ProjectLink slug={project.slug} /></div>
    </section>
  );
}
