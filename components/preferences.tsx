"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Language = "zh" | "en";
type Theme = "industrial" | "minimal";

function applyPreferences(language: Language, theme: Theme) {
  document.documentElement.dataset.language = language;
  document.documentElement.dataset.theme = theme;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
}

export function PreferenceControl() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("zh");
  const [theme, setTheme] = useState<Theme>("minimal");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("portfolio-language") === "en" ? "en" : "zh";
    const savedTheme = localStorage.getItem("portfolio-theme") === "industrial" ? "industrial" : "minimal";
    applyPreferences(savedLanguage, savedTheme);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const chooseLanguage = (value: Language) => {
    setLanguage(value);
    localStorage.setItem("portfolio-language", value);
    applyPreferences(value, theme);
  };

  const chooseTheme = (value: Theme) => {
    setTheme(value);
    localStorage.setItem("portfolio-theme", value);
    applyPreferences(language, value);
  };

  const openPanel = () => {
    const currentLanguage = document.documentElement.dataset.language === "en" ? "en" : "zh";
    const currentTheme = document.documentElement.dataset.theme === "industrial" ? "industrial" : "minimal";
    setLanguage(currentLanguage);
    setTheme(currentTheme);
    setOpen(true);
  };

  return (
    <>
      <button className="settings-trigger" type="button" onClick={openPanel} aria-label="页面设置 / Display settings">
        <span aria-hidden="true">◫</span><b><span className="lang-zh">设置</span><span className="lang-en">SETTINGS</span></b>
      </button>
      {open && createPortal(<div className="settings-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <header><div><span>{language === "zh" ? "显示偏好" : "DISPLAY PREFERENCES"}</span><h2 id="settings-title">{language === "zh" ? "页面设置" : "Display settings"}</h2></div><button type="button" onClick={() => setOpen(false)} aria-label={language === "zh" ? "关闭设置" : "Close settings"}>×</button></header>
          <div className="setting-group">
            <div><strong>{language === "zh" ? "显示语言" : "Language"}</strong><p>{language === "zh" ? "切换全站主要内容与界面文案。" : "Switch the main site content and interface copy."}</p></div>
            <div className="segmented-control" role="group" aria-label={language === "zh" ? "显示语言" : "Display language"}>
              <button className={language === "zh" ? "selected" : ""} type="button" onClick={() => chooseLanguage("zh")} aria-pressed={language === "zh"}>中文</button>
              <button className={language === "en" ? "selected" : ""} type="button" onClick={() => chooseLanguage("en")} aria-pressed={language === "en"}>English</button>
            </div>
          </div>
          <div className="setting-group">
            <div><strong>{language === "zh" ? "渲染风格" : "Visual style"}</strong><p>{language === "zh" ? "默认使用轻量、聚焦内容的简约界面，也可以切换为深色科技界面。" : "The focused minimal interface is the default, with an optional dark technology style."}</p></div>
            <div className="theme-options" role="group" aria-label={language === "zh" ? "渲染风格" : "Visual style"}>
              <button className={theme === "minimal" ? "selected" : ""} type="button" onClick={() => chooseTheme("minimal")} aria-pressed={theme === "minimal"}>
                <i className="theme-swatch minimal-swatch"><span /><span /><span /></i><strong>{language === "zh" ? "简约风格" : "Minimal"}</strong><small>{language === "zh" ? "默认 · 浅色 · 聚焦内容" : "Default · light · focused"}</small>
              </button>
              <button className={theme === "industrial" ? "selected" : ""} type="button" onClick={() => chooseTheme("industrial")} aria-pressed={theme === "industrial"}>
                <i className="theme-swatch industrial-swatch"><span /><span /><span /></i><strong>{language === "zh" ? "科技风格" : "Technology"}</strong><small>{language === "zh" ? "深色 · 数据面板 · 网格" : "Dark · data panels · grid"}</small>
              </button>
            </div>
          </div>
          <footer>{language === "zh" ? "设置会保存在当前浏览器中。" : "Preferences are saved in this browser."}</footer>
        </section>
      </div>, document.body)}
    </>
  );
}
