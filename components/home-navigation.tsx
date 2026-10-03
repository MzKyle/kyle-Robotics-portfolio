"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./localized";

const sections = [
  { id: "selected-work", zh: "项目", en: "Projects" },
  { id: "about", zh: "关于", en: "About" },
  { id: "experience", zh: "经历", en: "Experience" },
  { id: "writing", zh: "手记", en: "Writing" },
];

export function HomeNavigation() {
  const [active, setActive] = useState("selected-work");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * .32) current = section.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <nav className="home-navigation" aria-label="首页目录 / Page sections">
    {sections.map(section => <a href={`#${section.id}`} key={section.id} aria-current={active === section.id ? "location" : undefined}>
      <span className="home-navigation-line" aria-hidden="true" /><T zh={section.zh} en={section.en} />
    </a>)}
  </nav>;
}

export function AmbientLight() {
  const light = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let frame = 0;
    let x = window.innerWidth * .65;
    let y = 180;
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        light.current?.style.setProperty("--light-x", `${x}px`);
        light.current?.style.setProperty("--light-y", `${y}px`);
        frame = 0;
      });
    };
    const updatePreference = () => {
      window.removeEventListener("pointermove", move);
      if (!reducedMotion.matches && finePointer.matches) window.addEventListener("pointermove", move, { passive: true });
      else { cancelAnimationFrame(frame); frame = 0; }
    };
    updatePreference();
    reducedMotion.addEventListener("change", updatePreference);
    finePointer.addEventListener("change", updatePreference);
    return () => {
      window.removeEventListener("pointermove", move);
      reducedMotion.removeEventListener("change", updatePreference);
      finePointer.removeEventListener("change", updatePreference);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="site-ambient-light" ref={light} aria-hidden="true" />;
}
