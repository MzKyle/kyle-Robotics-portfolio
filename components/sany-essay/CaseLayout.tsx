import type { ReactNode } from "react";
import type { EssayChapter } from "../../lib/sany-essay-content";
import type { LocalizedText } from "../../lib/portfolio";
import { sanyDiagramSizes } from "../../lib/sany-diagram-sizes";
import { Localized, T } from "../localized";

export function CaseReading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`case-reading ${className}`}>{children}</div>;
}

export function CaseChapter({ chapter, children }: { chapter: EssayChapter; children: ReactNode }) {
  return <section className="essay-chapter" id={chapter.id} aria-labelledby={`${chapter.id}-title`}>
    <CaseReading className="case-chapter-intro"><header className="essay-chapter-head">
      <span>{chapter.number} / 08</span>
      <h2 id={`${chapter.id}-title`}><Localized text={chapter.title} /></h2>
      <p><Localized text={chapter.deck} /></p>
    </header></CaseReading>
    <div className="essay-chapter-content">{children}</div>
  </section>;
}

export function CaseEquation({ expression, caption }: { expression: ReactNode; caption?: LocalizedText }) {
  return <div className="essay-formula"><code>{expression}</code>{caption && <span><Localized text={caption} /></span>}</div>;
}

export function CaseTakeaway({ children }: { children: ReactNode }) {
  return <aside className="essay-note">{children}</aside>;
}

export function CaseFigure({ id, number, label, title, note, caption, children, className = "" }: {
  id: string; number: string; label: string; title: LocalizedText; note?: LocalizedText;
  caption: ReactNode; children: ReactNode; className?: string;
}) {
  return <figure className={`case-figure essay-figure ${className}`} aria-labelledby={`${id}-title`}>
    <header className="essay-figure-top">
      <span className="essay-figure-number">FIG. {number} <span aria-hidden="true">·</span> {label}</span>
      <h3 id={`${id}-title`}><Localized text={title} /></h3>
      {note && <span className="essay-concept-label"><Localized text={note} /></span>}
    </header>
    <div className="essay-figure-body">{children}</div>
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function CaseMermaid({ name, description }: { name: "clock-mapping" | "dual-timeline"; description: LocalizedText }) {
  return <div className={`case-mermaid case-mermaid-${name}`}>
    {(["zh", "en"] as const).map((language) => {
      const size = sanyDiagramSizes[`${name}-${language}`];
      return <picture className={`lang-${language}`} key={language}>
        <source media="(max-width: 760px)" srcSet={`/diagrams/sany/${name}-${language}-mobile.svg`} width={size.mobile.width} height={size.mobile.height} />
        {/* SVGs are rendered from the accompanying Mermaid source at authoring time. */}
        <img src={`/diagrams/sany/${name}-${language}.svg`} width={size.desktop.width} height={size.desktop.height} alt={description[language]} loading="lazy" />
      </picture>;
    })}
    <details className="case-diagram-source"><summary><T zh="查看 Mermaid 图源" en="View Mermaid source" /></summary><p>
      <a href={`/diagrams/sany/${name}-zh.mmd`} target="_blank" rel="noreferrer">中文 ↗</a>
      <a href={`/diagrams/sany/${name}-en.mmd`} target="_blank" rel="noreferrer">English ↗</a>
    </p></details>
  </div>;
}
