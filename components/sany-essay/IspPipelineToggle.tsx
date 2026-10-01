"use client";

import { useState } from "react";
import { T } from "../localized";

export function IspPipelineToggle() {
  const [mode, setMode] = useState<"traditional" | "redesigned">("redesigned");
  return <figure className="essay-figure essay-isp" aria-labelledby="isp-title">
    <div className="essay-figure-top"><div><span className="essay-figure-number">TOGGLE FIGURE / ISP</span><h3 id="isp-title"><T zh="ISP 在链路中的位置" en="Where ISP sits in the path" /></h3></div><span className="essay-concept-label"><T zh="架构对比 · 非吞吐 benchmark" en="Architecture comparison · not a throughput benchmark" /></span></div>
    <div className="essay-isp-switch" role="group" aria-label="ISP pipeline architecture"><button type="button" aria-pressed={mode === "traditional"} onClick={() => setMode("traditional")}><T zh="传统串行链路" en="Traditional serial path" /></button><button type="button" aria-pressed={mode === "redesigned"} onClick={() => setMode("redesigned")}><T zh="相位感知重构" en="Phase-aware redesign" /></button></div>
    {mode === "traditional" ? <div className="essay-isp-path" key="traditional"><div><small>01</small><strong>Sensor</strong></div><i>→</i><div><small>02</small><strong>RAW</strong></div><i>→</i><div className="essay-isp-critical"><small>CRITICAL PATH</small><strong>ISP</strong></div><i>→</i><div><small>04</small><strong>Image</strong></div><i>→</i><div><small>05</small><strong>Algorithm</strong></div></div> : <div className="essay-isp-redesigned" key="redesigned"><div className="essay-isp-raw"><span>Sensor → RAW history</span><div aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i className={index === 7 ? "selected" : ""} key={index} />)}</div><small><T zh="连续保留真实采样点" en="Continuous real samples" /></small></div><div className="essay-isp-select"><span>t<sub>phase</sub> → KEY RAW</span><b>↓</b><strong>ISP → Key image → Algorithm</strong><small><T zh="只处理选中的关键帧" en="Process selected key frames only" /></small></div></div>}
    <figcaption>{mode === "traditional" ? <T zh="完整 ISP 位于每帧采集后的串行关键路径。" en="Full ISP remains on the serial path after each acquisition." /> : <T zh="高频 RAW 先进入历史窗口，再根据 t_phase 选帧；完整 ISP 不再阻塞 RAW 采样路径。200 Hz 指设计目标下的时间采样粒度，不是输出帧率。" en="High-rate RAW enters history before t_phase selects a frame; full ISP no longer blocks the RAW sampling path. 200 Hz refers to design-target temporal sampling, not output frame rate." />}</figcaption>
  </figure>;
}
