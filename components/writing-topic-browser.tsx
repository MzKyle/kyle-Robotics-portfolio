"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { WritingTopic } from "../lib/portfolio";
import { Localized, T } from "./localized";

type Article = {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  views: number;
  column: { zh: string; en: string };
};

type ArticleResponse = {
  articles: Article[];
  availableColumns: number;
  totalColumns: number;
  fetchedAt: string;
};

type LoadState = "idle" | "loading" | "ready" | "error";

function compactUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function formatDate(value: string) {
  return value.slice(0, 10).replaceAll("-", ".");
}

function TopicTrigger({
  topic,
  index,
  variant,
  onOpen,
}: {
  topic: WritingTopic;
  index: number;
  variant: "grid" | "compact";
  onOpen: (element: HTMLButtonElement) => void;
}) {
  if (variant === "compact") {
    return (
      <li>
        <button type="button" onClick={(event) => onOpen(event.currentTarget)} aria-haspopup="dialog">
          <span>0{index + 1}</span>
          <span className="home-topic-copy"><strong><Localized text={topic.title} /></strong><small>{topic.keywords.join(" · ")}</small></span>
          <b><T zh="查看文章" en="View articles" /> <i aria-hidden="true">→</i></b>
        </button>
      </li>
    );
  }

  return (
    <button className="topic-card writing-topic-trigger" type="button" onClick={(event) => onOpen(event.currentTarget)} aria-haspopup="dialog">
      <header><span>{topic.code}</span><i><T zh="持续更新" en="CONTINUOUS WRITING" /></i></header>
      <h2><Localized text={topic.title} /></h2>
      <p><Localized text={topic.description} /></p>
      <ul>{topic.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
      <footer><small>{topic.columns.length} <T zh="个相关专栏" en="related columns" /></small><strong><T zh="查看代表文章" en="View selected articles" /> <i aria-hidden="true">→</i></strong></footer>
    </button>
  );
}

export function WritingTopicBrowser({
  topics,
  variant = "grid",
}: {
  topics: WritingTopic[];
  variant?: "grid" | "compact";
}) {
  const [active, setActive] = useState<WritingTopic | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [copiedUrl, setCopiedUrl] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();

    fetch(`/api/csdn?topic=${encodeURIComponent(active.slug)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load articles");
        return response.json() as Promise<ArticleResponse>;
      })
      .then((data) => {
        setArticles(data.articles);
        setLoadState(data.articles.length ? "ready" : "error");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setLoadState("error");
      });

    return () => controller.abort();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      requestAnimationFrame(() => {
        if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true });
      });
    };
  }, [active]);

  const openTopic = (topic: WritingTopic, element: HTMLButtonElement) => {
    openerRef.current = element;
    setLoadState("loading");
    setArticles([]);
    setCopiedUrl("");
    setActive(topic);
  };

  const closeTopic = () => {
    setActive(null);
  };

  const copyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      window.setTimeout(() => setCopiedUrl((current) => current === url ? "" : current), 1600);
    } catch {
      setCopiedUrl("");
    }
  };

  const triggers = topics.map((topic, index) => (
    <TopicTrigger key={topic.slug} topic={topic} index={index} variant={variant} onOpen={(element) => openTopic(topic, element)} />
  ));

  return (
    <>
      {variant === "grid" ? <div className="topic-grid">{triggers}</div> : <ol className="home-topic-browser">{triggers}</ol>}
      {active && createPortal(
        <div className="writing-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeTopic(); }}>
          <section ref={dialogRef} className="writing-modal" role="dialog" aria-modal="true" aria-labelledby="writing-modal-title">
            <header className="writing-modal-header">
              <div><span>{active.code} · TECHNICAL NOTES</span><h2 id="writing-modal-title"><Localized text={active.title} /></h2><p><Localized text={active.description} /></p></div>
              <button ref={closeRef} type="button" onClick={closeTopic} aria-label="关闭专题文章 / Close topic articles">×</button>
            </header>

            <div className="writing-modal-body">
            <div className="writing-modal-columns">
              <span><T zh="相关专栏" en="RELATED COLUMNS" /></span>
              <div>{active.columns.map((column) => <a href={column.url} target="_blank" rel="noreferrer" key={column.url}><Localized text={column.title} /> <i aria-hidden="true">↗</i></a>)}</div>
            </div>

            <div className="writing-modal-feed" aria-live="polite">
              <div className="feed-heading"><div><span><T zh="代表文章" en="FEATURED ARTICLES" /></span><h3><T zh="王凯豪的专题文章" en="Selected writing by Kyle Wang" /></h3></div><p><T zh="按专题相关性与阅读量展示" en="Ordered by relevance and readership" /></p></div>

              {loadState === "loading" && <div className="article-skeletons" aria-label="正在加载 CSDN 文章"><i /><i /><i /></div>}

              {loadState === "error" && <div className="writing-feed-error"><strong><T zh="文章暂时无法加载" en="Articles are temporarily unavailable" /></strong><p><T zh="可通过上方相关专栏查看完整内容。" en="The full collection remains available through the related columns above." /></p></div>}

              {loadState === "ready" && <ol className="online-article-list">{articles.map((article, index) => <li key={article.url}>
                <article>
                  <header><span>{String(index + 1).padStart(2, "0")}</span><p><Localized text={article.column} />{article.publishedAt && <> · {formatDate(article.publishedAt)}</>}{article.views > 0 && <> · {article.views.toLocaleString("zh-CN")} <T zh="阅读" en="views" /></>}</p></header>
                  <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h3>
                  {article.summary && <p>{article.summary}</p>}
                  <footer><a className="article-address" href={article.url} target="_blank" rel="noreferrer"><span>{compactUrl(article.url)}</span><i aria-hidden="true">↗</i></a><div><button type="button" onClick={() => copyLink(article.url)}>{copiedUrl === article.url ? <T zh="已复制" en="Copied" /> : <T zh="复制链接" en="Copy link" />}</button><a href={article.url} target="_blank" rel="noreferrer"><T zh="阅读全文" en="Read article" /> <i aria-hidden="true">↗</i></a></div></footer>
                </article>
              </li>)}</ol>}
            </div>

            <footer className="writing-modal-footer"><span><T zh="这些文章记录了王凯豪在机器人软件、工业视觉与系统工程中的技术研究和实践复盘。" en="These articles document Kyle Wang's research and engineering reviews across robotics software, industrial vision, and systems." /></span><a href="https://mzkyle.blog.csdn.net" target="_blank" rel="noreferrer"><T zh="查看 CSDN 主页" en="View CSDN profile" /> ↗</a></footer>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
