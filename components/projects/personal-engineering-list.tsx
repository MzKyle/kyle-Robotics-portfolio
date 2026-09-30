import Link from "next/link";
import type { ProjectDetail } from "../../lib/portfolio";
import { T } from "../localized";
import { SectionLabel } from "./project-elements";
import styles from "./projects.module.css";

const descriptions: Record<string, { zh: string; en: string }> = {
  "datascope-studio": { zh: "工程数据可视化", en: "Engineering data visualization" },
  "robot-sim": { zh: "机器人仿真工具", en: "Robot simulation toolkit" },
  mascotmate: { zh: "桌面交互实验", en: "Desktop interaction experiment" },
};

export function PersonalEngineeringList({ projects }: { projects: ProjectDetail[] }) {
  return (
    <section className={`${styles.section} ${styles.personal}`} aria-labelledby="personal-title">
      <SectionLabel number="05">PERSONAL ENGINEERING</SectionLabel>
      <h2 id="personal-title"><T zh="工具、实验与开源工程。" en="Tools, experiments and open-source work." /></h2>
      <ul className={styles.personalList}>{projects.map((project) => <li key={project.slug}><Link href={`/projects/${project.slug}`}><h3>{project.title}</h3><p><T {...(descriptions[project.slug] ?? project.category)} /></p><span aria-hidden="true">→</span></Link></li>)}</ul>
    </section>
  );
}
