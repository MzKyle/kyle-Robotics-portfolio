"use client";

import { useState } from "react";
import { T } from "../localized";
import { cameraFpsChoices, cameraIntervalMs, idealQuantizationBoundMs, robotIntervalMs, sampleTimes, type CameraFps } from "../../lib/sany-essay-model";

const durationMs = 100;

function SamplingTrack({ title, note, times, cursor, camera = false }: { title: string; note: string; times: number[]; cursor: number; camera?: boolean }) {
  return <div className="essay-sampling-track">
    <div className="essay-track-label"><strong>{title}</strong><small>{note}</small></div>
    <div className="essay-track-line" aria-hidden="true">
      {times.map((time, index) => <i className={camera ? "camera" : "robot"} key={index} style={{ left: `${time}%` }} />)}
      <span className="essay-time-cursor" style={{ left: `${cursor}%` }} />
    </div>
  </div>;
}

export function SamplingMismatch() {
  const [fps, setFps] = useState<CameraFps>(120);
  const [cursor, setCursor] = useState(41);
  const robotTimes = sampleTimes(60, durationMs);
  const cameraTimes = sampleTimes(fps, durationMs);
  const nearestRobot = robotTimes.reduce((nearest, time) => Math.abs(time - cursor) < Math.abs(nearest - cursor) ? time : nearest, robotTimes[0]);

  return <figure className="essay-figure essay-sampling" aria-labelledby="sampling-title">
    <div className="essay-figure-top"><div><span className="essay-figure-number">INTERACTIVE FIGURE 01</span><h3 id="sampling-title"><T zh="采样频率实验台" en="Sampling frequency playground" /></h3></div><span className="essay-concept-label"><T zh="概念示意 · 非实测波形" en="Conceptual · not measured traces" /></span></div>
    <div className="essay-figure-controls"><div className="essay-control-group" role="group" aria-label="Camera RAW sampling rate"><span><T zh="相机 RAW 采样率" en="Camera RAW sampling" /></span><div>{cameraFpsChoices.map((choice) => <button type="button" key={choice} aria-pressed={choice === fps} onClick={() => setFps(choice)}>{choice} Hz</button>)}</div></div></div>
    <div className="essay-sampling-axes">
      <SamplingTrack title="Robot State" note="≈60 Hz" times={robotTimes} cursor={cursor} />
      <SamplingTrack title="RAW Camera" note={`${fps} Hz`} times={cameraTimes} cursor={cursor} camera />
      <div className="essay-axis-scale"><span>0 ms</span><span>50 ms</span><span>100 ms</span></div>
    </div>
    <label className="essay-time-slider"><span><T zh="观察时间游标" en="Observation cursor" /></span><input type="range" min="0" max="100" step="0.1" value={cursor} onChange={(event) => setCursor(Number(event.target.value))} /><output>{cursor.toFixed(1)} ms</output></label>
    <dl className="essay-sampling-values"><div><dt><T zh="机器人采样间隔" en="Robot interval" /></dt><dd>≈{robotIntervalMs.toFixed(2)} ms</dd></div><div><dt><T zh="相机采样间隔" en="Camera interval" /></dt><dd>{cameraIntervalMs(fps).toFixed(2)} ms</dd></div><div><dt><T zh="理想最近邻上界" en="Ideal nearest-frame bound" /></dt><dd>±{idealQuantizationBoundMs(fps).toFixed(2)} ms</dd></div></dl>
    <figcaption><T zh={`游标位于 ${cursor.toFixed(1)} ms；最近的真实机器人状态采样在 ${nearestRobot.toFixed(1)} ms。其间的插值值仍是估计，不是新观测。`} en={`At ${cursor.toFixed(1)} ms, the nearest real robot-state sample is at ${nearestRobot.toFixed(1)} ms. Interpolated values between samples remain estimates, not new observations.`} /></figcaption>
  </figure>;
}
