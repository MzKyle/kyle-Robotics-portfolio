import Link from "next/link";
import type { Metadata } from "next";
import { projects } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";

export const metadata: Metadata = { title: "项目案例 | 王凯豪", description: "王凯豪的机器人软件工程、工业视觉、闭环控制、仿真与工程工具项目。" };

export default function ProjectsPage() {
  const flagship = projects[0];
  const coreProjects = projects.slice(1, 4);
  const beyondRobotics = projects.slice(4);

  return (
    <main>
      <SiteHeader active="projects" />
      <PageIntro eyebrow={{ zh: "项目档案", en: "PROJECT ARCHIVE" }} title={{ zh: "从系统问题到工程结果", en: "From system problems to engineering outcomes" }} description={{ zh: "工业视觉案例，机器人闭环，数据工具与仿真系统等项目。每个详情页都围绕职责、架构、关键决策和验证证据展开。", en: "Start with the flagship industrial vision case, then explore closed-loop robotics, data tooling, and simulation systems. Every case is organized around ownership, architecture, decisions, and evidence." }} meta={{ zh: "机器人软件 · 工业视觉 · 系统交付", en: "ROBOTICS SOFTWARE · INDUSTRIAL VISION · SYSTEM DELIVERY" }} />

      <section className="project-focus section-shell">
        <div className="archive-heading"><div><h2><T zh="完整的工业视觉系统交付" en="The most complete industrial vision delivery" /></h2></div><p><T zh="从多光源采图、两阶段检测和并发调度，到 PLC 分拣与生产追溯，集中体现端到端系统能力。" en="Multi-light acquisition, two-stage inspection, concurrent orchestration, PLC sorting, and production traceability in one end-to-end system." /></p></div>

        <Link className="archive-lead" href={`/projects/${flagship.slug}`}>
          <div className={`archive-lead-image archive-lead-image-${flagship.imageMode ?? "cover"}`}><img src={flagship.image} alt={`${flagship.title} — ${flagship.subtitle.zh}`} fetchPriority="high" decoding="async" /></div>
          <div className="archive-lead-copy"><div className="case-card-meta"><span><Localized text={flagship.category} /></span><span>{flagship.year}</span></div><h2>{flagship.title}</h2><h3><Localized text={flagship.subtitle} /></h3><p><Localized text={flagship.summary} /></p><dl className="archive-quickfacts"><div><dt><T zh="我的职责" en="MY ROLE" /></dt><dd><Localized text={flagship.role} /></dd></div><div><dt><T zh="系统闭环" en="SYSTEM LOOP" /></dt><dd><Localized text={flagship.outcomes[0].note} /></dd></div><div><dt><T zh="核心成果" en="CORE PROOF" /></dt><dd><b>{flagship.outcomes[2].value}</b><Localized text={flagship.outcomes[2].note} /></dd></div></dl><footer><span>{flagship.tech.slice(0, 5).join(" · ")}</span><b><T zh="打开完整案例" en="Open full case" /> →</b></footer></div>
        </Link>
      </section>

      <section className="project-core section-shell">
        <div className="archive-heading"><div className="section-primary-heading"><h2><T zh="核心系统" en="Core Systems" /></h2><p><T zh="机器人闭环、数据工具与仿真验收" en="Closed-loop robotics, data tooling, and simulation acceptance" /></p></div><p><T zh="不同类型的项目，共同证明感知、控制、工具与验证能力可以落在同一套工程方法中。" en="Different project types, united by one engineering approach across perception, control, tooling, and validation." /></p></div>
        <div className="archive-core-grid">{coreProjects.map((project) => <Link className="archive-core-card" href={`/projects/${project.slug}`} key={project.slug}><div className={`archive-core-image archive-core-image-${project.imageMode ?? "cover"} archive-core-image-${project.slug}`}><img src={project.image} alt={`${project.title} — ${project.subtitle.zh}`} loading="lazy" decoding="async" /></div><div><p><Localized text={project.category} /></p><h3>{project.title}</h3><h4><Localized text={project.subtitle} /></h4><small><Localized text={project.summary} /></small><dl className="archive-card-facts"><div><dt><T zh="我的职责" en="MY ROLE" /></dt><dd><Localized text={project.role} /></dd></div><div><dt><T zh="项目成果" en="PROOF" /></dt><dd><b>{project.outcomes[0].value}</b><Localized text={project.outcomes[0].note} /></dd></div></dl><ul>{project.tech.slice(0, 3).map((tech) => <li key={tech}>{tech}</li>)}</ul><b><T zh="阅读案例" en="Read case" /> →</b></div></Link>)}</div>
      </section>

      {beyondRobotics.length > 0 && <section className="project-beyond section-shell"><div className="archive-heading compact-archive-heading"><div className="section-primary-heading"><h2><T zh="机器人之外" en="Beyond Robotics" /></h2><p><T zh="产品意识与跨平台开发" en="Product judgment and cross-platform development" /></p></div><p><T zh="机器人项目之外的主动创造，展示交互设计、桌面开发与完整发布能力。" en="Independent work beyond robotics, demonstrating interaction design, desktop development, and complete releases." /></p></div><div className="archive-beyond-list">{beyondRobotics.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}><div className="archive-beyond-thumb"><img src={project.image} alt={`${project.title} — ${project.subtitle.zh}`} loading="lazy" decoding="async" /></div><span>{project.index} · <Localized text={project.category} /></span><div><h3>{project.title}</h3><p><Localized text={project.summary} /></p></div><b>→</b></Link>)}</div></section>}

      <SiteFooter />
    </main>
  );
}
