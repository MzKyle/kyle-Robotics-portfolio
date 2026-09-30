import type { CSSProperties } from "react";
import Link from "next/link";
import type { ProjectDetail } from "../lib/portfolio";
import { Localized, T } from "./localized";
import { SiteFooter, SiteHeader } from "./site-shell";

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

export function ProjectCase({ project, previous, next }: { project: ProjectDetail; previous: ProjectDetail; next: ProjectDetail }) {
  const ownership = project.ownership ?? project.contribution.map((label) => ({ label, type: "mine" as const }));
  const problems = project.problems ?? project.decisions.map((item) => ({
    title: item.title,
    constraint: project.challenge,
    decision: item.text,
  }));
  const deepDive = project.deepDive ?? project.engineering;

  return (
    <main className={`engineering-case engineering-case-${project.accent ?? "tooling"}`}>
      <SiteHeader active="projects" />
      <section className="case-hero">
        <div className="case-hero-copy">
          <p className="section-kicker"><T zh={`工程案例 ${project.index}`} en={`ENGINEERING CASE ${project.index}`} /> · <Localized text={project.category} /></p>
          <h1>{project.title}</h1>
          <p className="case-cn-title"><Localized text={project.subtitle} /></p>
          <p className="case-summary"><Localized text={project.summary} /></p>
          <div className="case-actions">
            <a className="button button-primary" href="#context"><T zh="开始阅读" en="Start case" /> <span>↓</span></a>
            {project.repo && <a className="button button-secondary" href={project.repo} target="_blank" rel="noreferrer"><T zh="查看 GitHub" en="View GitHub" /> <span>↗</span></a>}
            <Link className="case-inline-link" href="/interview"><T zh="面试模式" en="Interview mode" /> →</Link>
          </div>
          <dl className="case-meta">
            <div><dt><T zh="我的职责" en="MY ROLE" /></dt><dd><Localized text={project.role} /></dd></div>
            <div><dt><T zh="项目周期" en="PERIOD" /></dt><dd>{project.year}</dd></div>
            <div><dt><T zh="交付状态" en="DELIVERY" /></dt><dd><Localized text={project.status} /></dd></div>
            <div><dt><T zh="核心证据" en="CORE EVIDENCE" /></dt><dd><b>{project.outcomes[0].value}</b><Localized text={project.outcomes[0].note} /></dd></div>
          </dl>
        </div>
        <div className={`case-hero-media case-hero-media-${project.accent ?? "tooling"}`}>
          {project.image ? (
            <img src={project.image} alt={`${project.title} — ${project.imageNote.zh}`} fetchPriority="high" decoding="async" />
          ) : (
            <div className="case-schematic-preview">
              <span><T zh="系统结构示意" en="SYSTEM SCHEMATIC" /></span>
              <FlowDiagram project={project} compact />
              <small><Localized text={project.imageNote} /></small>
            </div>
          )}
        </div>
      </section>

      <nav className="case-jump-nav" aria-label="案例目录 / Case navigation">
        <a href="#context"><span>01</span><T zh="背景" en="Context" /></a>
        <a href="#ownership"><span>02</span><T zh="职责" en="Ownership" /></a>
        <a href="#architecture"><span>03</span><T zh="架构" en="Architecture" /></a>
        <a href="#problems"><span>04</span><T zh="问题" en="Problems" /></a>
        <a href="#decisions"><span>05</span><T zh="决策" en="Decisions" /></a>
        <a href="#evidence"><span>06</span><T zh="结果" en="Evidence" /></a>
        <a href="#deep-dive"><span>07</span><T zh="深入" en="Deep dive" /></a>
      </nav>

      <section className="case-context case-shell" id="context">
        <div className="case-section-head">
          <span><T zh="01 · 案例背景" en="01 · CASE CONTEXT" /></span>
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

      <section className="case-ownership case-shell" id="ownership">
        <div className="case-section-head">
          <span><T zh="02 · 我的职责" en="02 · MY OWNERSHIP" /></span>
          <h2><T zh="个人负责、协作与既有系统的边界" en="A clear boundary between ownership, collaboration, and existing systems" /></h2>
          <p><T zh="职责地图用于明确项目贡献，不把团队系统整体表述为个人成果。" en="The ownership map separates personal work from team collaboration and existing devices." /></p>
        </div>
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
      </section>

      <section className="case-tech case-shell"><span><T zh="核心技术" en="CORE TECHNOLOGY" /></span><ul>{project.tech.slice(0, 8).map((item) => <li key={item}>{item}</li>)}</ul></section>

      <section className="case-architecture case-shell" id="architecture">
        <div className="case-section-head">
          <span><T zh="03 · 系统架构" en="03 · SYSTEM ARCHITECTURE" /></span>
          <h2><T zh="从输入、计算到执行边界" en="From inputs and computation to execution boundaries" /></h2>
          <p><T zh="用一条可快速阅读的数据流说明系统组成；移动端会自动切换为纵向链路。" en="A scannable data path explains the system; it becomes a vertical chain on smaller screens." /></p>
        </div>
        <FlowDiagram project={project} />
        <details className="case-disclosure">
          <summary><div><span><T zh="核心模块" en="CORE MODULES" /></span><h3><T zh="查看模块边界与职责" en="Inspect module boundaries" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="module-grid">{project.modules.map((item, index) => <article key={item.code}><div><span>{String(index + 1).padStart(2, "0")}</span><code>{item.code}</code></div><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-problems case-shell" id="problems">
        <div className="case-section-head">
          <span><T zh="04 · 关键工程问题" en="04 · KEY ENGINEERING PROBLEMS" /></span>
          <h2><T zh="问题、约束与我的选择" en="Problem, constraint, and engineering response" /></h2>
        </div>
        <div className="problem-grid">
          {problems.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><dl><div><dt><T zh="约束" en="CONSTRAINT" /></dt><dd><Localized text={item.constraint} /></dd></div><div><dt><T zh="决策" en="MY DECISION" /></dt><dd><Localized text={item.decision} /></dd></div></dl></article>)}
        </div>
      </section>

      <section className="case-decisions case-shell" id="decisions">
        <div className="case-section-head">
          <span><T zh="05 · 工程决策" en="05 · ENGINEERING DECISIONS" /></span>
          <h2><T zh="为什么这样设计" en="Why the system is designed this way" /></h2>
          <p><T zh="聚焦影响可靠性、性能与维护成本的判断。" en="Decisions that materially affect reliability, performance, and maintainability." /></p>
        </div>
        <div className="decision-grid">{project.decisions.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        <details className="case-disclosure">
          <summary><div><span><T zh="实现重点" en="IMPLEMENTATION HIGHLIGHTS" /></span><h3><T zh="查看落地细节" en="View implementation details" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="engineering-list">{project.engineering.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-evidence case-shell" id="evidence">
        <div className="case-section-head">
          <span><T zh="06 · 结果与证据" en="06 · RESULTS & EVIDENCE" /></span>
          <h2><T zh="可验证的工程结果" en="Engineering outcomes with a validation path" /></h2>
          <p><T zh="只展示已有项目或公开简历能够支持的结果，不补造额外 benchmark。" en="Only results supported by the project or public resume are shown; no extra benchmark is invented." /></p>
        </div>
        <div className="outcome-grid">{project.outcomes.map((item) => <article key={item.label.zh}><span><Localized text={item.label} /></span><strong>{item.value}</strong><p><Localized text={item.note} /></p></article>)}</div>
        <details className="case-disclosure case-validation-disclosure">
          <summary><div><span><T zh="验证路径" en="VALIDATION PATHS" /></span><h3><T zh="查看测试、实机与交付证据" en="View testing, hardware, and delivery evidence" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="validation-grid">{project.validation.map((item) => <article key={item.tag}><span>{item.tag}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-deep-dive case-shell" id="deep-dive">
        <div className="case-section-head">
          <span><T zh="07 · 技术深入" en="07 · DEEP DIVE" /></span>
          <h2><T zh="面试时可以继续展开的问题" en="Topics ready for a deeper technical discussion" /></h2>
        </div>
        <div className="deep-dive-list">
          {deepDive.map((item, index) => <details key={item.title.zh}><summary><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><b aria-hidden="true">+</b></summary><p><Localized text={item.text} /></p></details>)}
        </div>
      </section>

      <nav className="case-pagination" aria-label="项目翻页 / Project pagination">
        <Link href={`/projects/${previous.slug}`}><span>← <T zh="上一个案例" en="PREVIOUS CASE" /></span><strong>{previous.title}</strong></Link>
        <Link href={`/projects/${next.slug}`}><span><T zh="下一个案例" en="NEXT CASE" /> →</span><strong>{next.title}</strong></Link>
      </nav>
      <SiteFooter />
    </main>
  );
}
