import type { ProjectDetail } from "../../lib/portfolio";
import { Localized } from "../localized";
import { Pipeline, ProjectFigure, ProjectLink, SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

export function WaterbagProjectSection({ project }: { project: ProjectDetail }) {
  return (
    <section className={styles.section} id="waterbag" aria-labelledby="waterbag-title">
      <SectionLabel number="02" year={project.year}>INDUSTRIAL VISION</SectionLabel>
      <h2 className={styles.projectTitle} id="waterbag-title">{project.title}</h2>
      <p className={styles.subtitle}><Localized text={project.subtitle} /></p>
      <div className={styles.waterbagLayout}>
        <ProjectFigure src={project.image!} alt="Waterbag inspection device / 工业水样袋缺陷检测装置实拍" number="02" caption={project.imageNote} device />
        <div className={styles.waterbagCopy}>
          <Pipeline steps={["Capture", "Inspection", "Classification", "Sorting", "Traceability"]} vertical />
          <TechList items={project.homeTech ?? project.tech.slice(0, 4)} />
          <p className={styles.description}><Localized text={project.homeDescription ?? project.summary} /></p>
          <ProjectLink slug={project.slug} />
        </div>
      </div>
    </section>
  );
}
