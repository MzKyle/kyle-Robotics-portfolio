import Link from "next/link";
import type { Metadata } from "next";
import { flagshipProjects, personalProjects } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";

export const metadata: Metadata = {
  title: "工程案例 | 王凯豪",
  description: "工业焊接机器人、工业视觉、机器人闭环与三维视觉工程案例，以及个人开源工程。",
};

export default function ProjectsPage() {
  return (
    <main>
      <SiteHeader active="projects" />
      <PageIntro
        eyebrow={{ zh: "工程案例", en: "ENGINEERING CASES" }}
        title={{ zh: "从系统问题到工程证据", en: "From system problems to engineering evidence" }}
        description={{ zh: "旗舰案例围绕职责、架构、关键问题、设计决策和结果展开；个人项目作为软件工程与开源能力的补充。", en: "Flagship cases focus on ownership, architecture, hard problems, decisions, and outcomes. Personal projects complement them with software and open-source engineering." }}
        meta={{ zh: "工业机器人 · 工业视觉 · 机器人闭环 · 三维视觉", en: "INDUSTRIAL ROBOTICS · VISION · CONTROL · 3D" }}
      />

      <section className="project-flagships section-shell">
        <div className="engineering-section-head"><div><span>01 / FLAGSHIP ENGINEERING CASES</span><h2><T zh="核心工程案例" en="Flagship engineering cases" /></h2></div><p><T zh="四个案例分别证明工业机器人系统、完整工业视觉交付、机器人视觉闭环与三维几何算法能力。" en="Four cases cover industrial robotics systems, end-to-end vision delivery, closed-loop robot vision, and 3D geometry." /></p></div>
        <div className="project-flagship-grid">
          {flagshipProjects.map((project) => <Link className={`project-flagship-card project-flagship-${project.accent} project-card-layout-${project.cardLayout ?? "top"}`} href={`/projects/${project.slug}`} key={project.slug}>
            <header><span>{project.index}</span><small><Localized text={project.category} /></small><time>{project.year}</time></header>
            <div className="project-flagship-media">{project.image ? <>{project.imageMode === "contain" && <span className="card-image-backdrop" style={{ backgroundImage: `url("${project.image}")` }} aria-hidden="true" />}<img className={project.imageMode === "contain" ? "card-image-contain" : undefined} src={project.image} alt={`${project.title} — ${project.imageNote.zh}`} loading="lazy" decoding="async" /></> : <ol className="project-flow-mini" aria-hidden="true">{project.flow.slice(0, 4).map((item, index) => <li key={item.zh}><b>0{index + 1}</b><span><Localized text={item} /></span></li>)}</ol>}</div>
            <div className="project-flagship-copy"><h3>{project.title}</h3><h4><Localized text={project.subtitle} /></h4><p><Localized text={project.summary} /></p><ul>{project.tech.slice(0, 4).map((tech) => <li key={tech}>{tech}</li>)}</ul><dl>{project.outcomes.slice(0, 3).map((item) => <div key={item.label.zh}><dt>{item.value}</dt><dd><Localized text={item.note} /></dd></div>)}</dl><footer><T zh="打开工程案例" en="Open engineering case" /> →</footer></div>
          </Link>)}
        </div>
      </section>

      <section className="project-personal section-shell">
        <div className="engineering-section-head"><div><span>02 / PERSONAL &amp; OPEN-SOURCE ENGINEERING</span><h2><T zh="个人与开源工程" en="Personal and open-source engineering" /></h2></div><p><T zh="保留现有项目，用更低的视觉层级展示产品意识、工程工具与跨平台开发能力。" en="Existing projects remain as supporting evidence for product judgment, engineering tooling, and cross-platform development." /></p></div>
        <div className="archive-beyond-list">{personalProjects.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}>{project.image && <div className="archive-beyond-thumb"><img src={project.image} alt={`${project.title} — ${project.imageNote.zh}`} loading="lazy" decoding="async" /></div>}<span>{project.index} · <Localized text={project.category} /></span><div><h3>{project.title}</h3><p><Localized text={project.summary} /></p></div><b>→</b></Link>)}</div>
      </section>

      <SiteFooter />
    </main>
  );
}
