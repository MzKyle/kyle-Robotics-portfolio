"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MobileNavigation({ children }: { children: ReactNode }) {
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) menu.current.open = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        event.preventDefault();
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <details className="mobile-navigation" ref={menu}>
      <summary aria-label="页面导航 / Site navigation"><span aria-hidden="true">☰</span></summary>
      <div className="mobile-navigation-panel" onClick={(event) => {
        if ((event.target as HTMLElement).closest("a") && menu.current) menu.current.open = false;
      }}>{children}</div>
    </details>
  );
}
