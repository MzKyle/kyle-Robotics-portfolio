import Image from "next/image";
import Link from "next/link";
import { projectNames } from "../../lib/project-presentation";
import { T } from "../localized";
import { SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

const cases = [
  { number: "01", zh: "运动相位与时间域稳像", en: "Phase-aware welding vision", href: "/projects/sany-welding-robotics/technical" },
  { number: "02", zh: "前置扫描与高度预读", en: "Pre-scan height correction", href: "/projects/sany-welding-robotics/pre-weld-localization" },
];

export function SanyFeaturedExperience() {
  return <section className={styles.featuredExperience} id="sany" aria-labelledby="sany-title">
    <SectionLabel number="01">SANY / INDUSTRIAL ROBOTICS</SectionLabel>
    <div className={styles.featuredCard}>
      <figure className={styles.featuredVisual}><Image src="/images/projects/welding-vision-concept-v3.webp" alt="AI 生成的通用焊接机器人视觉场景，非项目实拍" width={900} height={600} unoptimized priority /></figure>
      <div className={styles.featuredInformation}>
        <span className={styles.eyebrow}>2026.03 — 2026.08 / ALGORITHM ENGINEER</span>
        <h2 id="sany-title"><T {...projectNames["sany-welding-robotics"]} /></h2>
        <p className={styles.featuredSummary}><T zh="把设备时间轴、RAW 采集与机器人运动关联起来，让摆动中的熔池成为稳定的观测。" en="Connecting device timelines, RAW acquisition and robot motion to observe the weld pool consistently through weaving." /></p>
        <p className={styles.featuredResult}><T zh="120 → 200 Hz RAW · ±0.5 mm 摆弧焊纠偏" en="120 → 200 Hz RAW · ±0.5 mm weave correction" /></p>
        <div className={styles.featuredCases}>{cases.map(item => <Link href={item.href} className={styles.featuredCase} key={item.number}><span>{item.number}</span><span><strong><T zh={item.zh} en={item.en} /></strong></span><span aria-hidden="true">→</span></Link>)}</div>
        <TechList items={["C++", "ROS 2", "RAW / ISP", "3D Vision"]} />
        <Link className={styles.featuredCta} href="/projects/sany-welding-robotics"><T zh="阅读项目概览" en="Read the case study" /><span aria-hidden="true">→</span></Link>
      </div>
    </div>
  </section>;
}
