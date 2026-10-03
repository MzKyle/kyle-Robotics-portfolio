import type { Metadata } from "next";
import Link from "next/link";
import { experiences } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";
export const metadata: Metadata = { title: "工作经历 | 王凯豪", description: "王凯豪在工业焊接机器人、物流体积测量与工业视觉交付中的工作经历。" };

export default function ExperiencePage() {
  return <main><SiteHeader active="experience" /><PageIntro eyebrow={{ zh: "工作经历", en: "EXPERIENCE" }} title={{ zh: "从视觉算法到机器人现场", en: "From vision algorithms to robots in the field" }} description={{ zh: "在工业焊接、物流测量与视觉质检项目中，连接传感器、算法和执行设备，解决系统运行中的实际问题。", en: "Connecting sensors, algorithms and actuators across industrial welding, logistics measurement and visual inspection." }} meta={{ zh: "2025 — 2026 · 机器人软件 · 工业视觉", en: "2025 — 2026 · ROBOTICS · VISION" }} />
    <section className="experience-page section-shell">
      {experiences.map((item, index) => <article className="experience-detail" key={item.company.zh}><div className="experience-side"><span>0{index + 1}</span><small>{item.period}</small><h2><Localized text={item.company} /></h2><p><Localized text={item.role} /></p>{item.kind === "project" && <em><T zh="项目制经历" en="PROJECT-BASED" /></em>}</div><div className="experience-main"><p className="experience-lead"><Localized text={item.summary} /></p><div className="experience-metrics">{item.metrics.map((metric) => <span key={metric.zh}><Localized text={metric} /></span>)}</div>{item.caseSlug && <Link className="experience-case-link" href={`/projects/${item.caseSlug}`}><T zh="查看 Engineering Case" en="View engineering case" /> →</Link>}</div></article>)}
    </section><SiteFooter /></main>;
}
