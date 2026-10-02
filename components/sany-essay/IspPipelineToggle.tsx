"use client";

import { useState } from "react";
import { T } from "../localized";
import { CaseFigure } from "./CaseLayout";

export function IspPipelineToggle() {
  const [mode, setMode] = useState<"traditional" | "redesigned">("redesigned");
  return <CaseFigure id="isp" number="05" label="CAPTURE / SELECT / PROCESS" className="essay-isp" title={{ zh: "将 ISP 移出高频采集路径", en: "Move ISP off the high-rate capture path" }} note={{ zh: "架构对比 · 设计示意", en: "Architecture comparison · design schematic" }} caption={mode === "traditional" ? <T zh="完整 ISP 位于每帧采集后的串行关键路径。" en="Full ISP remains on the serial path after each acquisition." /> : <T zh="先采集、再选择、后处理。高频 RAW 先进入历史窗口；完整 ISP 不再阻塞 RAW 采样。200 Hz 是设计目标下的时间采样粒度，不是输出帧率。" en="Capture first, select second, process last. High-rate RAW enters history before full ISP, which no longer blocks capture. 200 Hz is a temporal sampling design target, not output frame rate." />}>
    <div className="essay-isp-switch" role="group" aria-label="ISP pipeline architecture"><button type="button" aria-pressed={mode === "traditional"} onClick={() => setMode("traditional")}><T zh="传统串行链路" en="Traditional serial path" /></button><button type="button" aria-pressed={mode === "redesigned"} onClick={() => setMode("redesigned")}><T zh="相位感知重构" en="Phase-aware redesign" /></button></div>
    {mode === "traditional" ? <div className="essay-isp-path" key="traditional"><div><small>01</small><strong>Sensor</strong></div><i>→</i><div><small>02</small><strong>RAW</strong></div><i>→</i><div className="essay-isp-critical"><small>CRITICAL PATH</small><strong>ISP</strong></div><i>→</i><div><small>04</small><strong>Image</strong></div><i>→</i><div><small>05</small><strong>Algorithm</strong></div></div> : <div className="essay-isp-redesigned" key="redesigned"><div className="essay-isp-raw"><span>Sensor → RAW history</span><div aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i className={index === 7 ? "selected" : ""} key={index} />)}</div><small><T zh="连续保留真实采样点" en="Continuous real samples" /></small></div><div className="essay-isp-select"><span>t<sub>phase</sub> → KEY RAW</span><b>↓</b><strong>ISP → Key image → Algorithm</strong><small><T zh="只处理选中的关键帧" en="Process selected key frames only" /></small></div></div>}
  </CaseFigure>;
}
