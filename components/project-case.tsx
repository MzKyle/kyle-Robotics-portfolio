import type { CSSProperties } from "react";
import { PortfolioImage as Image } from "./portfolio-image";
import Link from "next/link";
import type { ProjectDetail } from "../lib/portfolio";
import { projectName } from "../lib/project-presentation";
import { repositoryArchitectures } from "../lib/repository-architecture";
import { ArchitecturePreview, RepositoryArchitectureFigure } from "./repository-architecture";
import { CaseNavigation } from "./case-navigation";
import { projectMedia } from "../lib/project-media";
import { Localized, T } from "./localized";
import { SiteFooter, SiteHeader } from "./site-shell";
import { HashDisclosures } from "./hash-disclosures";
import { AutoAimEvidence, VolumeGeometryFigure } from "./project-evidence";

const caseSections = [
  { id: "evidence", label: { zh: "成果", en: "Results" } },
  { id: "context", label: { zh: "背景", en: "Context" } },
  { id: "architecture", label: { zh: "架构", en: "Architecture" } },
  { id: "decisions", label: { zh: "决策", en: "Decisions" } },
  { id: "ownership", label: { zh: "职责", en: "Ownership" } },
  { id: "problems", label: { zh: "问题", en: "Problems" } },
  { id: "deep-dive", label: { zh: "深入", en: "Deep dive" } },
];

const ownershipLabels = {
  mine: { zh: "我的职责", en: "MY OWNERSHIP" },
  collaboration: { zh: "团队协作", en: "TEAM COLLABORATION" },
  existing: { zh: "现有系统 / 设备", en: "EXISTING SYSTEM / DEVICE" },
} as const;

function FlowDiagram({ project, compact = false }: { project: ProjectDetail; compact?: boolean }) {
  const items = compact ? project.flow.slice(0, 5) : project.flow;
  return (
    <ol
      className={`engineering-flow${compact ? " engineering-flow-compact" : ""}`}
      style={{ "--flow-count": items.length } as CSSProperties}
      aria-label="系统数据流 / System data flow"
    >
      {items.map((item, index) => (
        <li key={`${item.zh}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong><Localized text={item} /></strong>
          {index < items.length - 1 && <i aria-hidden="true">→</i>}
        </li>
      ))}
    </ol>
  );
}

function FlowOverview({ project }: { project: ProjectDetail }) {
  const groups = Array.from({ length: 3 }, (_, index) => project.flow.slice(Math.ceil(index * project.flow.length / 3), Math.ceil((index + 1) * project.flow.length / 3)));
  return <ol className="case-flow-overview" aria-label="系统流程概览 / System flow overview">{groups.map((group, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span><div>{group.map(item => <p key={item.zh}><Localized text={item} /></p>)}</div></li>)}</ol>;
}

export function ProjectCase({ project, previous, next }: { project: ProjectDetail; previous: ProjectDetail; next: ProjectDetail }) {
  const ownership = project.ownership ?? project.contribution.map((label) => ({ label, type: "mine" as const }));
  const problems = project.problems ?? project.decisions.map((item) => ({
    title: item.title,
    constraint: project.challenge,
    decision: item.text,
  }));
  const deepDive = project.deepDive ?? project.engineering;
  const media = projectMedia[project.slug] ?? { width: 1600, height: 1000 };

  return (
    <main className={`engineering-case engineering-case-${project.accent ?? "tooling"}`}>
      <HashDisclosures />
      <SiteHeader active="projects" />
      <section className="case-hero">
        <div className="case-hero-copy">
          <p className="section-kicker"><T zh={`工程案例 ${project.index}`} en={`ENGINEERING CASE ${project.index}`} /> · <Localized text={project.category} /></p>
          <h1><Localized text={projectName(project)} /></h1>
          <p className="case-cn-title"><Localized text={project.subtitle} /></p>
          <p className="case-summary"><Localized text={project.summary} /></p>
          <div className="case-actions">
            <a className="button button-primary" href="#evidence"><T zh="查看成果" en="View results" /> <span>↓</span></a>
            {project.repo && <a className="button button-secondary" href={project.repo} target="_blank" rel="noreferrer"><T zh="查看 GitHub" en="View GitHub" /> <span>↗</span></a>}
          </div>
          <dl className="case-meta">
            <div><dt><T zh="我的职责" en="MY ROLE" /></dt><dd><Localized text={project.role} /></dd></div>
            <div><dt><T zh="项目周期" en="PERIOD" /></dt><dd>{project.year}</dd></div>
            <div><dt><T zh="交付状态" en="DELIVERY" /></dt><dd><Localized text={project.status} /></dd></div>
            <div><dt><T zh="核心证据" en="CORE EVIDENCE" /></dt><dd><b>{project.outcomes[0].value}</b><Localized text={project.outcomes[0].note} /></dd></div>
          </dl>
        </div>
        <figure className={`case-hero-media case-hero-media-${project.accent ?? "tooling"}`}>
          {repositoryArchitectures[project.slug] ? <ArchitecturePreview slug={project.slug} /> : project.image ? (
            <>
              <Image src={project.image} alt={`${project.title} — ${(media.caption ?? project.imageNote).zh}`} width={media.width} height={media.height} unoptimized priority sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 900px) 700px, (max-width: 1280px) 45vw, 525px" />
              <figcaption><Localized text={media.caption ?? project.imageNote} /></figcaption>
            </>
          ) : (
            <div className="case-schematic-preview">
              <span><T zh="系统结构示意" en="SYSTEM SCHEMATIC" /></span>
              <FlowDiagram project={project} compact />
              <small><Localized text={project.imageNote} /></small>
            </div>
          )}
        </figure>
      </section>

      <CaseNavigation sections={caseSections} />

      <section className="case-evidence case-shell" id="evidence">
        <div className="case-section-head">
          <span><T zh="01 · 结果与证据" en="01 · RESULTS & EVIDENCE" /></span>
          <h2><T zh="可验证的工程结果" en="Engineering outcomes with a validation path" /></h2>
        </div>
        <div className="outcome-grid">{project.outcomes.map((item) => <article key={item.label.zh}><span><Localized text={item.label} /></span><strong className={/[a-z]{4}/i.test(item.value) ? "outcome-value-label" : undefined}>{item.value}</strong><p><Localized text={item.note} /></p></article>)}</div>
        <details className="case-disclosure case-validation-disclosure">
          <summary><div><span><T zh="验证路径" en="VALIDATION PATHS" /></span><h3><T zh="查看测试、实机与交付证据" en="View testing, hardware, and delivery evidence" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="validation-grid">{project.validation.map((item) => <article key={item.tag}><span>{item.tag}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-context case-shell" id="context">
        <div className="case-section-head">
          <span><T zh="02 · 案例背景" en="02 · CASE CONTEXT" /></span>
          <h2><T zh="系统是什么，解决什么问题" en="The system and the problem it solves" /></h2>
        </div>
        <div className="case-context-grid">
          <p className="case-lead"><Localized text={project.intro} /></p>
          <div>
            <div className="challenge-box"><span><T zh="核心挑战" en="CORE CHALLENGE" /></span><p><Localized text={project.challenge} /></p></div>
            {project.confidentialityNote && <aside className="confidentiality-note"><b><T zh="公开边界" en="PUBLIC BOUNDARY" /></b><p><Localized text={project.confidentialityNote} /></p></aside>}
          </div>
        </div>
      </section>

      <section className="case-tech case-shell"><span><T zh="核心技术" en="CORE TECHNOLOGY" /></span><ul>{project.tech.slice(0, 8).map((item) => <li key={item}>{item}</li>)}</ul></section>

      <section className="case-architecture case-shell" id="architecture">
        <div className="case-section-head">
          <span><T zh="03 · 系统架构" en="03 · SYSTEM ARCHITECTURE" /></span>
          <h2>{repositoryArchitectures[project.slug] ? <Localized text={repositoryArchitectures[project.slug].title} /> : <T zh="系统如何协同工作" en="How the system works together" />}</h2>
        </div>
        {repositoryArchitectures[project.slug] ? <RepositoryArchitectureFigure slug={project.slug} /> : <FlowOverview project={project} />}
        {project.slug === "auto-aim" && <AutoAimEvidence />}
        {project.slug === "3d-volume-measurement" && <details className="case-disclosure"><summary><div><span>GEOMETRY</span><h3><T zh="查看测量基准、倾斜与薄物体示意" en="Inspect reference, tilt and thin-object geometry" /></h3></div><b aria-hidden="true">+</b></summary><VolumeGeometryFigure /></details>}
        <details className="case-disclosure case-flow-disclosure"><summary><div><span>DATA FLOW</span><h3><T zh="查看完整处理流程" en="View the complete processing flow" /></h3></div><b aria-hidden="true">+</b></summary><FlowDiagram project={project} /></details>
        <details className="case-disclosure">
          <summary><div><span><T zh="核心模块" en="CORE MODULES" /></span><h3><T zh="查看模块边界与职责" en="Inspect module boundaries" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="module-grid">{project.modules.map((item, index) => <article key={item.code}><div><span>{String(index + 1).padStart(2, "0")}</span><code>{item.code}</code></div><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-decisions case-shell" id="decisions">
        <div className="case-section-head">
          <span><T zh="04 · 工程决策" en="04 · ENGINEERING DECISIONS" /></span>
          <h2><T zh="为什么这样设计" en="Why the system is designed this way" /></h2>
          <p><T zh="聚焦影响可靠性、性能与维护成本的判断。" en="Decisions that materially affect reliability, performance, and maintainability." /></p>
        </div>
        <div className="case-decision-list">{project.decisions.map((item, index) => <details key={item.title.zh} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><b aria-hidden="true">+</b></summary><p><Localized text={item.text} /></p></details>)}</div>
        <details className="case-disclosure">
          <summary><div><span><T zh="实现重点" en="IMPLEMENTATION HIGHLIGHTS" /></span><h3><T zh="查看落地细节" en="View implementation details" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="engineering-list">{project.engineering.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <details className="case-ownership case-shell case-fold" id="ownership">
        <summary>
        <div className="case-section-head">
          <span><T zh="05 · 我的职责" en="05 · MY OWNERSHIP" /></span>
          <h2><T zh="职责与协作边界" en="Ownership and collaboration" /></h2>
          <p><T zh="职责地图用于明确项目贡献，不把团队系统整体表述为个人成果。" en="The ownership map separates personal work from team collaboration and existing devices." /></p>
        </div>
        <b className="case-fold-toggle" aria-hidden="true">+</b>
        </summary>
        <div className="case-fold-body">
        <div className="ownership-legend" aria-label="职责地图图例 / Ownership map legend">
          {(Object.keys(ownershipLabels) as Array<keyof typeof ownershipLabels>).map((type) => <span className={`ownership-${type}`} key={type}><i aria-hidden="true" /><Localized text={ownershipLabels[type]} /></span>)}
        </div>
        <ol className="ownership-map">
          {ownership.map((item, index) => <li className={`ownership-${item.type}`} key={`${item.label.zh}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong><Localized text={item.label} /></strong><em><Localized text={ownershipLabels[item.type]} /></em></li>)}
        </ol>
        <div className="case-contribution">
          <span><T zh="具体工作" en="CONCRETE CONTRIBUTIONS" /></span>
          <ul>{project.contribution.map((item, index) => <li key={item.zh}><b>{String(index + 1).padStart(2, "0")}</b><Localized text={item} /></li>)}</ul>
        </div>
        </div>
      </details>

      <details className="case-problems case-shell case-fold" id="problems">
        <summary>
        <div className="case-section-head">
          <span><T zh="06 · 关键工程问题" en="06 · KEY ENGINEERING PROBLEMS" /></span>
          <h2><T zh="问题、约束与我的选择" en="Problem, constraint, and engineering response" /></h2>
        </div>
        <b className="case-fold-toggle" aria-hidden="true">+</b>
        </summary>
        <div className="case-fold-body">
        <div className="problem-grid">
          {problems.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><dl><div><dt><T zh="约束" en="CONSTRAINT" /></dt><dd><Localized text={item.constraint} /></dd></div><div><dt><T zh="决策" en="MY DECISION" /></dt><dd><Localized text={item.decision} /></dd></div></dl></article>)}
        </div>
        </div>
      </details>

      <section className="case-deep-dive case-shell" id="deep-dive">
        <div className="case-section-head">
          <span><T zh="07 · 技术深入" en="07 · DEEP DIVE" /></span>
          <h2><T zh="进一步的技术细节" en="Further technical details" /></h2>
        </div>
        <div className="deep-dive-list">
          {deepDive.map((item, index) => <details key={item.title.zh}><summary><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><b aria-hidden="true">+</b></summary><p><Localized text={item.text} /></p></details>)}
        </div>
      </section>

      <nav className="case-pagination" aria-label="项目翻页 / Project pagination">
        <Link href={`/projects/${previous.slug}`}><span>← <T zh="上一个案例" en="PREVIOUS CASE" /></span><strong><Localized text={projectName(previous)} /></strong></Link>
        <Link href={`/projects/${next.slug}`}><span><T zh="下一个案例" en="NEXT CASE" /> →</span><strong><Localized text={projectName(next)} /></strong></Link>
      </nav>
      <SiteFooter />
    </main>
  );
}
