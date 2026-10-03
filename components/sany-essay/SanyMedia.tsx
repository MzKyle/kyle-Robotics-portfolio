"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LocalizedText } from "../../lib/portfolio";
import type { SanyMediaName } from "../../lib/sany-essay-content";
import { Localized, T } from "../localized";

// Register only approved public assets. An empty registry produces no media
// markup, image requests, captions, or reserved layout space.
const approvedMedia: Partial<Record<SanyMediaName, { src: string; width: number; height: number }>> = {};

export function SanyMedia({ name, caption }: { name: SanyMediaName; caption: LocalizedText }) {
  const media = approvedMedia[name];
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!media) return;
    const probe = new window.Image();
    probe.onload = () => setLoadedSrc(media.src);
    probe.src = media.src;
    return () => { probe.onload = null; };
  }, [media]);
  if (!media || loadedSrc !== media.src) return null;
  return <figure className="case-figure essay-media">
    <Image src={media.src} alt={caption.zh} width={media.width} height={media.height} unoptimized sizes="(max-width: 760px) calc(100vw - 44px), 860px" />
    <figcaption><Localized text={caption} /></figcaption>
  </figure>;
}

export function SanyHeroVisual() {
  return <figure className="essay-hero-visual">
    <div className="essay-hero-signal"><span className="essay-hero-signal-label">ROBOT STATE ≈60 Hz</span>
      <svg viewBox="0 0 700 340" role="img" aria-label="Conceptual robot motion, estimated phase event, and real RAW samples">
        <path d="M25 260H675M25 100H675" className="essay-hero-signal-axis" />
        <path d="M25 190 C88 78 151 78 214 190 S340 302 403 190 S529 78 592 190 S650 290 675 252" className="essay-hero-signal-wave" />
        <path d="M403 30V310" className="essay-hero-signal-phase" />
        <circle cx="403" cy="190" r="8" className="essay-hero-signal-point" />
        {Array.from({ length: 13 }, (_, index) => <circle key={index} cx={Number((25 + index * 54.16).toFixed(2))} cy="260" r={index === 7 ? 8 : 4} className={index === 7 ? "essay-hero-signal-raw selected" : "essay-hero-signal-raw"} />)}
      </svg>
      <div className="essay-hero-signal-bottom"><span>t<sub>phase</sub></span><span>RAW 120–200 Hz</span></div>
    </div>
    <figcaption><T zh="运动相位 → 真实关键帧 · 概念示意" en="Motion phase → real key frame · conceptual" /></figcaption>
  </figure>;
}
