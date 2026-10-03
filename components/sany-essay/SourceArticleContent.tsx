import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import katex from "katex";
import type { Token, Tokens } from "marked";
import { sourceArticleImages } from "../../lib/sany-source-article";
import type { EssayFigureId } from "../../lib/sany-essay-content";
import { Localized, T } from "../localized";
import { CaseReading } from "./CaseLayout";

function SourceMath({ expression, display = false }: { expression: string; display?: boolean }) {
  // Repair the source's two escaped-subscript typos in presentation only.
  // The original expression remains available for content-fidelity verification.
  const latex = expression.replace(/\\mathbf\{p\}\*\{(TCP|seam)\}/g, "\\mathbf{p}_{$1}")
    .replace(/^tool_pos$/, "\\texttt{tool\\_pos}");
  const html = katex.renderToString(latex, { displayMode: display, throwOnError: true, strict: false, trust: false });
  return <span className={display ? "source-math-block" : "source-math-inline"} data-source-formula={expression} dangerouslySetInnerHTML={{ __html: html }} />;
}

function InlineContent({ tokens }: { tokens: Token[] }) {
  return tokens.map((token, index) => {
    let content: ReactNode;
    switch (token.type) {
      case "text": {
        const text = token as Tokens.Text;
        content = text.tokens ? <InlineContent tokens={text.tokens} /> : text.text;
        break;
      }
      case "escape": content = (token as Tokens.Escape).text; break;
      case "strong": content = <strong><InlineContent tokens={(token as Tokens.Strong).tokens} /></strong>; break;
      case "em": content = <em><InlineContent tokens={(token as Tokens.Em).tokens} /></em>; break;
      case "del": content = <del><InlineContent tokens={(token as Tokens.Del).tokens} /></del>; break;
      case "codespan": content = <code>{(token as Tokens.Codespan).text}</code>; break;
      case "br": content = <br />; break;
      case "sourceMathInline": content = <SourceMath expression={String(token.text)} />; break;
      case "link": {
        const link = token as Tokens.Link;
        content = <a href={link.href}><InlineContent tokens={link.tokens} /></a>;
        break;
      }
      default: throw new Error(`Unrendered source inline token: ${token.type}`);
    }
    return <Fragment key={index}>{content}</Fragment>;
  });
}

function InlineLanguages({ zh, en }: { zh: Token[]; en: Token[] }) {
  return <><span className="lang-zh" data-source-language="zh"><InlineContent tokens={zh} /></span><span className="lang-en" data-source-language="en"><InlineContent tokens={en} /></span></>;
}

function proseTokens(tokens: Token[]) { return tokens.filter(token => token.type !== "space" && token.type !== "hr"); }

function sourcePairs(zh: Token[], en: Token[], id: string) {
  const chinese = proseTokens(zh);
  const english = proseTokens(en);
  if (chinese.length !== english.length) throw new Error(`${id}: source and translation have different block counts (${chinese.length}/${english.length}).`);
  return chinese.map((token, index) => {
    if (token.type !== english[index].type) throw new Error(`${id}/${index}: source and translation block types differ.`);
    return { zh: token, en: english[index], id: `${id}-${index}` };
  });
}

function BlockPair({ zh, en, id }: { zh: Token; en: Token; id: string }) {
  const attribute = { "data-source-block": id };
  switch (zh.type) {
    case "paragraph": case "text": {
      const chinese = zh as Tokens.Paragraph;
      const english = en as Tokens.Paragraph;
      return <p className="essay-paragraph" {...attribute}><InlineLanguages zh={chinese.tokens ?? []} en={english.tokens ?? []} /></p>;
    }
    case "heading": {
      const chinese = zh as Tokens.Heading;
      const english = en as Tokens.Heading;
      return <h3 className="essay-subhead" {...attribute}><InlineLanguages zh={chinese.tokens} en={english.tokens} /></h3>;
    }
    case "sourceMathBlock": return <div className="essay-formula source-equation" {...attribute}>
      <span className="lang-zh" data-source-language="zh"><SourceMath expression={String(zh.text)} display /></span>
      <span className="lang-en" data-source-language="en"><SourceMath expression={String((en as { text: string }).text)} display /></span>
    </div>;
    case "list": {
      const chinese = zh as Tokens.List;
      const english = en as Tokens.List;
      if (chinese.items.length !== english.items.length) throw new Error(`${id}: translated list lost an item.`);
      const items = chinese.items.map((item, index) => <li key={index}>
        <InlineLanguages zh={item.tokens} en={english.items[index].tokens} />
      </li>);
      return chinese.ordered ? <ol className="essay-body-list" start={Number(chinese.start) || 1} {...attribute}>{items}</ol> : <ul className="essay-body-list" {...attribute}>{items}</ul>;
    }
    case "blockquote": return <blockquote className="essay-note source-quotation" {...attribute}>
      {sourcePairs((zh as Tokens.Blockquote).tokens, (en as Tokens.Blockquote).tokens, id).map(pair => <BlockPair key={pair.id} {...pair} />)}
    </blockquote>;
    default: throw new Error(`Unrendered source block: ${zh.type}`);
  }
}

function SourceImage({ href, id }: { href: string; id: string }) {
  const media = sourceArticleImages[href as keyof typeof sourceArticleImages];
  if (!media) throw new Error(`Original article image has no local asset: ${href}`);
  return <figure className="case-figure essay-source-image" data-source-block={id} data-source-image={href}>
    <a href={media.src} target="_blank" rel="noreferrer" aria-label="打开原文示意图 / Open source illustration">
      <Image src={media.src} width={media.width} height={media.height} alt={media.caption.zh} unoptimized sizes="(max-width: 760px) calc(100vw - 44px), 860px" />
    </a>
    <figcaption><Localized text={media.caption} /><a href={media.src} target="_blank" rel="noreferrer"><T zh="查看原图" en="Open full-size image" /> ↗</a></figcaption>
  </figure>;
}

const endFigures: Record<string, EssayFigureId[]> = {
  "sampling-mismatch": ["sampling"], "motion-prior": ["motion"], "event-time": ["reduction"],
  "temporal-selection": ["transition", "matching"], "isp-decoupling": ["isp"],
  "error-evolution": ["evolution"], "methodology": ["method"],
};

export function SourceArticleContent({ zh, en, id, figure }: {
  zh: Token[]; en: Token[]; id: string; figure: (id: EssayFigureId) => ReactNode;
}) {
  const output: ReactNode[] = [];
  let reading: ReactNode[] = [];
  function flush() {
    if (reading.length) output.push(<CaseReading key={`reading-${output.length}`}>{reading}</CaseReading>);
    reading = [];
  }
  function insertFigure(figureId: EssayFigureId) {
    flush();
    const diagram = figure(figureId);
    output.push(figureId === "transition" || figureId === "method"
      ? <CaseReading key={`figure-${figureId}`}>{diagram}</CaseReading>
      : <div className="case-figure-slot" key={`figure-${figureId}`}>{diagram}</div>);
  }

  for (const pair of sourcePairs(zh, en, id)) {
    if (pair.zh.type === "code") {
      const code = pair.zh as Tokens.Code;
      if (code.lang !== "mermaid") throw new Error(`Unrendered code language: ${code.lang}`);
      const figureId = code.text.includes("IndependentRun") ? "clock-mapping" : "system";
      if (figureId === "clock-mapping") insertFigure("clock");
      flush();
      output.push(<div className="case-figure-slot" data-source-block={pair.id} key={pair.id}>
        {figure(figureId)}
        <details className="case-diagram-source source-original-mermaid"><summary><T zh="查看原文 Mermaid 源码" en="View the original Mermaid source" /></summary><pre><code>{code.text}</code></pre></details>
      </div>);
      continue;
    }

    if (pair.zh.type === "paragraph" && (pair.zh as Tokens.Paragraph).tokens.some(token => token.type === "sourceImage")) {
      const chinese = (pair.zh as Tokens.Paragraph).tokens;
      const english = (pair.en as Tokens.Paragraph).tokens;
      const chineseImageIndex = chinese.findIndex(token => token.type === "sourceImage");
      const englishImageIndex = english.findIndex(token => token.type === "sourceImage");
      if (englishImageIndex < 0) throw new Error(`${pair.id}: translated source image is missing.`);
      if (chineseImageIndex) reading.push(<p className="essay-paragraph" data-source-block={`${pair.id}-lead`} key={`${pair.id}-lead`}><InlineLanguages zh={chinese.slice(0, chineseImageIndex)} en={english.slice(0, englishImageIndex)} /></p>);
      flush();
      output.push(<SourceImage href={String((chinese[chineseImageIndex] as { href: string }).href)} id={pair.id} key={pair.id} />);
      if (chineseImageIndex + 1 < chinese.length) reading.push(<p className="essay-paragraph" data-source-block={`${pair.id}-tail`} key={`${pair.id}-tail`}><InlineLanguages zh={chinese.slice(chineseImageIndex + 1)} en={english.slice(englishImageIndex + 1)} /></p>);
      continue;
    }

    reading.push(<BlockPair {...pair} key={pair.id} />);
    if (id === "dual-timeline" && pair.zh.type === "blockquote" && pair.zh.raw.includes("Multi-Chunk")) insertFigure("buffer");
    if (id === "error-evolution" && pair.zh.type === "list" && pair.zh.raw.includes("e_{robot}")) insertFigure("error");
  }
  flush();
  for (const figureId of endFigures[id] ?? []) insertFigure(figureId);
  return <>{output}</>;
}
