import { T } from "../localized";

export function ReductionDiagram() {
  return <figure className="essay-figure essay-reduction" aria-labelledby="reduction-title"><div className="essay-figure-top"><div><span className="essay-figure-number">EXPLANATORY FIGURE / REDUCTION</span><h3 id="reduction-title"><T zh="连续轨迹 → 关键事件" en="Full trajectory → key events" /></h3></div></div><svg viewBox="0 0 1000 180" role="img" aria-label="A continuous motion curve with only three marked event times"><path className="essay-graph-axis" d="M40 90H960" /><path className="essay-reduction-wave" d="M40 90 C93 17 147 17 200 90 S307 163 360 90 S467 17 520 90 S627 163 680 90 S787 17 840 90 S907 163 960 90" /><path className="essay-reduction-event" d="M120 10V170M440 10V170M760 10V170" /><circle className="essay-reduction-dot" cx="120" cy="42" r="7" /><circle className="essay-reduction-dot" cx="440" cy="42" r="7" /><circle className="essay-reduction-dot" cx="760" cy="42" r="7" /></svg><div className="essay-reduction-caption"><span><T zh="过去：估计每一时刻的完整 TCP" en="Before: infer complete TCP at every instant" /></span><b>↓</b><strong><T zh="现在：只估计关键相位何时发生" en="Now: estimate when key phases occur" /></strong></div><figcaption><T zh="极值、过零或固定相位是有限个事件时间；它们不是完整高频运动轨迹。" en="Extrema, crossings, or fixed phase are a few event times, not a complete high-rate motion trajectory." /></figcaption></figure>;
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
