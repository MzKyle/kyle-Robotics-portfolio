import type { Metadata } from "next";
import { experiences } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";
export const metadata: Metadata = { title: "工作经历 | 王凯豪", description: "王凯豪在工业焊接机器人、物流体积测量与工业视觉交付中的工作经历。" };

export default function ExperiencePage() {
  return <main><SiteHeader active="experience" /><PageIntro eyebrow={{ zh: "工作经历", en: "EXPERIENCE" }} title={{ zh: "在真实设备与工业现场交付结果", en: "Delivering results on real hardware and industrial sites" }} description={{ zh: "经历覆盖焊接机器人、物流 3D 测量与项目制工业视觉交付，工作内容贯穿传感器数据、坐标转换、算法部署、设备控制与现场排障。", en: "Experience across welding robotics, 3D logistics measurement, and project-based industrial vision delivery—from sensor data and transforms to deployment, device control, and field troubleshooting." }} meta={{ zh: "2025 — 至今 · 机器人软件 · 工业视觉", en: "2025 — PRESENT · ROBOTICS · VISION" }} />
    <section className="experience-page section-shell">
      {experiences.map((item, index) => <article className="experience-detail" key={item.company.zh}><div className="experience-side"><span>0{index + 1}</span><small>{item.period}</small><h2><Localized text={item.company} /></h2><p><Localized text={item.role} /></p>{item.kind === "project" && <em><T zh="项目制经历" en="PROJECT-BASED" /></em>}</div><div className="experience-main"><p className="experience-lead"><Localized text={item.summary} /></p><div className="experience-metrics">{item.metrics.map((metric) => <span key={metric.zh}><Localized text={metric} /></span>)}</div><details className="experience-more"><summary><span><T zh="查看职责与成果" en="View responsibilities and outcomes" /></span><b aria-hidden="true">+</b></summary><ul>{item.details.map((detail) => <li key={detail.zh}><Localized text={detail} /></li>)}</ul></details></div></article>)}
    </section><SiteFooter /></main>;
}
