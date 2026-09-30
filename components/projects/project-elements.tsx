import Link from "next/link";
import Image from "next/image";
import type { LocalizedText } from "../../lib/portfolio";
import { Localized, T } from "../localized";
import styles from "./projects.module.css";

export function SectionLabel({ number, children, year }: { number: string; children: string; year?: string }) {
  return <div className={styles.sectionLabel}><p><span>{number}</span> / {children}</p>{year && <span>{year}</span>}</div>;
}

export function ProjectLink({ slug, caseLink = false }: { slug: string; caseLink?: boolean }) {
  return <Link className={styles.projectLink} href={`/projects/${slug}`}><T zh={caseLink ? "查看案例" : "查看项目"} en={caseLink ? "View case" : "View project"} /><span aria-hidden="true">→</span></Link>;
}

export function TechList({ items }: { items: string[] }) {
  return <ul className={styles.techList} aria-label="技术 / Technologies">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function ProjectFigure({ src, alt, number, caption, device = false }: { src: string; alt: string; number: string; caption: LocalizedText; device?: boolean }) {
  return (
    <figure className={styles.figure}>
      <div className={`${styles.imageFrame} ${device ? styles.deviceFrame : ""}`}>
        <Image src={src} alt={alt} fill unoptimized sizes={device ? "(max-width: 760px) 100vw, 55vw" : "(max-width: 1320px) 100vw, 1256px"} />
      </div>
      <figcaption><span>FIG. {number}</span><Localized text={caption} /></figcaption>
    </figure>
  );
}

export function Pipeline({ steps, vertical = false }: { steps: string[]; vertical?: boolean }) {
  return <ol className={`${styles.pipeline} ${vertical ? styles.pipelineVertical : ""}`} aria-label="技术流程 / Technical pipeline">{steps.map((step, index) => <li key={step}><span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span><span>{step}</span>{index < steps.length - 1 && <span className={styles.pipelineArrow} aria-hidden="true">{vertical ? "↓" : "→"}</span>}</li>)}</ol>;
}
