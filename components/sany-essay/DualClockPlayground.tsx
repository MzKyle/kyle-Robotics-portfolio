"use client";

import { useEffect, useState } from "react";
import { T } from "../localized";

const maxRuntime = 60;
const conceptualDriftPerSecond = 0.5;
const x = (time: number) => 55 + time * 14.4;
const y = (offset: number) => 190 - offset * 4.6;

function driftPath(anchors: number[], runtime: number) {
  let d = "";
  for (let index = 0; index < anchors.length; index++) {
    const anchor = anchors[index];
    const end = Math.min(runtime, anchors[index + 1] ?? runtime);
    if (end < anchor) continue;
    d += `${d ? " " : ""}M${x(anchor).toFixed(1)} ${y(0)} L${x(end).toFixed(1)} ${y((end - anchor) * conceptualDriftPerSecond).toFixed(1)}`;
    if (anchors[index + 1] !== undefined) d += ` L${x(end).toFixed(1)} ${y(0)}`;
  }
  return d;
}

export function DualClockPlayground() {
  const [runtime, setRuntime] = useState(0);
  const [anchors, setAnchors] = useState([0]);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastAnchor = anchors[anchors.length - 1];
  const mappedOffset = (runtime - lastAnchor) * conceptualDriftPerSecond;
  const physicalDifference = runtime * conceptualDriftPerSecond;

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
    let currentRuntime = runtime;
    const tick = (now: number) => {
      currentRuntime = Math.min(maxRuntime, currentRuntime + Math.min(now - previous, 100) * 0.006);
      setRuntime(currentRuntime);
      previous = now;
      if (currentRuntime >= maxRuntime) { setRunning(false); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, reducedMotion, runtime]);

  const startOrStep = () => {
    if (reducedMotion) setRuntime((current) => Math.min(maxRuntime, current + 10));
    else if (runtime >= maxRuntime) { setRuntime(0); setAnchors([0]); setRunning(true); }
    else setRunning((current) => !current);
  };

  return <figure className="essay-figure essay-clock" aria-labelledby="clock-title">
    <div className="essay-figure-top"><div><span className="essay-figure-number">INTERACTIVE FIGURE 04 / CLOCKS</span><h3 id="clock-title"><T zh="双时钟与重新同步" en="Dual clocks and resynchronization" /></h3></div><span className="essay-concept-label"><T zh="加速概念模拟 · 漂移速率非项目实测" en="Accelerated conceptual simulation · drift rate not measured" /></span></div>
    <div className="essay-clock-controls"><button type="button" onClick={startOrStep} aria-pressed={running}><T zh={reducedMotion ? "推进 10 秒" : running ? "暂停" : runtime >= maxRuntime ? "重新开始" : "开始"} en={reducedMotion ? "Step 10 s" : running ? "Pause" : runtime >= maxRuntime ? "Restart" : "Start"} /></button><button type="button" onClick={() => { setAnchors((current) => [...current, runtime]); setRunning(false); }} disabled={runtime === lastAnchor}><T zh="重新同步" en="Resync" /></button><button type="button" onClick={() => { setRuntime(0); setAnchors([0]); setRunning(false); }}><T zh="复位" en="Reset" /></button></div>
    <div className="essay-clock-readout" aria-live="polite"><div><span>CAMERA CLOCK</span><strong>{runtime.toFixed(2)} s</strong></div><div><span>ROBOT CLOCK</span><strong>{(runtime + physicalDifference / 1000).toFixed(2)} s</strong></div><div><span><T zh="当前映射残余偏差" en="Current mapping residual" /></span><strong>Δt = {mappedOffset.toFixed(1)} ms</strong></div></div>
    <svg className="essay-clock-svg" viewBox="0 0 980 240" role="img" aria-label="Conceptual mapped clock offset grows after each synchronization anchor and returns to zero when resynchronized">
      <path className="essay-graph-axis" d="M55 25V190H925M55 190H925M55 120H925M55 50H925" />
      <path className="essay-clock-drift" d={driftPath(anchors, runtime)} />
      {anchors.map((anchor, index) => <g key={`${anchor}-${index}`}><path className="essay-clock-anchor" d={`M${x(anchor)} 25V190`} /><circle cx={x(anchor)} cy="190" r="5" className="essay-clock-anchor-dot" /></g>)}
      <circle cx={x(runtime)} cy={y(mappedOffset)} r="7" className="essay-clock-now" />
      <text x="58" y="220">0</text><text x="815" y="220">runtime →</text><text x="8" y="43">Δt</text>
    </svg>
    <div className="essay-clock-mapping"><span>C<sub>cam</sub> → t<sub>cam</sub></span><span>C<sub>robot</sub> → t<sub>robot</sub></span><strong><T zh="共同软件时间轴" en="Common software timeline" /></strong><span>t<sub>phase</sub> ↔ t<sub>RAW</sub></span></div>
    <figcaption><T zh="点击重新同步只更新软件映射锚点，不能改变两枚硬件时钟的实际频率。图中运行速度、计时差和斜率均为教学模拟，不代表本项目测得的漂移率。系统实际采用设备计数映射与空闲窗口周期性重同步。" en="Resync updates the software mapping anchor; it does not change either hardware clock's rate. Runtime, displayed offset, and slope are teaching values, not a measured project drift rate. The actual design uses device-counter mapping and periodic idle-window resynchronization." /></figcaption>
  </figure>;
}
