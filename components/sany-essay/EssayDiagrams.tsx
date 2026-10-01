import { T } from "../localized";

export function ReductionDiagram() {
  return <figure className="essay-figure essay-reduction" aria-labelledby="reduction-title"><div className="essay-reduction-grid"><div className="essay-reduction-copy"><span className="essay-figure-number">FIGURE 02 / EVENT ESTIMATE</span><h3 id="reduction-title"><T zh="为什么这是事件估计，而不是高频状态重建？" en="Why estimate events instead of a high-rate state?" /></h3><ul><li><T zh="已知周期、振幅与轨迹形式提供先验。" en="Known period, amplitude, and path constrain the model." /></li><li><T zh="多个真实 TCP 采样点联合约束局部相位。" en="Several real TCP samples constrain local phase." /></li><li><T zh="只求有限个关键事件的时间。" en="Only a few key event times are needed." /></li></ul></div><div className="essay-reduction-visual"><svg viewBox="0 0 600 220" role="img" aria-label="Local weave curve with sampled points and one key phase event"><path className="essay-graph-axis" d="M24 110H580" /><path className="essay-reduction-wave" d="M24 110 C90 22 150 22 210 110 S330 198 390 110 S510 22 580 110" /><circle cx="54" cy="76" r="4" /><circle cx="150" cy="48" r="4" /><circle cx="250" cy="149" r="4" /><circle cx="350" cy="156" r="4" /><circle cx="450" cy="48" r="4" /><path className="essay-reduction-event" d="M450 12V190" /><circle className="essay-reduction-dot" cx="450" cy="48" r="8" /><text x="466" y="35">t_phase</text></svg><div className="essay-reduction-caption"><span>TCP samples</span><strong>→ t<sub>phase</sub></strong></div></div></div><figcaption><T zh="t_phase 仍受采样、时间戳与模型误差影响；图中曲线和事件点是概念示意，不是项目实测轨迹。" en="t_phase remains uncertain due to sampling, timestamps, and model error. The curve and event point are conceptual, not measured project traces." /></figcaption></figure>;
}

export function TemporalTransition() {
  return <figure className="essay-transition" aria-label="From spatial compensation through phase estimation to real frame selection"><div><span>SPACE</span><strong><T zh="逐帧位置恢复" en="Per-frame position recovery" /></strong><small>Spatial compensation</small></div><b aria-hidden="true">↓</b><div><span>TIME</span><strong><T zh="关键相位时间估计" en="Key phase-time estimation" /></strong><small>Phase estimation</small></div><b aria-hidden="true">↓</b><div><span>OBSERVATION</span><strong><T zh="真实 RAW 选帧" en="Real RAW frame selection" /></strong><small>Real-frame selection</small></div></figure>;
}

export function EvolutionTimeline() {
  const steps = [
    { key: "CURRENT", zh: "相位感知的时间域选帧", en: "Phase-aware temporal selection" },
    { key: "NEXT", zh: "更高频的机器人伺服状态接入", en: "Higher-rate robot servo state" },
    { key: "NEXT", zh: "精确硬件时钟同步，例如 PTP", en: "Precise hardware clock synchronization, such as PTP" },
    { key: "FUTURE", zh: "全帧率状态融合与空间补偿", en: "Full-rate state fusion and spatial compensation" },
  ];
  return <figure className="essay-figure essay-evolution" aria-labelledby="evolution-title"><div className="essay-figure-top"><div><span className="essay-figure-number">SYSTEM EVOLUTION / CONDITIONAL</span><h3 id="evolution-title"><T zh="硬件条件改变，求解方式才可能改变" en="Better hardware can change the feasible solution" /></h3></div></div><ol>{steps.map((step, index) => <li key={index}><span>{step.key}</span><strong><T zh={step.zh} en={step.en} /></strong></li>)}</ol><figcaption><T zh="后面三个阶段是未来条件与方向。500 Hz–1 kHz 状态、PTP 与逐帧融合均不作为本项目已实现成果展示。" en="The later stages are future conditions and directions. 500 Hz–1 kHz state, PTP, and per-frame fusion are not claimed as implemented project results." /></figcaption></figure>;
}

export function MethodologyEnding() {
  const steps = [
    { zh: "找到真实信息瓶颈", en: "Find the real information bottleneck", detail: "≈60 Hz state observation" },
    { zh: "利用领域先验", en: "Use domain prior", detail: "periodic weaving motion" },
    { zh: "降低问题维度", en: "Reduce the problem", detail: "trajectory → event time" },
    { zh: "重新设计数据链路", en: "Redesign the data path", detail: "capture → select → process" },
  ];
  return <div className="essay-ending"><p className="essay-ending-overline">DON&apos;T OPTIMIZE THE WRONG LAYER.</p><h3><T zh="不要在错误的约束方向上继续参数内卷。" en="Do not keep tuning against the wrong system constraint." /></h3><ol>{steps.map((step, index) => <li key={step.en}><span>0{index + 1}</span><strong><T zh={step.zh} en={step.en} /></strong><small>{step.detail}</small></li>)}</ol><blockquote><T zh="让低频机器人状态负责判断什么时候值得看，让高频相机负责保证那个时刻真的有一帧图像被采下来。" en="Let low-rate robot state decide when it is worth looking; let the high-rate camera ensure a real frame was captured at that moment." /></blockquote></div>;
}
