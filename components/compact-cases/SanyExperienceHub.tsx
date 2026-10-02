import Link from "next/link";
import { T } from "../localized";
import { SiteFooter, SiteHeader } from "../site-shell";
import { WorkstreamFigure } from "../engineering-visuals/WorkstreamFigure";

const base = "/projects/sany-welding-robotics";

export function SanyExperienceHub() {
  return <main className="compact-case">
    <SiteHeader active="projects" />
    <article>
      <header className="compact-hero compact-hero-hub">
        <div><Link className="compact-back" href="/projects">← <T zh="项目案例" en="Projects" /></Link><p className="compact-kicker">SANY / INDUSTRIAL ROBOTICS / 2026</p><h1>SANY<span>Industrial Welding Robotics</span></h1><p className="compact-lead"><T zh="在工业焊接机器人域控系统中，围绕焊前 3D 定位与摆弧焊视觉两条工作线，处理感知、坐标与设备时序之间的工程问题。" en="Two workstreams in an industrial welding robot controller: pre-weld 3D localization and phase-aware weave vision, both shaped by sensing, coordinate, and device-timing constraints." /></p><div className="compact-hero-meta"><span>C++ / ROS 2</span><span>Industrial Robot</span><span>3D Vision</span></div></div>
        <div className="hub-system-mark" role="img" aria-label="Two SANY workstreams: phase-aware weave vision and pre-weld localization"><span>ROBOT + CAMERA</span><div><b>01</b><strong>Weave vision</strong><small>Motion phase → real RAW frame</small></div><div><b>02</b><strong>Pre-weld localization</strong><small>3D point cloud → height correction</small></div><span>ONE INDUSTRIAL SYSTEM</span></div>
      </header>

      <section className="compact-section compact-section-first" aria-labelledby="hub-work"><div className="compact-section-heading"><span>01 / WORKSTREAMS</span><h2 id="hub-work"><T zh="两条工作线，两个不同的问题" en="Two workstreams, two distinct problems" /></h2><p><T zh="焊前定位处理工件几何与机器人坐标；摆弧焊视觉处理采样失配与时间选择。公开结果与职责分别标注。" en="Pre-weld localization concerns workpiece geometry and robot coordinates. Weave vision concerns sampling mismatch and temporal selection. Results and ownership stay separate." /></p></div>
        <div className="hub-workstreams">
          <section className="hub-workstream" aria-labelledby="hub-phase-title">
            <header><span>01</span> / PRIMARY TECHNICAL ESSAY</header>
            <div className="hub-workstream-body">
              <div className="hub-workstream-copy">
                <h3 id="hub-phase-title"><T zh="基于运动相位的时间域稳像设计" en="Phase-aware temporal stabilization" /></h3>
                <p><T zh="约 60 Hz 机器人状态无法支撑逐帧高频 TCP 重建。将问题降维到关键相位时间，再从 120–200 Hz RAW 采样范围的历史帧中选取真实观测。" en="Roughly 60 Hz robot state cannot support measured TCP poses for every high-rate frame. Reduce the task to key-phase timing and select a real observation from RAW history in the 120–200 Hz sampling range." /></p>
                <div className="hub-workstream-tags"><span>Motion prior</span><span>RAW history</span><span>ISP</span><span>Clock drift</span></div>
                <Link className="hub-workstream-link" href={`${base}/technical`}><T zh="阅读交互式技术长文" en="Read the interactive technical essay" /><span aria-hidden="true">↗</span></Link>
              </div>
              <WorkstreamFigure kind="phase" />
            </div>
          </section>
          <section className="hub-workstream hub-workstream-reverse" aria-labelledby="hub-spatial-title">
            <header><span>02</span> / RELATED ENGINEERING MODULE</header>
            <div className="hub-workstream-body">
              <div className="hub-workstream-copy">
                <h3 id="hub-spatial-title"><T zh="焊前 3D 点云定位与高度纠偏" en="Pre-weld 3D localization and height correction" /></h3>
                <p><T zh="关联预存工件点云、实时观测与机器人 TCP 位姿，在机器人坐标系下求取焊前高度修正。此模块为参与开发，公开的 ±0.5 mm 结果仅属于焊前定位。" en="Relate a stored workpiece point cloud, live observations, and robot TCP pose to derive a pre-weld height correction in robot coordinates. This was collaborative work; the public ±0.5 mm result belongs to this module only." /></p>
                <div className="hub-workstream-tags"><span>Point cloud</span><span>TCP pose</span><span>Registration</span><span>Robot integration</span></div>
                <Link className="hub-workstream-link" href={`${base}/pre-weld-localization`}><T zh="阅读焊前定位案例" en="Read the pre-weld localization case" /><span aria-hidden="true">↗</span></Link>
              </div>
              <WorkstreamFigure kind="spatial" />
            </div>
          </section>
        </div>
      </section>

      <section className="compact-section compact-section-split" aria-labelledby="hub-ownership"><div className="compact-section-heading"><span>02 / CONTRIBUTION BOUNDARY</span><h2 id="hub-ownership"><T zh="我负责的系统边界" en="My engineering boundary" /></h2></div><div className="compact-prose"><p><T zh="我重点设计了摆弧焊视觉的相位感知链路、多 Chunk 环形 RAW 历史、选帧后的 ISP 路径，以及相机与机器人设备计数的共同软件时间映射。焊前定位是我参与的相关模块。" en="My main design work covered phase-aware weave vision, multi-chunk RAW history, post-selection ISP, and software time mapping between camera and robot counters. Pre-weld localization was a related collaborative module." /></p><p><T zh="2D 特征提取、极线 / 极射线几何与具体 3D 求解器属于协作或既有链路。200 Hz 是 RAW 设计目标，PTP 与全帧率 TCP 重建不作为已实现能力展示。" en="2D features, epipolar or polar-ray geometry, and the detailed 3D solver belong to collaborative or existing work. 200 Hz is a RAW design target; PTP and full-rate TCP reconstruction are not claimed as implemented." /></p></div></section>
      <div className="compact-endlinks"><Link href="/experience"><T zh="查看工作经历" en="View experience" /> →</Link><Link href="/projects/waterbag-inspection"><T zh="下一案例：工业视觉检测" en="Next: industrial vision inspection" /> →</Link></div>
    </article><SiteFooter />
  </main>;
}
