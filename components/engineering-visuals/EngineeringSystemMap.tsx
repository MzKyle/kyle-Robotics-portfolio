import { T } from "../localized";
import styles from "./engineering-visuals.module.css";

const stages = [
  { label: "ACQUISITION", zh: "设备与采集", en: "Devices & acquisition", annotation: "Camera · Sensor", tools: "Camera SDK · Timestamp · Buffer", flow: "data" },
  { label: "PERCEPTION", zh: "视觉与三维感知", en: "Vision & 3D perception", annotation: "Vision · 3D", tools: "OpenCV · PCL · AI", flow: "result" },
  { label: "STATE / FRAME", zh: "状态、坐标与通信", en: "State, frames & communication", annotation: "Pose · TF · Communication", tools: "ROS 2 · TCP Pose · TF · Socket", flow: "pose" },
  { label: "EXECUTION", zh: "机器人执行与交付", en: "Robot execution & delivery", annotation: "Motion · Robot", tools: "Robot Control · Motion · Integration", flow: "" },
];

function StageSketch({ stage }: { stage: number }) {
  return <svg viewBox="0 0 76 48" className={styles.stageSketch} aria-hidden="true">
    {stage === 0 && <>
      <path d="M11 9h34v28H11zM45 18l15-6v22l-15-6M5 14V5h10M51 5h10v6M5 34v9h10M51 43h10v-6" />
      <circle cx="28" cy="23" r="8" /><circle className={styles.eventFill} cx="28" cy="23" r="2" />
    </>}
    {stage === 1 && <>
      <path d="M8 36h58M13 40V8" />
      {[0, 1, 2, 3].flatMap((row) => Array.from({ length: 6 - row }, (_, col) => <circle key={`${row}-${col}`} cx={23 + col * 7 + row * 3} cy={31 - row * 6} r="1.4" className={row === 2 && col === 2 ? styles.eventFill : styles.sketchDot} />))}
    </>}
    {stage === 2 && <>
      <path d="M27 32V7M27 32h33M27 32L10 42M24 11l3-4 3 4M56 29l4 3-4 3" />
      <path d="M27 32L51 16" className={styles.eventStroke} /><circle cx="27" cy="32" r="3" className={styles.eventFill} />
      <circle cx="51" cy="16" r="2" /><path d="M55 11h12M61 5v12" />
    </>}
    {stage === 3 && <>
      <path d="M8 42h35M15 42v-8h21v8M25 34l-7-17 21-8 17 14-4 10M52 33l-5 7M52 33l6 5" />
      <circle cx="18" cy="17" r="3" /><circle cx="39" cy="9" r="3" /><circle cx="56" cy="23" r="3" className={styles.eventFill} />
    </>}
  </svg>;
}

export function EngineeringSystemMap() {
  return <div className={styles.systemMap}>
    <div className={styles.mapHeading}><span>ENGINEERING SYSTEM MAP</span><span>01—04</span></div>
    <ol className={styles.mapStages} aria-label="系统范围 / System scope">
      {stages.map((stage, index) => <li key={stage.label} className={styles.mapStage} tabIndex={0}>
        <span className={styles.stageIndex}>0{index + 1}</span>
        <div className={styles.stageCopy}>
          <span className={styles.stageLabel}>{stage.label}</span>
          <strong><T zh={stage.zh} en={stage.en} /></strong>
          <div className={styles.stageAnnotations}>
            <span className={styles.stageDefault}>{stage.annotation}</span>
            <span className={styles.stageTools}>{stage.tools}</span>
          </div>
        </div>
        <StageSketch stage={index} />
        {stage.flow && <span className={styles.stageFlow} aria-hidden="true">{stage.flow} ↓</span>}
      </li>)}
    </ol>
    <p className={styles.mapFootnote}><T zh="从设备观测到机器人执行" en="From sensing to robot execution" /><span>CAPABILITY MAP</span></p>
  </div>;
}
