import { T } from "../localized";
import { CaseFigure, CaseTakeaway } from "./CaseLayout";

export function ReductionDiagram() {
  return <CaseFigure id="reduction" number="03" label="EVENT ESTIMATION" className="essay-reduction"
    title={{ zh: "从状态重建降维为关键事件时间估计", en: "From state reconstruction to key event timing" }}
    note={{ zh: "局部模型 · 概念示意", en: "Local model · conceptual" }}
    caption={<T zh="目标是估计少量具有工程意义的关键事件时间。t_phase 仍受采样、时间戳与模型误差影响；图中波形不是项目实测轨迹。" en="Estimate a few meaningful event times. Sampling, timestamps, and model error still affect t_phase; the waveform is conceptual, not a measured project trace." />}>
    <div className="essay-reduction-grid">
      <ul><li><T zh="周期、振幅与轨迹形式提供运动先验。" en="Period, amplitude, and path form provide a motion prior." /></li><li><T zh="多个真实 TCP 采样点约束局部相位。" en="Real TCP samples constrain the local phase." /></li><li><T zh="求解目标收敛到有限个关键事件。" en="The target narrows to a few key events." /></li></ul>
      <div className="essay-reduction-visual"><svg viewBox="0 0 600 220" role="img" aria-label="Real TCP sample points constrain a local motion model used to estimate t_phase">
        <path className="essay-graph-axis" d="M24 110H580" />
        <path className="essay-reduction-wave" d="M24 110 C90 22 150 22 210 110 S330 198 390 110 S510 22 580 110" />
        <circle cx="54" cy="76" r="4" /><circle cx="150" cy="44" r="4" /><circle cx="250" cy="149" r="4" /><circle cx="350" cy="156" r="4" /><circle cx="450" cy="44" r="4" />
        <path className="essay-reduction-event" d="M480 12V190" /><circle className="essay-reduction-dot" cx="480" cy="43" r="8" /><text x="496" y="30">t_phase</text>
        <text x="24" y="210" className="essay-reduction-legend">● TCP samples / — local model</text>
      </svg></div>
    </div>
  </CaseFigure>;
}

export function TemporalTransition() {
  return <div className="essay-transition" aria-label="Spatial compensation to event estimation to real frame selection">
    <div><span>SPACE</span><strong><T zh="逐帧位置恢复" en="Per-frame position recovery" /></strong></div><b aria-hidden="true">→</b>
    <div><span>TIME</span><strong><T zh="关键相位时间" en="Key phase timing" /></strong></div><b aria-hidden="true">→</b>
    <div><span>OBSERVATION</span><strong><T zh="真实 RAW 选帧" en="Real RAW selection" /></strong></div>
  </div>;
}

export function EvolutionTimeline() {
  const steps = [
    { key: "CURRENT", zh: "相位感知的时间域选帧", en: "Phase-aware temporal selection" },
    { key: "NEXT", zh: "更高频的机器人伺服状态接入", en: "Higher-rate robot servo state" },
    { key: "NEXT", zh: "精确硬件时钟同步，例如 PTP", en: "Precise hardware clock synchronization, such as PTP" },
    { key: "FUTURE", zh: "全帧率状态融合与空间补偿", en: "Full-rate state fusion and spatial compensation" },
  ];
  return <CaseFigure id="evolution" number="11" label="CONDITIONAL EVOLUTION" className="essay-evolution"
    title={{ zh: "硬件条件与求解路径的演进", en: "Hardware conditions and the evolving solution" }}
    caption={<T zh="后面三个阶段是未来条件与方向。500 Hz–1 kHz 状态、PTP 与逐帧融合均不作为本项目已实现成果展示。" en="The later stages are future conditions and directions. 500 Hz–1 kHz state, PTP, and per-frame fusion are not claimed as implemented project results." />}>
    <ol>{steps.map((step, index) => <li key={index}><span>{step.key}</span><strong><T zh={step.zh} en={step.en} /></strong></li>)}</ol>
  </CaseFigure>;
}

export function MethodologyEnding() {
  const steps = [
    { zh: "找到真实信息瓶颈", en: "Find the information bottleneck", detail: "≈60 Hz state observation" },
    { zh: "利用领域先验", en: "Use domain prior", detail: "periodic weaving motion" },
    { zh: "降低问题维度", en: "Reduce the problem", detail: "trajectory → event time" },
    { zh: "重新设计数据链路", en: "Redesign the data path", detail: "capture → select → process" },
  ];
  return <div className="essay-ending">
    <ol>{steps.map((step, index) => <li key={step.en}><span>0{index + 1}</span><div><strong><T zh={step.zh} en={step.en} /></strong><small>{step.detail}</small></div></li>)}</ol>
    <CaseTakeaway><T zh="让低频机器人状态负责判断什么时候值得看，让高频相机负责保证那个时刻真的有一帧图像被采下来。" en="Let low-rate robot state decide when it is worth looking; let the high-rate camera ensure a real frame was captured at that moment." /></CaseTakeaway>
  </div>;
}
