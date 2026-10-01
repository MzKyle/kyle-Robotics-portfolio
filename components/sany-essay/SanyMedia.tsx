"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { LocalizedText } from "../../lib/portfolio";
import type { SanyMediaName } from "../../lib/sany-essay-content";
import { Localized, T } from "../localized";

const mediaPath = (name: SanyMediaName) => `/images/projects/sany/${name}`;

function useAvailableMedia(name: SanyMediaName) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    // TODO: replace placeholders by adding sanitized, approved files with these exact names.
    const probe = new window.Image();
    probe.onload = () => setAvailable(true);
    probe.onerror = () => setAvailable(false);
    probe.src = mediaPath(name);
    return () => { probe.onload = null; probe.onerror = null; };
  }, [name]);
  return available;
}

export function SanyMedia({ name, caption }: { name: SanyMediaName; caption: LocalizedText }) {
  const available = useAvailableMedia(name);
  return <figure className={`essay-media ${available ? "essay-media-loaded" : "essay-media-placeholder"}`}>
    <div className="essay-media-visual">{available ? <Image src={mediaPath(name)} alt={caption.zh} fill unoptimized sizes="(max-width: 760px) 100vw, 900px" style={{ objectFit: "contain" }} /> : <div><span>SANITIZED PROJECT MEDIA PLACEHOLDER</span><strong>{name}</strong><small><T zh="等待添加脱敏的真实项目素材" en="Awaiting sanitized real project media" /></small></div>}</div>
    <figcaption><Localized text={caption} /></figcaption>
  </figure>;
}

export function SanyHeroVisual() {
  const available = useAvailableMedia("hero-robot.webp");
  return <figure className="essay-hero-visual">{available ? <div className="essay-hero-photo"><Image src={mediaPath("hero-robot.webp")} alt="Sanitized industrial welding robot project photograph" fill unoptimized priority sizes="(max-width: 900px) 100vw, 45vw" style={{ objectFit: "cover" }} /></div> : <div className="essay-hero-signal"><span className="essay-hero-signal-label">ROBOT STATE ≈60 Hz</span><svg viewBox="0 0 700 340" role="img" aria-label="Abstract signal illustration of robot state, phase event, and RAW sampling"><path d="M25 260H675M25 100H675" className="essay-hero-signal-axis" /><path d="M25 190 C88 78 151 78 214 190 S340 302 403 190 S529 78 592 190 S650 290 675 252" className="essay-hero-signal-wave" /><path d="M403 30V310" className="essay-hero-signal-phase" /><circle cx="403" cy="190" r="8" className="essay-hero-signal-point" />{Array.from({ length: 13 }, (_, index) => <circle key={index} cx={25 + index * 54.16} cy="260" r={index === 7 ? 8 : 4} className="essay-hero-signal-raw" />)}</svg><div className="essay-hero-signal-bottom"><span>t<sub>phase</sub></span><span>RAW 120–200 Hz → KEY FRAME</span></div></div>}<figcaption>{available ? <T zh="脱敏项目现场素材" en="Sanitized project photograph" /> : <T zh="抽象信号示意 · Sanitized project media placeholder：hero-robot.webp" en="Abstract signal diagram · sanitized project media placeholder: hero-robot.webp" />}</figcaption></figure>;
}
