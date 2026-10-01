import type { ProjectDetail } from "../../lib/portfolio";
import { Localized, T } from "../localized";
import { ProjectFigure, ProjectLink, SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

// Presentation only: both cases retain the existing, shared SANY detail route.
const cases = [
  { number: "01", title: "Weave Welding Vision", subtitle: { zh: "主案例 · 相位感知与高频 RAW 系统设计", en: "Main case · phase-aware high-rate RAW system design" }, tech: ["≈60 Hz Robot", "200 Hz RAW Target", "Ring Buffer", "Time Alignment"] },
  { number: "02", title: "Pre-Weld Positioning", subtitle: { zh: "相关模块 · 点云定位与高度纠偏", en: "Related module · point-cloud positioning and height correction" }, tech: ["3D Camera", "Point Cloud", "TCP Transform", "Robot Integration"] },
];

export function SanyFeaturedExperience({ project }: { project: ProjectDetail }) {
  return (
    <section className={`${styles.section} ${styles.featuredSection}`} id="sany" aria-labelledby="sany-title">
      <SectionLabel number="01" year={project.year}>FEATURED INDUSTRIAL EXPERIENCE</SectionLabel>
      <div className={styles.featuredHeading}>
        <div><h2 id="sany-title">SANY<span>Industrial Welding Robotics</span></h2><p className={styles.subtitle}><T zh="工业焊接机器人视觉与系统工程" en="Vision and systems engineering for industrial welding robots" /></p></div>
        <div className={styles.featuredIntro}><span className={styles.label}><T zh="工业实习经历" en="Industrial internship" /></span><p><Localized text={project.homeDescription ?? project.summary} /></p></div>
      </div>
      <ProjectFigure src={project.homeImage!} alt="SANY industrial robotics system illustration, not an on-site photograph" number="01" caption={{ zh: "工业机器人系统示意 · 非现场实拍", en: "Industrial robotics system illustration · not an on-site photograph" }} />
      <div className={styles.workLabel}><span className={styles.label}>MY WORK</span><span className={styles.label}>02 ENGINEERING CASES</span></div>
      <div className={styles.cases}>
        {cases.map((item) => <article key={item.number} className={styles.case}><span className={styles.caseNumber}>{item.number}</span><h3>{item.title}</h3><p className={styles.subtitle}><Localized text={item.subtitle} /></p><TechList items={item.tech} /><ProjectLink slug={project.slug} caseLink /></article>)}
      </div>
    </section>
  );
}
