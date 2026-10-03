"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { InterviewTrackKey, LocalizedText, ProjectDetail } from "../lib/portfolio";
import { projectName } from "../lib/project-presentation";
import { Localized, T } from "./localized";

function scrollToCase(slug: string) {
  document.getElementById(`interview-${slug}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

export function InterviewPresentation({ trackKey, track, projects }: { trackKey: InterviewTrackKey; track: { title: LocalizedText; subtitle: LocalizedText }; projects: ProjectDetail[] }) {
  const [current, setCurrent] = useState(0);
  const navigation = useRef<HTMLElement>(null);
  const [activeSections, setActiveSections] = useState<Record<string, string>>({});
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const compact = matchMedia("(max-width: 760px)").matches;
      const routeBottom = document.querySelector(".interview-route-bar")?.getBoundingClientRect().bottom ?? 128;
      const boundary = Math.max(128, routeBottom, compact ? navigation.current?.getBoundingClientRect().bottom ?? 192 : 0) + 32;
      const next: Record<string, string> = {};
      for (const project of projects) {
        let active = "evidence";
        for (const id of ["evidence", "context", "architecture", "ownership"]) {
          if ((document.getElementById(project.slug + "-" + id)?.getBoundingClientRect().top ?? Infinity) <= boundary) active = id;
        }
        next[project.slug] = active;
      }
      setActiveSections(previous => projects.every(project => previous[project.slug] === next[project.slug]) ? previous : next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("toggle", schedule, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("toggle", schedule, true);
    };
  }, [projects]);

  useEffect(() => {
    const nav = navigation.current;
    const button = nav?.querySelector<HTMLButtonElement>('button[aria-current="step"]');
    if (!nav || !button || nav.scrollWidth <= nav.clientWidth) return;
    const bounds = nav.getBoundingClientRect();
    const item = button.getBoundingClientRect();
    if (item.left < bounds.left + 20 || item.right > bounds.right - 20) {
      nav.scrollBy({ left: item.left - bounds.left - (nav.clientWidth - item.width) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }, [current]);

  useEffect(() => {
    const sections = projects.map((project) => document.getElementById(`interview-${project.slug}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const index = sections.findIndex((section) => section === visible.target);
        if (index >= 0) setCurrent(index);
      }
    }, { rootMargin: "-18% 0px -55%", threshold: [0.05, 0.25, 0.55] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [projects]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || (event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
      const forward = event.key === "ArrowDown" || event.key === "ArrowRight";
      const target = Math.min(projects.length - 1, Math.max(0, current + (forward ? 1 : -1)));
      if (target === current) return;
      event.preventDefault();
      scrollToCase(projects[target].slug);
      setCurrent(target);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, projects]);

  const goTo = (index: number) => {
    scrollToCase(projects[index].slug);
    setCurrent(index);
  };

  return (
    <div className="interview-presentation">
      <header className="interview-route-bar">
        <div><span><T zh="当前路线" en="CURRENT ROUTE" /></span><strong><Localized text={track.title} /></strong><small><Localized text={track.subtitle} /></small></div>
        <nav aria-label="切换面试路线 / Switch interview route">
          {(["robotics", "industrial-vision", "computer-vision", "general"] as InterviewTrackKey[]).map((key) => <Link className={key === trackKey ? "active" : ""} href={`/interview?track=${key}`} key={key}>{key.replace("-", " ")}</Link>)}
        </nav>
        <Link href="/interview"><T zh="返回路线选择" en="Route selector" /> →</Link>
      </header>

      <div className="interview-layout">
        <aside className="interview-side-nav" ref={navigation}>
          <span><T zh="案例顺序" en="CASE ORDER" /></span>
          <ol>{projects.map((project, index) => <li key={project.slug}><button className={current === index ? "active" : ""} type="button" onClick={() => goTo(index)} aria-current={current === index ? "step" : undefined}><b>{String(index + 1).padStart(2, "0")}</b><span><Localized text={projectName(project)} /><small><Localized text={project.category} /></small></span></button></li>)}</ol>
          <p><T zh="键盘：↑ ↓ 或 ← → 切换案例" en="Keyboard: ↑ ↓ or ← → to change case" /></p>
        </aside>

        <div className="interview-cases">
          {projects.map((project, index) => (
            <article className={`interview-case interview-case-${project.accent}`} id={`interview-${project.slug}`} key={project.slug}>
              <header className="interview-case-head">
                <div><span>{String(index + 1).padStart(2, "0")} / 04</span><small><Localized text={project.category} /></small></div>
                <h1><Localized text={projectName(project)} /></h1>
                <p><Localized text={project.subtitle} /></p>
                <nav aria-label={`${projectName(project).en} section anchors`}>{[
                  { id: "evidence", label: { zh: "成果", en: "Results" } },
                  { id: "context", label: { zh: "背景", en: "Context" } },
                  { id: "architecture", label: { zh: "架构", en: "Architecture" } },
                  { id: "ownership", label: { zh: "职责", en: "Ownership" } },
                ].map(section => <a key={section.id} href={`#${project.slug}-${section.id}`} aria-current={(activeSections[project.slug] ?? "evidence") === section.id ? "location" : undefined}><Localized text={section.label} /></a>)}</nav>
              </header>

              <section id={`${project.slug}-evidence`}><span>01 / RESULTS &amp; EVIDENCE</span><div className="interview-outcomes">{project.outcomes.slice(0, 4).map((outcome) => <div key={outcome.label.zh}><small><Localized text={outcome.label} /></small><strong className={/[a-z]{4}/i.test(outcome.value) ? "outcome-value-label" : undefined}>{outcome.value}</strong><p><Localized text={outcome.note} /></p></div>)}</div><Link className="interview-full-case" href={`/projects/${project.slug}`}><T zh="打开完整 Engineering Case" en="Open full engineering case" /> →</Link></section>

              <section id={`${project.slug}-context`}><span>02 / CONTEXT</span><p className="interview-lead"><Localized text={project.summary} /></p><div className="interview-challenge"><b><T zh="核心挑战" en="CORE CHALLENGE" /></b><p><Localized text={project.challenge} /></p></div></section>



              <section id={`${project.slug}-architecture`}><span>03 / ARCHITECTURE</span><ol className="interview-flow">{project.flow.map((item, flowIndex) => <li key={item.zh}><b>{String(flowIndex + 1).padStart(2, "0")}</b><Localized text={item} /></li>)}</ol><details className="interview-supplement"><summary><T zh="展开关键工程问题" en="Expand key engineering problems" /><b aria-hidden="true">+</b></summary><div className="interview-problems">{(project.problems ?? []).slice(0, 4).map((problem) => <div key={problem.title.zh}><strong><Localized text={problem.title} /></strong><p><Localized text={problem.decision} /></p></div>)}</div></details></section>



              <section id={`${project.slug}-ownership`}><span>04 / OWNERSHIP</span><div className="interview-ownership"><p><Localized text={project.role} /></p><ul>{project.contribution.slice(0, 3).map((item) => <li key={item.zh}><Localized text={item} /></li>)}</ul></div></section>

              <footer className="interview-case-footer"><button type="button" disabled={index === 0} onClick={() => goTo(index - 1)}>← <T zh="上一个" en="Previous" /></button><span>{index + 1} / {projects.length}</span><button type="button" disabled={index === projects.length - 1} onClick={() => goTo(index + 1)}><T zh="下一个" en="Next" /> →</button></footer>
            </article>
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{projects[current]?.title}</p>
    </div>
  );
}
