"use client";

import { useEffect } from "react";

// Preserve deep links when supporting case material is collapsed.
export function HashDisclosures() {
  useEffect(() => {
    const reveal = (hash: string, scroll = false) => {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      let element: HTMLElement | null = target;
      while (element) {
        if (element instanceof HTMLDetailsElement) element.open = true;
        element = element.parentElement;
      }
      if (scroll) target.scrollIntoView({ block: "start" });
    };
    const onHashChange = () => reveal(location.hash, true);
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (link) reveal(link.hash);
    };
    const frame = requestAnimationFrame(() => { if (location.hash) reveal(location.hash, true); });
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
