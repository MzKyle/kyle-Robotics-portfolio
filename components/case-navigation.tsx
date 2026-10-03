"use client";

import { useEffect, useRef, useState } from "react";
import type { LocalizedText } from "../lib/portfolio";
import { Localized } from "./localized";

export type CaseSection = { id: string; label: LocalizedText };

export function CaseNavigation({ sections }: { sections: CaseSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const navigation = useRef<HTMLElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const boundary = (navigation.current?.getBoundingClientRect().bottom ?? 124) + 36;
      let current = sections[0]?.id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= boundary) current = section.id;
      }
      if (window.scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = sections.at(-1)?.id ?? current;
      setActive(current);
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
  }, [sections]);

  useEffect(() => {
    const nav = navigation.current;
    const link = nav?.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    const bounds = nav.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.left < bounds.left + 12 || item.right > bounds.right - 12) {
      nav.scrollBy({ left: item.left - bounds.left - (nav.clientWidth - item.width) / 2, behavior: "instant" });
    }
  }, [active]);

  return <nav className="case-jump-nav" ref={navigation} aria-label="案例目录 / Case navigation">
    {sections.map((section, index) => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>
      <span>{String(index + 1).padStart(2, "0")}</span><Localized text={section.label} />
    </a>)}
  </nav>;
}
