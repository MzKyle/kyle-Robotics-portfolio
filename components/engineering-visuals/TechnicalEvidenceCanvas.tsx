import { T } from "../localized";
import { PointCloudSketch } from "./PointCloudSketch";
import { SignalTimeline } from "./SignalTimeline";
import styles from "./engineering-visuals.module.css";

export function TechnicalEvidenceCanvas({ className = "" }: { className?: string }) {
  return <figure className={`${styles.evidenceCanvas} ${className}`}>
    <div className={styles.canvasHeading}><span>SANY / ENGINEERING STUDY</span><span>TIME × SPACE</span></div>
    <div className={styles.evidenceRegion}>
      <div className={styles.regionHeading}><span>01</span><h3>PHASE-AWARE WELDING VISION</h3><span>t → RAW</span></div>
      <SignalTimeline />
    </div>
    <div className={styles.evidenceRegion}>
      <div className={styles.regionHeading}><span>02</span><h3>PRE-WELD 3D LOCALIZATION</h3><span>3D → TCP</span></div>
      <PointCloudSketch />
    </div>
    <ol className={styles.canvasPipeline} aria-label="工程数据链路 / Engineering data path">
      {["Acquisition", "Match", "Vision", "Robot"].map((step) => <li key={step}>{step}</li>)}
    </ol>
    <figcaption><T zh="概念示意 · 200 Hz 为 RAW 设计目标，非实测曲线或现场素材。" en="Conceptual diagram · 200 Hz is a RAW design target; no measured curves or on-site media." /></figcaption>
  </figure>;
}
