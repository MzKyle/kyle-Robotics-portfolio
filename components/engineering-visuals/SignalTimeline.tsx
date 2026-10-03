import styles from "./engineering-visuals.module.css";

type SignalTimelineProps = {
  robotRate?: string;
  cameraRate?: string;
  phaseMarker?: boolean;
};

export function SignalTimeline({ robotRate = "~60 Hz", cameraRate = "120–200 Hz", phaseMarker = true }: SignalTimelineProps) {
  const rawSamples = Array.from({ length: 29 }, (_, index) => 22 + index * 15.5);
  const eventTime = 292;
  const selected = rawSamples.reduce((nearest, sample) => Math.abs(sample - eventTime) < Math.abs(nearest - eventTime) ? sample : nearest);

  return <svg className={`${styles.diagram} ${styles.timeline}`} viewBox="0 0 480 214" role="img" aria-label="概念时间轴：低频机器人状态估计相位事件，从高频 RAW 历史中选择真实观测 / Conceptual timeline: estimate a phase event from robot state and select a real RAW observation">
    <title>Phase-aware observation selection — conceptual diagram</title>
    <desc>Robot state is sparsely sampled. A motion prior estimates t_phase. The nearest actual camera sample is selected from RAW history; the curve is conceptual, not a measured TCP trajectory.</desc>
    <text x="22" y="20" className={styles.diagramLabel}>ROBOT STATE</text>
    <text x="458" y="20" textAnchor="end">{robotRate}</text>
    <path d="M22 43H458" className={styles.rule} />
    {Array.from({ length: 9 }, (_, index) => <circle key={index} cx={22 + index * 54.25} cy="43" r="3.4" className={styles.primaryFill} />)}
    <path d="M22 109H458" className={styles.faintRule} />
    <path d="M22 114C49 114 49 86 78 86S107 142 134 142S163 86 190 86S219 142 246 142S275 86 292 86S321 142 348 142S377 86 404 86S433 114 458 114" className={styles.trend} />
    <text x="22" y="75" className={styles.diagramNote}>motion prior</text>
    <text x="22" y="169" className={styles.diagramLabel}>RAW CAMERA</text>
    <text x="458" y="169" textAnchor="end">{cameraRate}</text>
    <path d="M22 192H458" className={styles.rule} />
    {rawSamples.map((sample) => <circle key={sample} cx={sample} cy="192" r="2.8" className={phaseMarker && sample === selected ? styles.eventFill : styles.primaryFill} />)}
    {phaseMarker && <g className={styles.phaseEvent}>
      <text x="306" y="70" className={styles.eventText}>t_phase</text>
      <path d={`M292 77V181L${selected} 192`} className={styles.eventLine} />
      <circle cx="292" cy="86" r="4.2" className={styles.eventFill} />
      <circle cx={selected} cy="192" r="7" className={styles.eventRing} />
    </g>}
  </svg>;
}
