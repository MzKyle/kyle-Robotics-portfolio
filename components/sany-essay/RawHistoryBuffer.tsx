import { T } from "../localized";
import { CaseFigure } from "./CaseLayout";

const chunks = [
  { state: "FROZEN", frames: 8 },
  { state: "READING", frames: 8 },
  { state: "FROZEN", frames: 8 },
  { state: "WRITING", frames: 8 },
];

export function RawHistoryBuffer() {
  return <CaseFigure id="buffer" number="06" label="RAW HISTORY BUFFER" className="essay-buffer" title={{ zh: "滚动历史与完整帧所有权", en: "Rolling history and complete-frame ownership" }} note={{ zh: "结构示意", en: "Structural schematic" }} caption={<T zh="连续内存带强调滚动历史、完整帧移交与生产者 / 消费者所有权。约 64 帧是当前结构参数，不表示经过全面 benchmark 的最优容量。" en="The continuous memory strip emphasizes rolling history, complete-frame handoff, and producer/consumer ownership. About 64 frames is the current structural capacity, not a universally benchmarked optimum." />}>
    <div className="essay-buffer-time"><span>PAST</span><span><T zh="时间与写入方向" en="Time and write direction" /> →</span><span>NOW</span></div>
    <div className="essay-memory-strip" role="img" aria-label="Four adjacent chunks in a rolling RAW history with frozen, reading, frozen, and writing ownership states">{chunks.map((chunk, index) => <div className={`essay-memory-chunk essay-memory-${chunk.state.toLowerCase()}`} key={index}><div aria-hidden="true">{Array.from({ length: chunk.frames }, (_, frame) => <i className={index === 1 && frame === 4 ? "queried" : ""} key={frame} />)}</div><strong>{chunk.state}</strong><small>CHUNK {String(index).padStart(2, "0")}</small></div>)}</div>
    <div className="essay-buffer-annotations"><span><T zh="↑ t_phase 查询历史帧" en="↑ t_phase queries history" /></span><span><T zh="↑ Camera producer 写入" en="↑ Camera producer writes" /></span></div>
    <div className="essay-buffer-cycle"><span>FREE</span><b>→</b><span>WRITING</span><b>→</b><span>FROZEN</span><b>→</b><span>READING</span><b>→</b><span>RECYCLE</span></div>
    <div className="essay-buffer-metrics"><div><span><T zh="逻辑窗口" en="Logical window" /></span><strong>≈200–250 ms</strong></div><div><span><T zh="物理容量" en="Physical capacity" /></span><strong>≈64 RAW frames</strong></div></div>
  </CaseFigure>;
}
