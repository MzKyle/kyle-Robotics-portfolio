import type { ReactNode } from "react";
import styles from "./projects.module.css";

export function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className={styles.sectionLabel}><span>{number}</span><span>{children}</span></div>;
}

export function TechList({ items }: { items: string[] }) {
  return <ul className={styles.techList}>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
