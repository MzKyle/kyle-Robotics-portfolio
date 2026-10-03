import { T } from "../localized";
import { CaseFigure, CaseMermaid } from "./CaseLayout";

export function ClockMappingDiagram() {
  return <CaseFigure id="clock-mapping" number="08" label="SOFTWARE TIME MAPPING"
    title={{ zh: "启动锚点与漂移重校准", en: "Startup anchors and drift recalibration" }}
    note={{ zh: "原文 Mermaid · 时钟流程", en: "Source Mermaid · clock workflow" }}
    caption={<T zh="相机与机器人独立计数，经 ROS 节点映射到共同软件时间轴。长期漂移后，在每日空闲窗口重新读取计数并更新映射；这是软件校准，不是硬件时钟同步。" en="Camera and robot count independently, with ROS mapping both to a common software timeline. During the daily idle window, counters are reread and the mapping updated to compensate for long-term drift. This is software calibration, not hardware clock synchronization." />}>
    <CaseMermaid name="clock-mapping" description={{ zh: "原文时钟流程：系统启动、读取两侧计数、建立锚点、独立运行、共同时间映射、相位匹配、漂移、空闲重同步、更新映射。", en: "Source clock workflow: startup, read device counters, establish an anchor, independent operation, common time mapping, phase matching, drift, idle resync, and mapping update." }} />
  </CaseFigure>;
}

export function SystemTimeline() {
  return <CaseFigure id="system" number="09" label="DUAL-TIMELINE ARCHITECTURE"
    title={{ zh: "异频采样，共同时间基准", en: "Different rates, common time base" }}
    note={{ zh: "原文 Mermaid · 系统架构", en: "Source Mermaid · system architecture" }}
    caption={<T zh="机器人链路保留运动分解、局部建模与相位检测；相机链路保留 RAW 时间戳、历史缓存、最近邻匹配、关键帧 ISP 与同相位图像输出。两者通过共同时间基准关联，200 Hz 为 RAW 采样能力。" en="The robot path retains motion decomposition, local modeling, and phase detection. The camera path retains RAW timestamps, history, nearest-frame matching, selective ISP, and same-phase image output. A common time base connects them; 200 Hz is the RAW sampling capability." />}>
    <CaseMermaid name="dual-timeline" description={{ zh: "机器人与相机双时间轴的完整 Mermaid 架构，包含慢变与摆弧分支、相位事件、统一时间基准、RAW Buffer、匹配与按需 ISP。", en: "Full Mermaid architecture of robot and camera timelines: slow and weave branches, phase events, common time base, RAW buffer, matching, and selective ISP." }} />
  </CaseFigure>;
}
