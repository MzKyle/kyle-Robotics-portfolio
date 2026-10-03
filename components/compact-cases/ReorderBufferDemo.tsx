"use client";

import { useState } from "react";
import { T } from "../localized";

const completionOrder = [3, 1, 2];

export function ReorderBufferDemo() {
  const [step, setStep] = useState(0);
  const completed = completionOrder.slice(0, step);
  const released = [1, 2, 3].filter((id) => Array.from({ length: id }, (_, index) => index + 1).every((required) => completed.includes(required)));
  const waiting = completed.filter((id) => !released.includes(id));

  return <figure className="compact-figure vision-reorder"><div className="compact-figure-heading"><span>INTERACTIVE FIGURE / BAG ID ORDER</span><h3><T zh="推理可乱序，分拣须有序" en="Inference may finish out of order; sorting cannot" /></h3></div><div className="vision-reorder-grid"><div><div className="vision-reorder-controls"><button type="button" onClick={() => setStep((current) => Math.min(3, current + 1))} disabled={step === 3}><T zh="完成下一个推理" en="Complete next inference" /> →</button><button type="button" onClick={() => setStep(0)}><T zh="复位" en="Reset" /></button></div><div className="vision-reorder-jobs">{[1, 2, 3].map((id) => <div key={id} data-state={released.includes(id) ? "released" : waiting.includes(id) ? "waiting" : "pending"}><span>BAG {String(id).padStart(2, "0")}</span><strong>{released.includes(id) ? <T zh="已按序放行" en="Released in order" /> : waiting.includes(id) ? <T zh="已完成 · 等待前袋" en="Complete · waiting" /> : <T zh="等待推理" en="Pending inference" />}</strong></div>)}</div><p className="vision-reorder-sequence"><T zh="示例完成顺序" en="Example completion order" />: 03 → 01 → 02 <span>·</span> <T zh="当前已放行" en="Released" />: {released.length ? released.map((id) => String(id).padStart(2, "0")).join(" → ") : "—"}</p></div><aside><strong><T zh="顺序不变量" en="Ordering invariant" /></strong><p><T zh="仅当下一物理 Bag ID 的结果已经就绪，SortReorderBuffer 才向分拣线程放行 OK / NG。Bag 03 即使先完成，也必须等待 01 和 02。" en="SortReorderBuffer releases OK / NG to the sorter only when the next physical Bag ID is ready. Bag 03 waits even if it finishes first." /></p><small><T zh="教学模拟：顺序与状态仅用于解释机制，不是现场运行记录。" en="Teaching simulation: sequence and states explain the mechanism, not a production log." /></small></aside></div><figcaption><T zh="袋级状态与物理顺序被独立于并发 worker 的完成顺序维护；缺帧或超时走 fail-safe NG。" en="Bag state and physical order remain independent of concurrent worker completion; missing frames or timeouts fail safe to NG." /></figcaption></figure>;
}
