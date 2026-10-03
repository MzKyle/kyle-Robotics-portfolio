"use client";

import { useState } from "react";
import { T } from "./localized";

export function ResumePdfPreview() {
  const [open, setOpen] = useState(false);
  return <section className="pdf-preview section-shell">
    <div><p className="section-kicker"><T zh="PDF 简历" en="RESUME PDF" /></p><h2><T zh="完整简历" en="Full résumé" /></h2><a href="/resume.pdf" target="_blank" rel="noreferrer"><T zh="打开 PDF" en="Open PDF" /> ↗</a></div>
    <details className="resume-pdf-disclosure" onToggle={event => setOpen(event.currentTarget.open)}>
      <summary><T zh="展开 PDF 预览" en="Expand PDF preview" /><span aria-hidden="true">+</span></summary>
      {open && <iframe className="resume-pdf-frame" src="/resume.pdf" loading="lazy" title="王凯豪简历 PDF / Kyle Wang résumé PDF" />}
    </details>
    <p className="resume-pdf-mobile"><T zh="在浏览器中打开完整简历，或下载后查看。" en="Open the full résumé in your browser, or download it to read." /> <a href="/resume.pdf" download="王凯豪简历.pdf"><T zh="下载 PDF" en="Download PDF" /> ↓</a></p>
  </section>;
}
