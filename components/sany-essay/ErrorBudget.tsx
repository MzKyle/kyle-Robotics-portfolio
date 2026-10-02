import { T } from "../localized";
import { CaseFigure } from "./CaseLayout";

const terms = [
  { symbol: "e_robot", zh: "约 60 Hz TCP 采样与状态数据延迟", en: "Roughly 60 Hz TCP sampling and state-data delay" },
  { symbol: "e_model", zh: "摆弧运动先验与真实伺服轨迹的偏差", en: "Difference between motion prior and actual servo path" },
  { symbol: "e_comm", zh: "设备通信时延与 jitter", en: "Device communication latency and jitter" },
  { symbol: "e_sync", zh: "跨设备时钟映射与同步误差", en: "Cross-device clock mapping and synchronization error" },
  { symbol: "e_camera", zh: "RAW 采样量化与曝光时间定义", en: "RAW sampling quantization and exposure-time definition" },
];

export function ErrorBudget() {
  return <CaseFigure id="error" number="10" label="ERROR SOURCES" className="essay-error" title={{ zh: "时间误差的五个来源", en: "Five sources of timing error" }} note={{ zh: "结构清单 · 非实测比例", en: "Structural inventory · not measured shares" }} caption={<T zh="这是误差来源的结构清单，不是测得的误差占比或严格统计相加。真实总误差需要实验表征。" en="This is a structural inventory, not measured error shares or a calibrated statistical sum. Real total error requires experimental characterization." />}>
    <div className="essay-error-equation">e<sub>total</sub> = e<sub>robot</sub> + e<sub>model</sub> + e<sub>comm</sub> + e<sub>sync</sub> + e<sub>camera</sub></div><div className="essay-error-terms">{terms.map((term) => <details key={term.symbol}><summary><code>{term.symbol}</code><span aria-hidden="true">+</span></summary><p><T zh={term.zh} en={term.en} /></p></details>)}</div>
  </CaseFigure>;
}
