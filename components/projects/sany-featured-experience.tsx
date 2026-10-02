import Image from "next/image";
import Link from "next/link";
import type { ProjectDetail } from "../../lib/portfolio";
import { T } from "../localized";
import { SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

const cases = [
  { number: "01", zh: "摆弧焊视觉稳像", en: "Phase-aware Welding Vision", href: "/projects/sany-welding-robotics/technical" },
  { number: "02", zh: "焊前视觉定位", en: "Pre-weld Localization", href: "/projects/sany-welding-robotics/pre-weld-localization" },
];

export function SanyFeaturedExperience({ project }: { project: ProjectDetail }) {
  return (
    <section className={styles.featuredExperience} id="sany" aria-labelledby="sany-title">
      <SectionLabel number="01">FEATURED EXPERIENCE</SectionLabel>
      <div className={styles.featuredCard}>
        <figure className={styles.featuredVisual}>
          <div className={styles.featuredImage}>
            <Image src={project.homeImage!} alt="工业焊接机器人与三维视觉系统示意图" fill unoptimized sizes="(max-width: 800px) 100vw, 56vw" priority />
          </div>
          <figcaption><T zh="工业机器人系统示意 · 非现场实拍" en="Industrial robotics illustration · not an on-site photograph" /></figcaption>
        </figure>
        <div className={styles.featuredInformation}>
          <span className={styles.eyebrow}>SANY ROBOTICS / INDUSTRIAL EXPERIENCE</span>
          <h2 id="sany-title"><T zh="工业焊接机器人软件" en="Industrial Welding Robotics" /></h2>
          <p className={styles.featuredSummary}><T zh="负责焊接机器人视觉链路中的摆弧焊稳像与焊前定位模块，将感知结果接入机器人系统。" en="Built vision modules for weave welding stabilization and pre-weld localization within an industrial robot system." /></p>
          <div className={styles.featuredCases} aria-label="SANY engineering cases">
            {cases.map((item) => (
              <Link href={item.href} className={styles.featuredCase} key={item.number}>
                <span>{item.number}</span>
                <span><strong><T zh={item.zh} en={item.en} /></strong><small className="lang-zh">{item.en}</small></span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
          <TechList items={["C++", "ROS 2", "Industrial Vision"]} />
          <Link className={styles.featuredCta} href="/projects/sany-welding-robotics"><T zh="探索完整经历" en="Explore experience" /><span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
