import type { CSSProperties } from "react";
import Link from "next/link";
import type { LocalizedText, ProjectDetail } from "../../lib/portfolio";
import { Localized, T } from "../localized";
import { SiteFooter, SiteHeader } from "../site-shell";

const l = (zh: string, en: string): LocalizedText => ({ zh, en });

const sections = [
  { id: "constraint", number: "01", label: l("约束", "Constraint") },
  { id: "redesign", number: "02", label: l("重定义", "Redesign") },
  { id: "motion", number: "03", label: l("运动先验", "Motion prior") },
  { id: "timeline", number: "04", label: l("双时间轴", "Dual timeline") },
  { id: "buffer", number: "05", label: l("RAW Buffer", "RAW buffer") },
  { id: "isp", number: "06", label: l("ISP 解耦", "ISP decoupling") },
  { id: "clocks", number: "07", label: l("时钟", "Clocks") },
  { id: "integration", number: "08", label: l("集成与复盘", "Integration & review") },
] as const;

function SectionHead({ number, eyebrow, title, description }: { number: string; eyebrow: LocalizedText; title: LocalizedText; description?: LocalizedText }) {
  return <header className="sany-section-head">
    <span className="sany-index">{number} / <Localized text={eyebrow} /></span>
    <h2><Localized text={title} /></h2>
    {description && <p><Localized text={description} /></p>}
  </header>;
}

function Flow({ steps, className = "" }: { steps: LocalizedText[]; className?: string }) {
  return <ol className={`sany-flow ${className}`} style={{ "--steps": steps.length } as CSSProperties}>
    {steps.map((step, index) => <li key={step.en}><span>{String(index + 1).padStart(2, "0")}</span><strong><Localized text={step} /></strong></li>)}
  </ol>;
}

function SampleTrack({ kind, count }: { kind: "camera" | "robot"; count: number }) {
  return <div className={`sany-samples sany-samples-${kind}`} aria-hidden="true">
    {Array.from({ length: count }, (_, index) => <i key={index} />)}
  </div>;
}

function RobotCameraTimeline() {
  return <figure className="sany-constraint-figure">
    <div className="sany-track-row"><div><strong>RAW Camera</strong><span>200 Hz target / 5 ms</span></div><SampleTrack kind="camera" count={13} /></div>
    <div className="sany-track-row"><div><strong>Robot State</strong><span>≈60 Hz / 16.7 ms</span></div><SampleTrack kind="robot" count={4} /></div>
    <figcaption><T zh="同一时间窗口内，相机有更多真实采样点；插值不能增加机器人状态的观测量。" en="Within the same interval, the camera records more real samples. Interpolation cannot create robot observations." /></figcaption>
  </figure>;
}

function MotionPriorDiagram() {
  return <figure className="sany-motion-figure">
    <div className="sany-equation" aria-label="p TCP of t equals p seam of t plus p weave of t">p<sub>TCP</sub>(t) <span>=</span> p<sub>seam</sub>(t) <span>+</span> p<sub>weave</sub>(t)</div>
    <svg viewBox="0 0 880 250" role="img" aria-label="Overall TCP motion decomposed into slow seam following and periodic weave motion" preserveAspectRatio="xMidYMid meet">
      <path className="sany-graph-grid" d="M20 42H860M20 124H860M20 206H860" />
      <path className="sany-graph-muted" d="M22 177 C190 168 300 144 438 134 S700 100 858 77" />
      <path className="sany-graph-blue" d="M22 177 C45 137 68 135 92 173 S138 215 162 171 S207 124 231 165 S276 208 300 160 S346 118 370 155 S415 201 439 147 S484 111 508 140 S553 194 577 133 S623 101 647 126 S692 181 716 116 S761 88 785 110 S832 165 858 77" />
      <path className="sany-graph-phase" d="M647 32V210" />
      <circle className="sany-graph-point" cx="647" cy="126" r="7" />
      <text x="660" y="44">t_phase</text>
    </svg>
    <figcaption><span><i className="sany-line-muted" /><T zh="慢变焊缝跟随" en="Slow seam following" /></span><span><i className="sany-line-blue" /><T zh="整体 TCP 轨迹" en="Overall TCP path" /></span><span><i className="sany-line-phase" /><T zh="目标相位时间" en="Target phase time" /></span></figcaption>
    <p><T zh="局部平移运动的工程化拆解；不代表完整六自由度轨迹可由 60 Hz 状态重建。" en="An engineering decomposition of local translation, not a claim that full six degree of freedom motion can be reconstructed from 60 Hz state." /></p>
  </figure>;
}

function PhaseSelectionDiagram() {
  return <figure className="sany-phase-figure">
    <div className="sany-phase-axis">
      <div className="sany-phase-label"><strong><T zh="机器人时间轴" en="Robot timeline" /></strong><small>≈60 Hz · TCP samples → motion prior → t<sub>phase</sub></small></div>
      <div className="sany-phase-track sany-phase-robot"><SampleTrack kind="robot" count={5} /><span className="sany-phase-target">t<sub>phase</sub></span></div>
    </div>
    <div className="sany-phase-axis">
      <div className="sany-phase-label"><strong><T zh="相机时间轴" en="Camera timeline" /></strong><small>200 Hz target · RAW history</small></div>
      <div className="sany-phase-track sany-phase-camera"><SampleTrack kind="camera" count={15} /><span className="sany-selected-frame">KEY RAW</span></div>
    </div>
    <div className="sany-phase-match"><span>t<sub>phase</sub> → RAW timeline</span><strong>i* = argmin |t<sub>cam</sub>(i) − t<sub>phase</sub>|</strong><span><T zh="选取真实采集的最近帧" en="Select the nearest acquired frame" /></span></div>
    <Flow steps={[l("Key RAW", "Key RAW"), l("按需 ISP", "Selective ISP"), l("几何求解", "Geometry solver"), l("机器人纠偏", "Robot correction")]} className="sany-flow-compact" />
    <figcaption><T zh="示意图：两套设备计数先映射到共同时间轴，再执行相位匹配。高亮帧只表示最近邻选择，不表示实测同步误差。" en="Schematic: device counters are mapped to a common timeline before phase matching. The highlighted frame illustrates nearest-neighbor selection, not a measured synchronization error." /></figcaption>
  </figure>;
}

const chunks = [
  { name: "CHUNK 00", state: "WRITING", detail: l("采集线程持有", "Producer owns") },
  { name: "CHUNK 01", state: "FROZEN", detail: l("完整帧已封存", "Complete frames sealed") },
  { name: "CHUNK 02", state: "READING", detail: l("处理线程持有", "Consumer owns") },
  { name: "CHUNK 03", state: "FREE", detail: l("等待回收复用", "Ready for reuse") },
];

function RawBufferArchitecture() {
  return <figure className="sany-buffer-figure">
    <div className="sany-buffer-in"><span><T zh="相机生产者" en="Camera producer" /></span><b>RAW →</b></div>
    <div className="sany-chunk-grid">{chunks.map((chunk) => <div className={`sany-chunk sany-chunk-${chunk.state.toLowerCase()}`} key={chunk.name}><small>{chunk.name}</small><strong>{chunk.state}</strong><span><Localized text={chunk.detail} /></span><div className="sany-chunk-frames" aria-hidden="true"><i /><i /><i /><i /></div></div>)}</div>
    <div className="sany-buffer-lifecycle"><span>PRODUCER</span><b>→</b><span>WRITING</span><b>→</b><span>FROZEN</span><b>→</b><span>READING</span><b>→</b><span>RELEASE / RECYCLE</span></div>
    <div className="sany-buffer-foot"><span><strong>200–250 ms</strong><T zh="逻辑历史窗口" en="Rolling history window" /></span><span><strong>≈64 RAW</strong><T zh="物理容量" en="Physical capacity" /></span><span><strong>t<sub>phase</sub></strong><T zh="历史帧查询键" en="History lookup key" /></span></div>
    <figcaption><T zh="多 chunk 与环形复用将连续采集和延迟不定的处理线程隔开；完整帧移交后才更换所有者。" en="Multiple chunks and ring reuse separate continuous capture from variable processing delay; ownership changes only after a complete frame is handed off." /></figcaption>
  </figure>;
}

function IspPipelineComparison() {
  return <div className="sany-comparison sany-isp-comparison">
    <div><span className="sany-index"><T zh="原链路 / 每帧处理" en="Before / every frame" /></span><Flow steps={[l("Sensor", "Sensor"), l("RAW", "RAW"), l("ISP", "ISP"), l("RGB", "RGB"), l("Algorithm", "Algorithm")]} /><p><T zh="ISP 处于高频采集关键路径。" en="ISP sits on the high-rate acquisition path." /></p></div>
    <div className="sany-comparison-after"><span className="sany-index"><T zh="重构后 / 关键帧处理" en="After / selected frames" /></span><Flow steps={[l("Sensor", "Sensor"), l("RAW Buffer", "RAW buffer"), l("Phase Match", "Phase match"), l("Key RAW", "Key RAW"), l("ISP + Algorithm", "ISP + algorithm")]} /><p><T zh="先保存真实时间采样点，只对关键 RAW 帧执行完整 ISP。" en="Keep real time samples first; run full ISP only on selected RAW frames." /></p></div>
  </div>;
}

function ClockDriftDiagram() {
  return <figure className="sany-drift-figure">
    <svg viewBox="0 0 880 280" role="img" aria-label="Illustrative clock offset growing over runtime and returning toward zero after periodic resynchronization" preserveAspectRatio="xMidYMid meet">
      <path className="sany-graph-grid" d="M80 32V228H850M80 194H850M80 130H850M80 66H850" />
      <path className="sany-graph-muted" d="M80 194H850" />
      <path className="sany-graph-blue" d="M80 193 C190 180 298 143 384 106 L385 193 C500 178 603 144 686 100 L687 192 C746 184 803 165 850 142" />
      <path className="sany-graph-phase" d="M385 42V228M687 42V228" />
      <text x="336" y="34">RESYNC</text><text x="638" y="34">RESYNC</text>
      <text x="10" y="49">offset</text><text x="786" y="257">runtime</text>
    </svg>
    <figcaption><T zh="示意曲线，不代表实测漂移速率。初始 offset 校正后，频率差仍会使映射逐渐偏移；在设备空闲窗口重新同步。" en="Illustrative curve, not a measured drift rate. Correcting initial offset does not remove clock-rate mismatch; mappings are refreshed during idle windows." /></figcaption>
  </figure>;
}

const decisions = [
  { title: l("机器人状态只有约 60 Hz", "Robot state was only about 60 Hz"), wrong: l("继续调插值与滤波，试图补出完整高频 TCP。", "Tune interpolation and filtering to infer a complete high-rate TCP path."), root: l("高频真实状态观测缺失。", "The missing input was real high-rate state observations."), choice: l("由全轨迹重建转向关键相位事件时间估计。", "Estimate the key phase event time instead of the full trajectory.") },
  { title: l("ISP 限制高频采集链路", "ISP constrained the high-rate path"), wrong: l("每采一帧就立即做完整 ISP。", "Run full ISP for every acquired frame."), root: l("采集与成像处理串行耦合。", "Acquisition and image processing were coupled."), choice: l("RAW 连续采集，选帧后再做 ISP。", "Capture RAW continuously and process after selection.") },
  { title: l("简单 Buffer 难以吸收延迟", "A simple buffer could not absorb delay"), wrong: l("采集线程等待消费线程释放。", "Make the producer wait for the consumer."), root: l("吞吐抖动与帧生命周期相互耦合。", "Processing jitter and frame lifetime were coupled."), choice: l("多 chunk 环形历史窗口，显式移交 ownership。", "Use a multi-chunk ring history with explicit ownership handoff.") },
  { title: l("相机与机器人没有统一硬件时钟", "Camera and robot lacked a shared hardware clock"), wrong: l("把回调到达时间当作采集时间。", "Treat callback arrival as capture time."), root: l("网络与调度延迟会改变到达时刻。", "Network and scheduling delay shift arrival time."), choice: l("设备计数映射到共同软件时间轴。", "Map device counters onto a common software timeline.") },
  { title: l("长时间运行后时间轴错位", "Timelines diverged over long runs"), wrong: l("只在启动时校正一次 offset。", "Correct offset only at startup."), root: l("设备时钟频率不同，漂移持续积累。", "Different clock rates accumulate drift."), choice: l("在空闲窗口周期性重新同步并更新映射。", "Resynchronize during idle windows and refresh the mapping.") },
];

const takeaways = [
  { title: l("先检查采样，再选算法", "Sampling before algorithms"), text: l("滤波器无法创造不存在的真实状态观测。", "A filter cannot create missing state measurements.") },
  { title: l("利用领域先验", "Exploit domain priors"), text: l("周期摆弧的已知结构，足以把问题聚焦到关键事件时间。", "Known periodic weave structure narrows the task to event timing.") },
  { title: l("缩小待解问题", "Reduce the problem"), text: l("目标是选择同相位帧，无需伪造完整高频 TCP 轨迹。", "The target is a same-phase frame, not a fabricated full-rate TCP path.") },
  { title: l("采集与处理分离", "Separate capture and processing"), text: l("先保留高密度真实 RAW 采样，再决定计算哪些帧。", "Keep dense real RAW samples, then choose what to compute.") },
  { title: l("时间是一等数据维度", "Time is a first-class data dimension"), text: l("空间坐标正确仍不够；跨设备观测必须在同一时间轴上匹配。", "Correct spatial frames are insufficient without matched device time.") },
];

export function SanyCase({ project, previous, next }: { project: ProjectDetail; previous: ProjectDetail; next: ProjectDetail }) {
  return <main className="sany-case">
    <SiteHeader active="projects" />
    <section className="sany-hero sany-shell">
      <div className="sany-hero-copy">
        <p className="sany-index"><T zh="工程案例 01 / 三一实习" en="ENGINEERING CASE 01 / SANY INTERNSHIP" /></p>
        <h1>Industrial<br />Welding<br />Robotics</h1>
        <p className="sany-hero-subtitle"><T zh="工业焊接机器人实时感知、时序协同与摆弧焊视觉系统" en="Real-time Perception, Timing & Weave Welding Vision System" /></p>
        <p className="sany-hero-summary"><Localized text={project.summary} /></p>
        <p className="sany-hero-stack">C++ <span>·</span> ROS 2 <span>·</span> Multi-threaded RAW <span>·</span> Robot–camera timing</p>
        <a className="sany-text-link" href="#constraint"><T zh="浏览项目概览" en="Explore the project overview" /> ↓</a>
        <Link className="sany-text-link sany-essay-link" href="/projects/sany-welding-robotics/technical"><T zh="阅读完整技术长文：基于运动相位的时间域稳像设计" en="Read the full technical essay: phase aware temporal stabilization" /> ↗</Link>
        <div className="sany-hero-facts"><div><strong>≈60 Hz</strong><span><T zh="机器人状态" en="ROBOT STATE" /></span></div><div><strong>200 Hz</strong><span><T zh="RAW 设计目标" en="RAW DESIGN TARGET" /></span></div><div><strong>PHASE</strong><span><T zh="同相位选帧" en="AWARE SELECTION" /></span></div></div>
      </div>
      <figure className="sany-hero-diagram"><span className="sany-index">SYSTEM REDESIGN / 01</span><div className="sany-hero-nodes"><div><small>INPUT A</small><strong>Robot State</strong><span>≈60 Hz</span></div><div><small>INPUT B</small><strong>RAW Camera</strong><span>up to 200 Hz</span></div><div className="sany-hero-output"><small>DECISION</small><strong>Phase-aware<br />RAW selection</strong><span>t<sub>phase</sub> → Key RAW</span></div></div><figcaption><T zh="示意架构 · 设备和内部流程已脱敏" en="Schematic architecture · devices and internal flow sanitized" /></figcaption></figure>
    </section>

    <nav className="sany-nav" aria-label="SANY case study navigation">{sections.map((item) => <a href={`#${item.id}`} key={item.id}><span>{item.number}</span><Localized text={item.label} /></a>)}</nav>

    <section className="sany-section sany-shell" id="constraint">
      <SectionHead number="01" eyebrow={l("问题与约束", "Problem & constraint")} title={l("瓶颈不是滤波器，而是缺失的观测。", "The bottleneck was missing information, not the filter.")} description={l("FANUC 状态约 60 Hz，而熔池相机 RAW 可达约 120–200 Hz。低频状态无法支撑逐帧高频 TCP 真值重建。", "FANUC state arrived at about 60 Hz while weld-pool RAW sampling could reach roughly 120–200 Hz. Low-rate state cannot support a real high-rate TCP value for every frame.")} />
      <RobotCameraTimeline />
      <div className="sany-principle"><strong>Interpolation ≠ Measurement</strong><p><T zh="16.7 ms 的机器人状态间隔里可以采到多帧 RAW；继续调 Kalman 参数不会补出未被观测的高频运动。" en="Several RAW frames fit inside one 16.7 ms robot-state interval. Tuning Kalman parameters cannot recover motion that was never observed." /></p></div>
    </section>

    <section className="sany-section sany-shell" id="redesign">
      <SectionHead number="02" eyebrow={l("从空间到时间", "From space to time")} title={l("把逐帧补偿改为同相位选帧。", "Turn per-frame compensation into same-phase selection.")} description={l("先重新定义目标：估计关键摆弧相位发生的时间，再从真实采集的 RAW 历史中挑选对应帧。", "Redefine the goal: estimate when the key weave phase occurs, then select the corresponding frame from real RAW history.")} />
      <div className="sany-comparison sany-redesign-comparison"><div><span className="sany-index"><T zh="原路径 / 空间域" en="Previous path / spatial" /></span><Flow steps={[l("60 Hz 状态", "60 Hz state"), l("插值", "Interpolate"), l("逐帧 TCP", "Per-frame TCP"), l("图像变换", "Image warp")]} /><p><T zh="缺口：没有足够的高频真实状态。" en="Gap: insufficient real high-rate state." /></p></div><div className="sany-comparison-after"><span className="sany-index"><T zh="我的重构 / 时间域" en="My redesign / temporal" /></span><div className="sany-redesign-inputs"><Flow steps={[l("60 Hz 状态", "60 Hz state"), l("运动先验", "Motion prior"), l("t_phase", "t_phase")]} /><Flow steps={[l("200 Hz 目标 RAW", "200 Hz target RAW"), l("历史窗口", "History window"), l("Key RAW", "Key RAW")]} /></div><p><T zh="关键相位时间 + RAW 时间轴 → 最近邻真实帧。" en="Phase time + RAW timeline → nearest real frame." /></p></div></div>
      <p className="sany-statement"><T zh="空间域逐帧补偿 → 时间域同相位选帧" en="Spatial compensation → temporal phase selection" /></p>
    </section>

    <section className="sany-section sany-shell" id="motion">
      <SectionHead number="03" eyebrow={l("运动先验", "Motion prior")} title={l("从全轨迹重建，降维到事件时间估计。", "Reduce trajectory reconstruction to event-time estimation.")} description={l("摆弧是有周期结构的受控运动。低频真实观测约束该先验，目标只需 t_phase / t_peak。", "Weave is controlled motion with periodic structure. Low-rate real observations constrain that prior; the needed output is t_phase / t_peak.")} />
      <MotionPriorDiagram />
      <div className="sany-rule-row"><span><T zh="已知结构" en="Known structure" /></span><b>+</b><span><T zh="低频真实观测" en="Low-rate observation" /></span><b>→</b><strong><T zh="关键事件时间" en="Key event time" /></strong></div>
    </section>

    <section className="sany-section sany-shell" id="timeline">
      <SectionHead number="04" eyebrow={l("双时间轴", "Dual timeline")} title={l("让估计的相位落到真实 RAW 帧上。", "Match estimated phase to an acquired RAW frame.")} description={l("机器人侧给出目标相位时间；相机侧保留密集 RAW 采样。两侧先映射到同一软件时间轴。", "The robot side estimates phase time; the camera side retains dense RAW samples. Both are mapped to one software timeline first.")} />
      <PhaseSelectionDiagram />
    </section>

    <section className="sany-section sany-shell" id="buffer">
      <SectionHead number="05" eyebrow={l("高频数据路径", "High-rate data path")} title={l("多 Chunk + Ring Buffer 保留选帧机会。", "A multi-chunk ring buffer preserves the selection window.")} description={l("采集线程持续写入 RAW，处理线程按 t_phase 查询历史帧。Chunk 状态让帧的所有权与释放时机明确。", "Capture keeps writing RAW while processing queries history by t_phase. Chunk states make frame ownership and release explicit.")} />
      <RawBufferArchitecture />
      <p className="sany-section-note"><T zh="设计目标：吸收处理与调度 jitter、保持完整帧生命周期、让消费线程不阻塞采集线程，并将内存用量限制在固定容量。" en="Design intent: absorb processing and scheduling jitter, preserve complete frame lifetimes, keep the consumer from blocking capture, and bound memory use." /></p>
    </section>

    <section className="sany-section sany-shell" id="isp">
      <SectionHead number="06" eyebrow={l("ISP 解耦", "ISP decoupling")} title={l("先采集，后选择，最后处理。", "Capture first. Select second. Process last.")} description={l("完整 ISP 从高频 RAW 采集关键路径移出；只有目标相位附近的 Key RAW 进入后续计算。", "Full ISP is removed from the high-rate RAW acquisition path; only a selected key frame proceeds to processing.")} />
      <IspPipelineComparison />
      <div className="sany-sampling-math"><div><small>120 Hz RAW</small><strong>≈8.33 ms</strong><span><T zh="理想最近邻最大量化误差 ≈ ±4.17 ms" en="Ideal nearest-frame maximum quantization ≈ ±4.17 ms" /></span></div><b>→</b><div><small>200 Hz RAW</small><strong>5 ms</strong><span><T zh="理想最近邻最大量化误差 ±2.5 ms" en="Ideal nearest-frame maximum quantization ±2.5 ms" /></span></div></div>
      <p className="sany-section-note"><T zh="200 Hz 是 RAW 时间采样设计目标，不代表输出 200 FPS 视频；上面的误差仅为均匀采样下的理想量化上界，不是端到端精度。" en="200 Hz is the RAW temporal sampling design target, not a 200 FPS video output. The errors shown are ideal quantization bounds under uniform sampling, not end-to-end accuracy." /></p>
    </section>

    <section className="sany-section sany-shell" id="clocks">
      <SectionHead number="07" eyebrow={l("跨设备时序", "Cross-device timing")} title={l("共同时间轴需要建立，也需要维护。", "A common timeline must be built and maintained.")} description={l("机器人与相机没有共享硬件统一时钟：启动时建立计数映射，运行中处理时钟漂移。", "The robot and camera do not share a hardware clock. Counter mappings are established at startup and refreshed as clocks drift.")} />
      <div className="sany-clock-grid"><div><span className="sany-index"><T zh="启动对齐" en="Startup alignment" /></span><div className="sany-counter-pair"><strong>C<sub>cam</sub><sup>0</sup></strong><strong>C<sub>robot</sub><sup>0</sup></strong></div><p>↓ t<sub>sync</sub> ↓</p><strong className="sany-clock-result"><T zh="共同软件时间轴" en="Common software timeline" /></strong><small><T zh="Camera Count → Acquisition Time；Robot Count → State Time" en="Camera count → acquisition time; robot count → state time" /></small></div><div><span className="sany-index"><T zh="时间戳原则" en="Timestamp principle" /></span><strong className="sany-clock-principle">Measurement Time<br />≠ Callback Time</strong><p><T zh="网络延迟、ROS 调度和线程 jitter 会改变回调到达时刻，因此不能把到达时刻当作采集时间。" en="Network latency, ROS scheduling, and thread jitter shift callback arrival, so arrival cannot stand in for acquisition time." /></p></div></div>
      <div className="sany-drift-block"><h3><T zh="同步不是一次性事件。" en="Synchronization is not a one-time event." /></h3><ClockDriftDiagram /><div className="sany-rule-row"><span>f<sub>camera</sub> ≠ f<sub>robot</sub></span><b>→</b><span><T zh="累计漂移" en="Accumulated drift" /></span><b>→</b><strong><T zh="空闲窗口周期性重同步" en="Periodic resync in idle windows" /></strong></div></div>
    </section>

    <section className="sany-section sany-shell" id="integration">
      <SectionHead number="08" eyebrow={l("系统集成与复盘", "Integration & review")} title={l("把下游求解接入完整感知链路。", "Connect downstream solving to the perception path.")} description={l("3D 几何求解是实际链路的一环；本案例的个人设计重点在其上游的采样、相位、Buffer、ISP 和时间轴。", "The 3D geometry solver is part of the real path. The personal design focus here is upstream sampling, phase, buffering, ISP, and timing.")} />
      <div className="sany-downstream"><span className="sany-index"><T zh="系统集成 / 协作" en="SYSTEM INTEGRATION / COLLABORATION" /></span><Flow steps={[l("Key RAW", "Key RAW"), l("ISP", "ISP"), l("2D 特征", "2D feature"), l("极线 / 极射线几何求解", "Epipolar / polar-ray geometry"), l("3D 纠偏", "3D correction"), l("Clipping / EMA", "Clipping / EMA"), l("Robot", "Robot")]} /><p><T zh="2D 特征提取、极线 / 极射线求交与具体 3D Solver 属于协作或既有求解链路；我负责它与高频采集、相位选帧及跨设备时序链路的系统集成与工程实现。" en="2D feature extraction, epipolar / polar-ray intersection, and detailed 3D solving belong to the collaborative or existing solver path. My work centers on integrating that path with high-rate capture, phase selection, and cross-device timing." /></p></div>
      <div className="sany-review-block"><h3><T zh="工程调试与决策记录" en="Engineering decision log" /></h3><div className="sany-decision-table"><div className="sany-decision-header"><span><T zh="问题" en="PROBLEM" /></span><span><T zh="失效方向" en="FAILED APPROACH" /></span><span><T zh="根因" en="ROOT CAUSE" /></span><span><T zh="我的决策" en="MY DECISION" /></span></div>{decisions.map((item, index) => <div className="sany-decision-row" key={item.title.en}><strong><small>0{index + 1}</small><Localized text={item.title} /></strong><p><Localized text={item.wrong} /></p><p><Localized text={item.root} /></p><p><Localized text={item.choice} /></p></div>)}</div></div>
      <div className="sany-validation"><div><span className="sany-index"><T zh="验证路径 / 公开证据" en="VALIDATION PATH / PUBLIC EVIDENCE" /></span><h3><T zh="设计边界可检查，性能结论只写已公开事实。" en="Check the design path; state only public performance facts." /></h3></div><ol><li><strong><T zh="采样与选帧" en="Sampling & selection" /></strong><p><T zh="核对目标相位时间能否落入约 200–250 ms RAW 历史窗口，并选到实际采集的最近帧；120 / 200 Hz 的误差数字仅为理想采样量化上界。" en="Check that phase time falls within the roughly 200–250 ms RAW history and resolves to a real nearest frame. The 120 / 200 Hz error figures are ideal sampling quantization bounds only." /></p></li><li><strong><T zh="数据生命周期" en="Data lifetime" /></strong><p><T zh="检查完整帧从 WRITING 到 FROZEN、READING、FREE 的移交，及采集线程与处理线程的解耦；不填入未公开吞吐 benchmark。" en="Check complete-frame handoff through WRITING, FROZEN, READING, and FREE, and the separation of capture and processing; no unpublished throughput benchmark is claimed." /></p></li><li><strong><T zh="跨设备时序" en="Cross-device timing" /></strong><p><T zh="用设备计数、共同软件时间映射与周期性重同步核对时间关系；公开层面只描述毫秒级对齐，不虚构更细的同步精度。" en="Use device counters, common software time mapping, and periodic resynchronization to check alignment. The public account states millisecond-level timing without inventing finer precision." /></p></li></ol></div>
      <div className="sany-ownership"><h3><T zh="贡献边界" en="Ownership boundaries" /></h3><div><article><span>MY DESIGN</span><ul><li><T zh="相位感知架构与关键帧选择" en="Phase-aware architecture and key-frame selection" /></li><li><T zh="RAW 采集、多 Chunk / Ring Buffer 与生命周期" en="RAW acquisition, multi-chunk ring buffer, and frame lifetime" /></li><li><T zh="ISP 后处理与数据链路" en="Post-selection ISP and data path" /></li><li><T zh="机器人–相机时间映射、漂移处理与集成" en="Robot–camera time mapping, drift handling, and integration" /></li></ul></article><article><span>COLLABORATION</span><ul><li><T zh="2D 特征与极线 / 极射线几何求解" en="2D features and epipolar / polar-ray geometry" /></li><li><T zh="具体 3D Solver 细节" en="Detailed 3D solver" /></li></ul></article><article><span>EXISTING SYSTEM</span><ul><li><T zh="Industrial Robot / Robot Controller" en="Industrial Robot / Robot Controller" /></li><li><T zh="3D Camera / Weld-pool Camera" en="3D Camera / Weld-pool Camera" /></li><li><T zh="既有焊接工艺与设备协议" en="Existing welding process and device protocols" /></li></ul></article></div></div>
      <aside className="sany-preweld"><div><span className="sany-index"><T zh="相关模块 / 焊前定位" en="RELATED MODULE / PRE-WELD POSITIONING" /></span><h3><T zh="焊前定位" en="Pre-weld Positioning" /></h3><p><T zh="另一项真实工作：结合预存工件 3D 点云、机器人 TCP 位姿与实时观测完成空间配准，输出高度纠偏；公开结果为定位 ±0.5 mm。它是独立的焊前模块，不作为摆弧焊相位选帧的性能证据。" en="A separate real workstream: stored workpiece point clouds, robot TCP poses, and live observations are registered to derive height correction. The public positioning result is ±0.5 mm. This belongs to pre-weld positioning, not to weave-phase frame-selection performance." /></p></div><strong>±0.5 mm<small><T zh="焊前定位公开结果" en="PUBLIC PRE-WELD RESULT" /></small></strong></aside>
      <div className="sany-takeaways"><h3><T zh="工程认知" en="Engineering takeaways" /></h3><ol>{takeaways.map((item, index) => <li key={item.title.en}><span>0{index + 1}</span><strong><Localized text={item.title} /></strong><p><Localized text={item.text} /></p></li>)}</ol></div>
      <p className="sany-public-note"><T zh="公开边界：不展示客户、内部代号、IP / 网络拓扑、私有协议、焊接工艺参数、源码、模型权重和未公开设备规格。所有示意图仅表达系统设计，不代表内部原图或实测波形。" en="Public boundary: no client identity, internal codename, IP/network topology, proprietary protocol, welding parameters, source code, model weights, or unpublished device specifications. Diagrams explain the system design; they are not internal drawings or measured traces." /></p>
    </section>

    <nav className="sany-pagination" aria-label="Project pagination"><Link href={`/projects/${previous.slug}`}><span><T zh="上一个案例" en="PREVIOUS CASE" /></span><strong>← {previous.title}</strong></Link><Link href={`/projects/${next.slug}`}><span><T zh="下一个案例" en="NEXT CASE" /></span><strong>{next.title} →</strong></Link></nav>
    <SiteFooter />
  </main>;
}
