import Link from "next/link";
import type { ProjectDetail } from "../lib/portfolio";
import { Localized, T } from "./localized";
import { SiteFooter, SiteHeader } from "./site-shell";

export function ProjectCase({ project, previous, next }: { project: ProjectDetail; previous: ProjectDetail; next: ProjectDetail }) {
  return (
    <main>
      <SiteHeader active="projects" />
      <section className="case-hero">
        <div className="case-hero-copy">
          <p className="section-kicker"><T zh={`项目 ${project.index}`} en={`PROJECT ${project.index}`} /> · <Localized text={project.category} /></p>
          <h1>{project.title}</h1>
          <p className="case-cn-title"><Localized text={project.subtitle} /></p>
          <p className="case-summary"><Localized text={project.summary} /></p>
          <div className="case-actions"><a className="button button-primary" href={project.repo} target="_blank" rel="noreferrer"><T zh="查看 GitHub" en="View GitHub" /> <span>↗</span></a><Link className="button button-secondary" href="/projects"><T zh="全部项目" en="All projects" /> <span>→</span></Link></div>
          <dl className="case-meta"><div><dt><T zh="我的职责" en="MY ROLE" /></dt><dd><Localized text={project.role} /></dd></div><div><dt><T zh="项目周期" en="PERIOD" /></dt><dd>{project.year}</dd></div><div><dt><T zh="交付状态" en="DELIVERY" /></dt><dd><Localized text={project.status} /></dd></div><div><dt><T zh="核心成果" en="CORE EVIDENCE" /></dt><dd><b>{project.outcomes[0].value}</b><Localized text={project.outcomes[0].note} /></dd></div></dl>
        </div>
        <figure className={`case-hero-media case-hero-media-${project.imageMode ?? "cover"} case-hero-media-${project.slug}`}>
          <img src={project.image} alt={`${project.title} — ${project.subtitle.zh}`} fetchPriority="high" decoding="async" />
        </figure>
      </section>

      <nav className="case-jump-nav" aria-label="案例目录 / Case navigation">
        <a href="#brief"><span>01</span><T zh="项目重点" en="Case brief" /></a>
        <a href="#architecture"><span>02</span><T zh="系统架构" en="Architecture" /></a>
        <a href="#decisions"><span>03</span><T zh="工程决策" en="Decisions" /></a>
        <a href="#evidence"><span>04</span><T zh="验证结果" en="Evidence" /></a>
      </nav>

      <section className="case-overview case-shell" id="brief">
        <aside>
          <span><T zh="项目概览" en="CASE BRIEF" /></span>
          <h2><T zh="项目背景与我的职责" en="Project context and my ownership" /></h2>
          {project.overviewImage && (
            <figure className="case-overview-media">
              <img
                src={project.overviewImage.src}
                alt={project.overviewImage.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          )}
        </aside>
        <div>
          <p className="case-lead"><Localized text={project.intro} /></p>
          <div className="challenge-box"><span><T zh="核心挑战" en="CORE CHALLENGE" /></span><p><Localized text={project.challenge} /></p></div>
          <div className="case-contribution">
            <span><T zh="我的工作" en="MY OWNERSHIP" /></span>
            <ul>{project.contribution.map((item, index) => <li key={item.zh}><b>{String(index + 1).padStart(2, "0")}</b><Localized text={item} /></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="case-tech case-shell"><span><T zh="技术栈" en="TECH STACK" /></span><ul>{project.tech.map((item) => <li key={item}>{item}</li>)}</ul></section>

      <section className="case-architecture case-flow case-shell" id="architecture">
        <div className="case-section-head"><span><T zh="01 · 系统架构" en="01 · SYSTEM ARCHITECTURE" /></span><h2><T zh="从数据流到模块边界" en="From data flow to module boundaries" /></h2><p><T zh="" en="" /></p></div>
        <ol>{project.flow.map((item, index) => <li key={item.zh}><span>0{index + 1}</span><strong><Localized text={item} /></strong>{index < project.flow.length - 1 && <i>→</i>}</li>)}</ol>
        <details className="case-disclosure">
          <summary><div><span><T zh="核心模块" en="CORE MODULES" /></span><h3><T zh="系统由哪些模块组成" en="The modules behind the system" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="module-grid">{project.modules.map((item, index) => <article key={item.code}><div><span>{String(index + 1).padStart(2, "0")}</span><code>{item.code}</code></div><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-decisions case-shell" id="decisions">
        <div className="case-section-head"><span><T zh="02 · 工程决策" en="02 · ENGINEERING DECISIONS" /></span><h2><T zh="关键决策与工程实现" en="Key decisions and engineering execution" /></h2><p><T zh="聚焦真正影响可靠性、性能和维护成本的判断，以及它们如何落入具体实现。" en="The decisions that materially affect reliability, performance, and maintainability—and how they become concrete implementation." /></p></div>
        <div className="decision-grid">{project.decisions.map((item, index) => <article key={item.title.zh}><span>0{index + 1}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        <details className="case-disclosure">
          <summary><div><span><T zh="实现重点" en="ENGINEERING HIGHLIGHTS" /></span><h3><T zh="落地过程中的关键实现" en="Implementation highlights" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="engineering-list">{project.engineering.map((item, index) => <article key={item.title.zh}><span>{String(index + 1).padStart(2, "0")}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
      </section>

      <section className="case-evidence case-shell" id="evidence">
        <div className="case-section-head"><span><T zh="03 · 验证与交付" en="03 · EVIDENCE &amp; DELIVERY" /></span><h2><T zh="验证路径与交付结果" en="Validation paths and delivery outcomes" /></h2><p><T zh="把测试、仿真、实机与发布路径和最终结果放在一起，形成可快速判断的工程证据。" en="Tests, simulation, hardware, release paths, and outcomes are presented together as scannable engineering evidence." /></p></div>
        <details className="case-disclosure case-validation-disclosure">
          <summary><div><span><T zh="验证路径" en="VALIDATION PATHS" /></span><h3><T zh="查看测试、仿真与发布验证" en="View tests, simulation, and release validation" /></h3></div><b aria-hidden="true">+</b></summary>
          <div className="validation-grid">{project.validation.map((item) => <article key={item.tag}><span>{item.tag}</span><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></article>)}</div>
        </details>
        <div className="outcome-grid">{project.outcomes.map((item) => <article key={item.label.zh}><span><Localized text={item.label} /></span><strong>{item.value}</strong><p><Localized text={item.note} /></p></article>)}</div>
      </section>

      <nav className="case-pagination" aria-label="项目翻页 / Project pagination">
        <Link href={`/projects/${previous.slug}`}><span>← <T zh="上一个项目" en="PREVIOUS" /></span><strong>{previous.title}</strong></Link>
        <Link href={`/projects/${next.slug}`}><span><T zh="下一个项目" en="NEXT" /> →</span><strong>{next.title}</strong></Link>
      </nav>
      <SiteFooter />
    </main>
  );
}
