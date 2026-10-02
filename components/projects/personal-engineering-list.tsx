import Link from "next/link";
import type { ProjectDetail } from "../../lib/portfolio";
import { T } from "../localized";
import { SectionLabel } from "./project-elements";
import styles from "./projects.module.css";

const otherWork = [
  { slug: "robot-sim", category: "Robotics Simulation" },
  { slug: "datascope-studio", category: "C++ Desktop Tooling" },
  { slug: "mascotmate", category: "Desktop Application" },
];

export function PersonalEngineeringList({ projects }: { projects: ProjectDetail[] }) {
  return (
    <section className={styles.personalListSection} aria-labelledby="personal-title">
      <SectionLabel number="03">OTHER ENGINEERING WORK</SectionLabel>
      <h2 id="personal-title"><T zh="其他工程实践" en="Other engineering work" /></h2>
      <ul className={styles.personalList}>
        {otherWork.map(({ slug, category }) => {
          const project = projects.find((item) => item.slug === slug);
          if (!project) return null;
          return <li key={slug}><Link href={`/projects/${slug}`}><strong>{project.title}</strong><span>{category}</span><span aria-hidden="true">→</span></Link></li>;
        })}
      </ul>
    </section>
  );
}
