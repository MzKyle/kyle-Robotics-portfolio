"use client";

import { useEffect, useState } from "react";
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(100, window.scrollY / total * 100));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  return <div className="essay-reading-progress" style={{ width: `${progress}%` }} aria-hidden="true" />;
}
