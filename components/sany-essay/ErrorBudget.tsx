import { T } from "../localized";

const terms = [
  { symbol: "e_robot", zh: "约 60 Hz TCP 采样与状态数据延迟", en: "Roughly 60 Hz TCP sampling and state-data delay" },
  { symbol: "e_model", zh: "摆弧运动先验与真实伺服轨迹的偏差", en: "Difference between motion prior and actual servo path" },
  { symbol: "e_comm", zh: "设备通信时延与 jitter", en: "Device communication latency and jitter" },
  { symbol: "e_sync", zh: "跨设备时钟映射与同步误差", en: "Cross-device clock mapping and synchronization error" },
  { symbol: "e_camera", zh: "RAW 采样量化与曝光时间定义", en: "RAW sampling quantization and exposure-time definition" },
];

export function ErrorBudget() {
  return <figure className="essay-figure essay-error" aria-labelledby="error-title"><div className="essay-figure-top"><div><span className="essay-figure-number">STRUCTURAL ERROR BUDGET</span><h3 id="error-title"><T zh="误差来自哪里？" en="Where can error enter?" /></h3></div><span className="essay-concept-label"><T zh="无比例推断" en="No invented proportions" /></span></div><div className="essay-error-equation">e<sub>total</sub> = e<sub>robot</sub> + e<sub>model</sub> + e<sub>comm</sub> + e<sub>sync</sub> + e<sub>camera</sub></div><div className="essay-error-terms">{terms.map((term) => <details key={term.symbol}><summary><code>{term.symbol}</code><span aria-hidden="true">+</span></summary><p><T zh={term.zh} en={term.en} /></p></details>)}</div><figcaption><T zh="这是误差来源的结构清单，不是测得的误差占比或严格统计相加。真实总误差需要实验表征。" en="This is a structural inventory, not measured error shares or a calibrated statistical sum. Real total error requires experimental characterization." /></figcaption></figure>;
}
