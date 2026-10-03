import { CaseNavigation } from "../case-navigation";
import Image from "next/image";
import Link from "next/link";
import { projectNames } from "../../lib/project-presentation";
import { T } from "../localized";
import { SiteFooter, SiteHeader } from "../site-shell";
import { WorkstreamFigure } from "../engineering-visuals/WorkstreamFigure";

const base = "/projects/sany-welding-robotics";

const sections = [
  {
    "id": "workstreams",
    "label": {
      "zh": "系统模块",
      "en": "Workstreams"
    }
  },
  {
    "id": "contribution",
    "label": {
      "zh": "职责",
      "en": "Ownership"
    }
  }
];

export function SanyExperienceHub() {
  return <main className="compact-case compact-hub"><SiteHeader active="projects" /><article>
    <header className="compact-hero compact-hero-hub"><div><Link className="compact-back" href="/projects">← <T zh="全部项目" en="All projects" /></Link><p className="compact-kicker">SANY / ALGORITHM ENGINEER / 2026.03 — 08</p><h1><T {...projectNames["sany-welding-robotics"]} /></h1><p className="compact-lead"><T zh="在机器人运动、设备采样与视觉计算之间建立一致的时间和空间关系，让熔池观测与高度纠偏在现场稳定运行。" en="Bringing robot motion, device sampling and vision computation into consistent time and spatial frames, for reliable weld-pool observation and height correction." /></p><div className="compact-hero-meta"><span>C++ / ROS 2</span><span>RAW / ISP</span><span>Point Cloud</span></div></div><figure className="hub-cover"><Image src="/images/projects/welding-vision-concept-v3.webp" alt="AI 生成的通用焊接视觉场景，非三一项目实拍" width={900} height={600} unoptimized priority /></figure></header>
    <dl className="compact-metrics"><div><dt><T zh="RAW 采样能力" en="RAW sampling" /></dt><dd>120 → 200 Hz</dd></div><div><dt><T zh="摆弧焊纠偏精度" en="Weave correction" /></dt><dd>±0.5 mm</dd></div><div><dt><T zh="多设备时间关联误差" en="Time-association error" /></dt><dd>≈10 ms</dd></div></dl><CaseNavigation sections={sections} />
    <section className="compact-section compact-section-first" id="workstreams" aria-labelledby="hub-work"><div className="compact-section-heading"><span>01 / TWO WORKSTREAMS</span><h2 id="hub-work"><T zh="时间上的稳像，空间上的纠偏" en="Stabilization in time. Correction in space." /></h2><p><T zh="同一机器人系统中的两条工作线，分别处理运动相位和历史工件几何。" en="Two workstreams in one robot system, addressing motion phase and historical workpiece geometry." /></p></div>
      <div className="hub-workstreams">
        <section className="hub-workstream"><header>01 / PHASE-AWARE VISION</header><div className="hub-workstream-body"><div className="hub-workstream-copy"><h3><T zh="基于运动相位的时间域稳像" en="Phase-aware temporal stabilization" /></h3><p><T zh="机器人状态约 60 Hz，RAW 采样可达 200 Hz。用运动先验估计关键相位时刻，从 Multi-Chunk / Ring Buffer 中选取真实帧，再执行 ISP 与下游纠偏计算。" en="Robot state updates at about 60 Hz while RAW acquisition reaches 200 Hz. Estimate key phase timing from a motion prior, select a real frame from multi-chunk ring history, then run ISP and downstream correction." /></p><div className="hub-workstream-tags"><span>Motion prior</span><span>RAW history</span><span>Deferred ISP</span></div><Link className="hub-workstream-link" href={`${base}/technical`}><T zh="阅读技术长文与交互实验" en="Read the technical essay" /><span aria-hidden="true">→</span></Link></div><WorkstreamFigure kind="phase" /></div></section>
        <section className="hub-workstream hub-workstream-reverse"><header>02 / PRE-SCAN GEOMETRY</header><div className="hub-workstream-body"><div className="hub-workstream-copy"><h3><T zh="前置扫描与高度预读纠偏" en="Pre-scan height correction" /></h3><p><T zh="在弧光与飞溅影响点云之前采集工件几何，结合 TCP 位姿转换并缓存到 Base 坐标系。焊接时按当前空间位置预读历史高度，持续复用扫描结果。" en="Capture workpiece geometry before arc light and spatter degrade point clouds. Transform and cache it in the Base frame with TCP pose, then look up historical height at the current position during welding." /></p><div className="hub-workstream-tags"><span>Point cloud</span><span>TCP pose</span><span>Height map</span></div><Link className="hub-workstream-link" href={`${base}/pre-weld-localization`}><T zh="阅读空间纠偏案例" en="Read the geometry case" /><span aria-hidden="true">→</span></Link></div><WorkstreamFigure kind="spatial" /></div></section>
      </div>
    </section>
    <section className="compact-section compact-section-split" id="contribution"><div className="compact-section-heading"><span>02 / MY CONTRIBUTION</span><h2><T zh="我负责的部分" en="My contribution" /></h2></div><div className="compact-prose"><p><T zh="我独立完成相位稳像方案与 RAW 缓冲架构，处理设备计数的软件时间映射、共享内存数据链路和后置 ISP；并设计前置扫描、高度地图缓存与预读纠偏模块，参与下游几何计算和机器人系统联调。" en="I independently developed phase stabilization and RAW buffering, software mapping of device counters, shared-memory data paths and deferred ISP. I also designed pre-scan capture, height-map caching and look-ahead correction, and collaborated on downstream geometry and robot integration." /></p><p><T zh="多缓冲吸收瞬时处理抖动，解决采集链路中的偶发黑帧。采样周期从 8.33 ms 降至 5 ms；理想时间量化误差的最大上界下降约 40%，是采样模型的改善。±0.5 mm 属于集成后的摆弧焊纠偏结果。" en="Multi-buffer history absorbs processing jitter and resolved occasional black frames. Sampling intervals fell from 8.33 to 5 ms, reducing the ideal maximum quantization bound by about 40%. The ±0.5 mm result describes the integrated weave-welding correction path." /></p></div></section>
    <div className="compact-endlinks"><Link href="/experience"><T zh="查看工作经历" en="View experience" /> →</Link><Link href="/projects/waterbag-inspection"><T zh="下一项目：工业视觉检测" en="Next: industrial inspection" /> →</Link></div>
  </article><SiteFooter /></main>;
}
