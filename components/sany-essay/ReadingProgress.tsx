"use client";

import { useEffect, useState } from "react";
import type { EssayChapter } from "../../lib/sany-essay-content";

export function ReadingProgress({ chapters }: { chapters: Pick<EssayChapter, "id" | "number" | "title">[] }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(chapters[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(100, window.scrollY / total * 100));
      const current = chapters.filter((chapter) => {
        const element = document.getElementById(chapter.id);
        return element !== null && element.getBoundingClientRect().top < window.innerHeight * 0.35;
      }).at(-1);
      setActive(current?.id ?? chapters[0]?.id ?? "");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [chapters]);

  return <><div className="essay-reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" /><nav className="essay-chapter-rail" aria-label="Essay chapters">{chapters.map((chapter) => <a href={`#${chapter.id}`} key={chapter.id} aria-current={active === chapter.id ? "location" : undefined} aria-label={`${chapter.number} ${chapter.title.zh} / ${chapter.title.en}`}>{chapter.number}</a>)}</nav></>;
}
