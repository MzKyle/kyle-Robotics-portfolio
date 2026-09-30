"use client";

import { useRef, type ReactNode } from "react";

export function MobileNavigation({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <details className="mobile-navigation" ref={menu} onKeyDown={(event) => {
      if (event.key === "Escape" && menu.current) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }}>
      <summary aria-label="页面导航 / Site navigation"><span aria-hidden="true">☰</span></summary>
      <div className="mobile-navigation-panel" onClick={(event) => {
        if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
      }}>{children}</div>
    </details>
  );
}
