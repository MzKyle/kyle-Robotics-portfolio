import { T } from "../localized";
import { PointCloudSketch } from "./PointCloudSketch";
import { SignalTimeline } from "./SignalTimeline";
import styles from "./engineering-visuals.module.css";

export function WorkstreamFigure({ kind }: { kind: "phase" | "spatial" }) {
  const phase = kind === "phase";
  const steps = phase
    ? [{ label: "STATE", value: "Motion prior" }, { label: "EVENT", value: "t_phase" }, { label: "OBSERVATION", value: "Real RAW frame" }]
    : [{ label: "3D SCAN", value: "Transform" }, { label: "REGISTRATION", value: "Spatial match" }, { label: "ROBOT", value: "Pose / Δheight" }];

  return <figure className={styles.workstreamFigure}>
    <div className={styles.figureHeading}><span>{phase ? "FIG. 01 / PHASE & TIME" : "FIG. 02 / SPACE & FRAME"}</span></div>
    {phase ? <SignalTimeline /> : <PointCloudSketch />}
    <ol className={styles.figurePipeline}>
      {steps.map((step) => <li key={step.label}><span>{step.label}</span><strong>{step.value}</strong></li>)}
    </ol>
    <figcaption>{phase
      ? <T zh="原理示意 · 200 Hz 为 RAW 采样能力；曲线非实测轨迹。" en="Conceptual diagram · 200 Hz RAW sampling capability; the curve is not a measured trajectory." />
      : <T zh="概念示意 · 抽象点集与坐标关系，非真实工件或实测结果。" en="Conceptual diagram · Abstract points and frames, not a real workpiece or measured result." />}</figcaption>
  </figure>;
}
