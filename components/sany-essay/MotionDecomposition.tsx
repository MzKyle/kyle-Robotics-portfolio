"use client";

import { useState } from "react";
import { T } from "../localized";

type Signal = "tcp" | "seam" | "weave";

const samples = Array.from({ length: 151 }, (_, index) => index / 1.5);
const x = (time: number) => 42 + time * 8.16;
const seam = (time: number) => 210 - 0.58 * time;
const weave = (time: number) => 39 * Math.sin(2 * Math.PI * time / 34);
const path = (value: (time: number) => number) => samples.map((time, index) => `${index === 0 ? "M" : "L"}${x(time).toFixed(1)} ${value(time).toFixed(1)}`).join(" ");

const paths = {
  tcp: path((time) => seam(time) + weave(time)),
  seam: path(seam),
  weave: path((time) => 208 + weave(time)),
};

export function MotionDecomposition() {
  const [visible, setVisible] = useState<Record<Signal, boolean>>({ tcp: true, seam: true, weave: true });
  const controls: { id: Signal; label: string; zh: string; en: string }[] = [
    { id: "tcp", label: "TCP", zh: "整体轨迹", en: "Combined motion" },
    { id: "seam", label: "SEAM", zh: "慢变趋势", en: "Slow trend" },
    { id: "weave", label: "WEAVE", zh: "周期摆弧", en: "Periodic weave" },
  ];

  return <figure className="essay-figure essay-motion" aria-labelledby="motion-title">
    <div className="essay-figure-top"><div><span className="essay-figure-number">INTERACTIVE FIGURE 02</span><h3 id="motion-title"><T zh="运动分解观察器" en="Motion decomposition explorer" /></h3></div><span className="essay-concept-label"><T zh="局部平移模型 · 概念曲线" en="Local translation model · conceptual curves" /></span></div>
    <div className="essay-motion-toggle" role="group" aria-label="Visible motion components">{controls.map((control) => <button type="button" key={control.id} className={`essay-signal-${control.id}`} aria-pressed={visible[control.id]} onClick={() => setVisible((current) => ({ ...current, [control.id]: !current[control.id] }))}><i aria-hidden="true" /><span>{control.label}</span><small><T zh={control.zh} en={control.en} /></small></button>)}</div>
    <svg viewBox="0 105 900 150" className="essay-motion-svg" role="img" aria-label="Toggable local motion curves showing slow seam motion, periodic weave, and their combined TCP path">
      <path className="essay-graph-axis" d="M42 35V250H867M42 105H867M42 175H867M42 245H867" />
      {visible.seam && <path className="essay-motion-seam" d={paths.seam} />}
      {visible.weave && <path className="essay-motion-weave" d={paths.weave} />}
      {visible.tcp && <path className="essay-motion-tcp" d={paths.tcp} />}
    </svg>
    <div className="essay-motion-equation">p<sub>TCP</sub>(t) = p<sub>seam</sub>(t) + p<sub>weave</sub>(t)</div>
    <figcaption><T zh="关闭某条曲线可单独观察慢变趋势和周期摆弧如何组成 TCP 局部运动。曲线用于解释结构，不代表项目实测轨迹或完整六自由度运动。" en="Hide a curve to see how slow trend and periodic weave form local TCP motion. The curves explain structure; they are not measured project traces or full six-degree-of-freedom motion." /></figcaption>
  </figure>;
}
