import type { LocalizedText } from "../../lib/portfolio";
import { Localized, T } from "../localized";

const robot: LocalizedText[] = [
  { zh: "Industrial Robot · 约 60 Hz TCP 状态", en: "Industrial Robot · ≈60 Hz TCP state" },
  { zh: "离散真实状态观测", en: "Discrete real state observations" },
  { zh: "慢变焊缝趋势 + 周期摆弧", en: "Slow seam trend + periodic weave" },
  { zh: "局部运动先验 / 相位估计", en: "Local motion prior / phase estimate" },
  { zh: "目标相位事件", en: "Target phase event" },
  { zh: "t_phase / t_peak", en: "t_phase / t_peak" },
];
const camera: LocalizedText[] = [
  { zh: "Weld-pool Camera · 120–200 Hz RAW", en: "Weld-pool Camera · 120–200 Hz RAW" },
  { zh: "靠近曝光时刻的时间戳", en: "Timestamp near exposure" },
  { zh: "滚动 RAW 历史窗口", en: "Rolling RAW history" },
  { zh: "共同时间轴上的最近邻匹配", en: "Nearest match on common time base" },
  { zh: "真实 Key RAW", en: "Real Key RAW" },
  { zh: "按需 ISP 后处理", en: "Selective post-ISP" },
  { zh: "同相位图像序列", en: "Phase-consistent image sequence" },
];

function SvgLocalized({ x, y, text }: { x: number; y: number; text: LocalizedText }) {
  return <g><text x={x} y={y} className="lang-zh">{text.zh}</text><text x={x} y={y} className="lang-en">{text.en}</text></g>;
}

export function SystemTimeline() {
  return <figure className="essay-figure essay-system" aria-labelledby="system-title"><div className="essay-figure-top"><div><span className="essay-figure-number">SYSTEM ARCHITECTURE / TWO TIMELINES</span><h3 id="system-title"><T zh="异频采样，共同时间基准" en="Different rates, common time base" /></h3></div></div>
    <svg className="essay-system-desktop" viewBox="0 0 1200 380" role="img" aria-label="Two-lane system timeline for robot phase estimation and camera RAW selection connected by a common software time base">
      <text x="90" y="34" className="essay-system-label">ROBOT TIMELINE</text><text x="690" y="34" className="essay-system-label">CAMERA TIMELINE</text>
      <path className="essay-system-rule" d="M90 57V327M690 57V327" />
      {robot.map((step, index) => { const y = 80 + index * 48; return <g key={step.en}><circle className={index === robot.length - 1 ? "essay-system-node accent" : "essay-system-node"} cx="90" cy={y} r="6" /><SvgLocalized x={115} y={y + 6} text={step} /></g>; })}
      {camera.map((step, index) => { const y = 80 + index * 40; return <g key={step.en}><circle className={index === 3 || index === 4 ? "essay-system-node accent" : "essay-system-node"} cx="690" cy={y} r="6" /><SvgLocalized x={715} y={y + 6} text={step} /></g>; })}
      <path className="essay-system-bridge" d="M425 320H545V200H690" />
      <circle className="essay-system-bridge-point" cx="545" cy="200" r="5" />
      <text x="440" y="169" className="essay-system-bridge-label">COMMON TIME BASE</text>
      <text x="480" y="191" className="essay-system-bridge-note">t_phase ↔ t_cam</text>
      <text x="90" y="360" className="essay-system-foot">≈60 Hz measured state + motion prior → event time</text>
      <text x="690" y="360" className="essay-system-foot">120–200 Hz real RAW → nearest frame → ISP</text>
    </svg>
    <div className="essay-system-mobile"><section><span>ROBOT TIMELINE</span><ol>{robot.map((step) => <li key={step.en}><Localized text={step} /></li>)}</ol></section><div className="essay-system-mobile-bridge">COMMON TIME BASE <strong>t<sub>phase</sub> ↔ t<sub>cam</sub></strong></div><section><span>CAMERA TIMELINE</span><ol>{camera.map((step) => <li key={step.en}><Localized text={step} /></li>)}</ol></section></div>
    <figcaption><T zh="两条时间轴频率不同；设备计数先映射到共同软件时间轴，再将估计的相位时刻与真实 RAW 采集时刻关联。200 Hz 为相机 RAW 设计目标。" en="The paths have different rates. Device counters are first mapped to a common software timeline, then estimated phase time is matched to a real RAW acquisition time. 200 Hz is the RAW camera design target." /></figcaption>
  </figure>;
}
