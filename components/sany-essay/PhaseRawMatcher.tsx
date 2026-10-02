"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { T } from "../localized";
import { CaseFigure } from "./CaseLayout";
import { cameraFpsChoices, idealQuantizationBoundMs, nearestCameraFrame, sampleTimes, type CameraFps } from "../../lib/sany-essay-model";

type PhaseId = "right" | "center" | "left";
const phases: { id: PhaseId; eventMs: number; zh: string; en: string }[] = [
  { id: "right", eventMs: 29.1, zh: "右极值", en: "Right peak" },
  { id: "center", eventMs: 54.1, zh: "中心过零", en: "Center crossing" },
  { id: "left", eventMs: 79.1, zh: "左极值", en: "Left peak" },
];
// Fixed SVG precision keeps server and browser rendering identical across JS math runtimes.
const plotX = (time: number) => Number((40 + time * 9.2).toFixed(2));
const plotY = (time: number) => Number((100 - 58 * Math.sin(2 * Math.PI * (time - 4.1) / 100)).toFixed(2));
const weavePath = Array.from({ length: 201 }, (_, index) => {
  const time = index / 2;
  return `${index === 0 ? "M" : "L"}${plotX(time).toFixed(1)} ${plotY(time).toFixed(1)}`;
}).join(" ");

export function PhaseRawMatcher() {
  const [fps, setFps] = useState<CameraFps>(120);
  const [phaseId, setPhaseId] = useState<PhaseId>("right");
  const [cursor, setCursor] = useState(0);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const phase = phases.find((item) => item.id === phaseId)!;
  const selected = nearestCameraFrame(phase.eventMs, fps);
  const frames = sampleTimes(fps, 100);
  const robotSamples = sampleTimes(60, 100);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(preference.matches); if (preference.matches) setRunning(false); };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!running || reducedMotion) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      setCursor((current) => (current + Math.min(now - previous, 100) * 0.025) % 100);
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reducedMotion]);

  return <CaseFigure id="matcher" number="04" label="PHASE-ALIGNED SELECTION" className="essay-matcher" title={{ zh: "从目标相位到真实 RAW 关键帧", en: "From target phase to a real RAW key frame" }} note={{ zh: "100 ms 概念时间窗", en: "100 ms conceptual time window" }} caption={<T zh="数值仅用于概念演示：事件时间、周期与采样起点均非项目实测。相机帧越密，理想最近邻误差上界越低；单个事件的实际匹配误差仍取决于事件与采样网格的相对位置。" en="Conceptual numbers only: event time, period, and sample origin are not project measurements. Denser camera sampling lowers the ideal nearest-frame bound; an individual event's error still depends on its position relative to the sampling grid." />}>
    <div className="essay-matcher-controls"><div className="essay-control-group" role="group" aria-label="Camera RAW sampling rate"><span><T zh="相机 RAW 采样" en="Camera RAW sampling" /></span><div>{cameraFpsChoices.map((choice) => <button type="button" key={choice} aria-pressed={fps === choice} onClick={() => setFps(choice)}>{choice} Hz</button>)}</div></div><div className="essay-control-group" role="group" aria-label="Target weaving phase"><span><T zh="目标摆弧相位" en="Target weave phase" /></span><div>{phases.map((item) => <button type="button" key={item.id} aria-pressed={phaseId === item.id} onClick={() => setPhaseId(item.id)}><T zh={item.zh} en={item.en} /></button>)}</div></div><button className="essay-play-button" type="button" aria-pressed={running} onClick={() => reducedMotion ? setCursor((current) => (current + 10) % 100) : setRunning((current) => !current)}><T zh={reducedMotion ? "步进观察" : running ? "暂停运动" : "播放运动"} en={reducedMotion ? "Step marker" : running ? "Pause motion" : "Play motion"} /></button></div>
    <div className="essay-matcher-stage">
      <div className="essay-matcher-curve-label"><strong><T zh="机器人摆弧曲线" en="Robot weaving curve" /></strong><span><T zh="离散黑点 = ≈60 Hz 状态观测" en="Black dots = ≈60 Hz state observations" /></span></div>
      <svg className="essay-matcher-curve" viewBox="0 12 1000 165" preserveAspectRatio="none" role="img" aria-label="Conceptual periodic weave curve with 60 Hz robot samples, target phase, and moving position marker">
        <path className="essay-graph-axis" d="M40 100H960" />
        <path className="essay-matcher-wave" d={weavePath} />
        {robotSamples.map((time) => <circle className="essay-robot-observation" key={time} cx={plotX(time)} cy={plotY(time)} r="4" />)}
        <path className="essay-target-line" d={`M${plotX(phase.eventMs)} 16V176`} />
        <circle className="essay-target-dot" cx={plotX(phase.eventMs)} cy={plotY(phase.eventMs)} r="8" />
        <circle className="essay-motion-marker" cx={plotX(cursor)} cy={plotY(cursor)} r="6" />
      </svg>
      <div className="essay-matcher-link" style={{ "--phase-position": `${4 + phase.eventMs * .92}%` } as CSSProperties}><span>t<sub>phase</sub></span><i aria-hidden="true">↓</i></div>
      <div className="essay-matcher-raw-label"><strong><T zh="真实 RAW 采样时间轴" en="Real RAW sampling timeline" /></strong><span>{fps} Hz · {frames.length} <T zh="个示意采样点" en="illustrative sample points" /></span></div>
      <div className="essay-matcher-raw-track" aria-hidden="true">{frames.map((time, index) => <i className={index === selected.index ? "selected" : ""} key={index} style={{ left: `${time}%` }} />)}<span className="essay-raw-target" style={{ left: `${phase.eventMs}%` }} /><b className="essay-key-raw" style={{ left: `${selected.timeMs}%` }}>KEY RAW</b></div>
      <div className="essay-axis-scale"><span>0 ms</span><span>50 ms</span><span>100 ms</span></div>
    </div>
    <dl className="essay-matcher-readout" aria-live="polite"><div><dt><T zh="估计事件" en="Estimated event" /></dt><dd>t<sub>phase</sub> = {phase.eventMs.toFixed(1)} ms</dd></div><div><dt><T zh="最近 RAW 帧" en="Nearest RAW" /></dt><dd>t<sub>cam</sub> = {selected.timeMs.toFixed(2)} ms</dd></div><div><dt><T zh="示例匹配误差" en="Example match error" /></dt><dd>Δt = {selected.errorMs.toFixed(2)} ms</dd></div><div><dt><T zh="理想误差上界" en="Ideal error bound" /></dt><dd>±{idealQuantizationBoundMs(fps).toFixed(2)} ms</dd></div></dl>
  </CaseFigure>;
}
