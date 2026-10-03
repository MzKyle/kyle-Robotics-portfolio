"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "./localized";

const email = "2972689924@qq.com";

export function EmailContact({ linkClassName }: { linkClassName?: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const pending = useRef(false);
  const [feedback, setFeedback] = useState<"idle" | "copied" | "selected" | "unavailable">("idle");

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    if (pending.current) return;
    pending.current = true;
    let result: typeof feedback = "copied";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const selection = window.getSelection();
      if (link.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(link.current);
        selection.removeAllRanges();
        selection.addRange(range);
        result = "selected";
      } else result = "unavailable";
    } finally {
      pending.current = false;
    }
    if (!mounted.current) return;
    setFeedback(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback("idle"), 2600);
  }

  const message = feedback === "copied" ? <T zh="已复制" en="Copied" /> : feedback === "selected" ? <T zh="已选中，请手动复制" en="Selected; copy manually" /> : <T zh="请手动复制邮箱" en="Please copy the address manually" />;

  return <div className="email-contact">
    <a ref={link} href={`mailto:${email}`} className={linkClassName}>{email}</a>
    <button type="button" className="email-copy" onClick={copy} aria-label="复制邮箱地址 / Copy email address">
      <svg viewBox="0 0 20 20" aria-hidden="true">{feedback === "copied" ? <path d="m4 10 4 4 8-8" /> : <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M12 4V3H3v9h1" /></>}</svg>
      {feedback === "idle" ? <T zh="复制" en="Copy" /> : message}
    </button>
    <span className="email-copy-status" role="status">{feedback !== "idle" && message}</span>
  </div>;
}
