"use client";

import { useEffect } from "react";

function applyLanguage(language: "zh" | "en") {
  document.documentElement.dataset.language = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
}

export function PreferenceControl() {
  useEffect(() => {
    try {
      applyLanguage(localStorage.getItem("portfolio-language") === "en" ? "en" : "zh");
    } catch {
      // The language switch still works when browser storage is unavailable.
    }
  }, []);

  return (
    <button className="language-toggle" type="button" onClick={() => {
      const language = document.documentElement.dataset.language === "en" ? "zh" : "en";
      applyLanguage(language);
      try { localStorage.setItem("portfolio-language", language); } catch { /* Device-local preference is optional. */ }
    }}>
      <span className="lang-zh" lang="en" aria-label="Switch to English">EN</span>
      <span className="lang-en" lang="zh-CN" aria-label="切换为中文">中文</span>
    </button>
  );
}
