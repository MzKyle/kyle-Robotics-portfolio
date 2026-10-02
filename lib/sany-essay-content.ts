import type { LocalizedText } from "./portfolio";

const l = (zh: string, en: string): LocalizedText => ({ zh, en });

export type SanyMediaName =
  | "hero-robot.webp"
  | "weld-pool-raw.webp"
  | "weld-pool-processed.webp"
  | "robot-camera-setup.webp"
  | "debug-interface.webp"
  | "phase-sequence.webp";

export type EssayFigureId =
  | "sampling"
  | "motion"
  | "reduction"
  | "matching"
  | "transition"
  | "isp"
  | "buffer"
  | "clock"
  | "clock-mapping"
  | "system"
  | "error"
  | "evolution"
  | "method";

export type EssayBlock =
  | { kind: "p"; text: LocalizedText }
  | { kind: "subhead"; text: LocalizedText }
  | { kind: "list"; items: LocalizedText[]; ordered?: boolean }
  | { kind: "formula"; expression: string; caption?: LocalizedText }
  | { kind: "note"; text: LocalizedText }
  | { kind: "figure"; id: EssayFigureId }
  | { kind: "media"; name: SanyMediaName; caption: LocalizedText };

export type EssayChapter = {
  id: string;
  number: string;
  title: LocalizedText;
  deck: LocalizedText;
  blocks: EssayBlock[];
};

// Public, bilingual adaptation of add_res/系统设计_---_基于运动相位的时间域稳像设计.md.
// Keep the source article's eight-chapter argument and equations. Internal protocol details
// and third-party hotlinked illustrations are intentionally omitted from the public page.
export const sanyEssayChapters: EssayChapter[] = [
  {
    id: "sampling-mismatch",
    number: "01",
    title: l("问题本源：60 Hz 为什么不够？", "The source of the problem: why 60 Hz is insufficient"),
    deck: l("机器人状态、视觉采样速率与时间同步精度发生系统性失配。", "Robot state, visual sampling rate, and time alignment do not match."),
    blocks: [
      { kind: "p", text: l("相机随机器人末端的周期摆弧一起运动。图像中的变化同时包含熔池自身的位置和 TCP 摆弧导致的视角偏移。要稳定观察熔池，需要处理后者，但首先必须知道相机何时处于什么运动状态。", "The camera moves with the robot's periodic weave. Image motion mixes the weld pool's own position with camera viewpoint changes caused by TCP motion. Stable observation requires handling the latter, which first requires knowing when the camera occupied a given motion state.") },
      { kind: "subhead", text: l("逐帧补偿的直觉", "The intuitive per-frame approach") },
      { kind: "p", text: l("直观方案是读取 TCP 位姿和视觉检测结果，经过状态融合后，对每帧执行逆向几何变换。这一路径需要每个图像采集时刻都有可信的高频 TCP 状态；在开放伺服接口下可以讨论，在当前工业机器人对外状态频率下则遇到了输入信息不足的问题。", "An intuitive route reads TCP poses and visual detections, fuses state, and applies an inverse geometric transform to each frame. It needs a trustworthy high-rate TCP state at every exposure. That is plausible with an open servo interface, but the available industrial-robot state does not contain enough observations.") },
      { kind: "subhead", text: l("刚性约束：约 60 Hz 的 TCP 状态", "The hard constraint: roughly 60 Hz TCP state") },
      { kind: "p", text: l("项目中可获取的 FANUC TCP 状态有效更新频率约为 60 Hz；熔池相机的 RAW 采样能力约在 120–200 Hz 范围，200 Hz 是设计目标。机器人状态间隔约 16.7 ms，相机在这一间隔内可以形成多个真实 RAW 观测，但不会因此得到新的机器人状态测量。", "Available FANUC TCP state updated at about 60 Hz. Weld-pool camera RAW capability was roughly 120–200 Hz, with 200 Hz as a design target. Robot samples are about 16.7 ms apart; several real RAW observations can occur between them without creating another robot-state measurement.") },
      { kind: "formula", expression: "T_robot ≈ 1 / 60 ≈ 16.7 ms", caption: l("机器人状态采样间隔", "Robot-state sample interval") },
      { kind: "figure", id: "sampling" },
      { kind: "p", text: l("把约 60 Hz 的 TCP 序列插值到更高频率，确实会生成更多数值，却不会增加真实观测。若继续用这些估计值逐帧做 Kalman 融合和图像变换，误差根源仍是未观测的高频运动，而不是滤波参数不够复杂。", "Interpolating a roughly 60 Hz TCP sequence produces more numbers, not more measurements. Using those estimates for per-frame Kalman fusion and warping leaves the central problem intact: high-rate motion was not observed, regardless of filter complexity.") },
      { kind: "note", text: l("插值可以提供模型预测，不能将预测当作机器人状态真值。", "Interpolation can provide a model prediction; it cannot turn that prediction into measured robot-state truth.") },
    ],
  },
  {
    id: "motion-prior",
    number: "02",
    title: l("运动先验：摆弧不是随机扰动", "Motion prior: weaving is not random disturbance"),
    deck: l("沿焊缝的慢变运动，与具有周期结构的摆弧运动，处于不同时间尺度。", "Slow seam following and structured periodic weave occupy different time scales."),
    blocks: [
      { kind: "p", text: l("摆弧由机器人控制器主动执行，具有已知或可配置的周期、振幅、轨迹形式与相位连续性。把它全部视作未知高频随机扰动，会丢失最有价值的工艺先验。", "The controller deliberately generates the weave. Its period, amplitude, path form, and phase continuity provide useful prior structure. Treating it all as unknown high-rate random motion discards that information.") },
      { kind: "formula", expression: "p_TCP(t) = p_seam(t) + p_weave(t)", caption: l("焊缝局部坐标系下的平移运动工程化拆解", "Engineering decomposition of translation in the local seam frame") },
      { kind: "note", text: l("该表达式不是完整六自由度刚体运动的严格向量相加，也不意味着摆弧先验能消除真实伺服误差。", "This is not a strict sum of full six-degree-of-freedom rigid-body motion, and the prior does not remove real servo error.") },
      { kind: "subhead", text: l("慢变焊缝跟随分量", "The slow seam-following component") },
      { kind: "p", text: l("p_seam(t) 包含沿焊缝的进给与视觉纠偏，变化较慢、没有固定周期，仍需通过实际观测估计。在单个摆弧周期的局部窗口内，可以用慢变趋势近似。", "p_seam(t) includes feed along the seam and visual correction. It changes slowly, has no fixed period, and still needs real observations. Over a local weave cycle it can be approximated as a slow trend.") },
      { kind: "subhead", text: l("结构化的周期摆弧分量", "The structured periodic weave component") },
      { kind: "p", text: l("p_weave(t) 的周期运动由工艺设定与运动连续性约束。真实 TCP 采样点可用于约束局部模型的相位，而不必被误当成每个相机曝光时刻的完整 TCP 位姿。", "p_weave(t) is constrained by programmed periodic motion and continuity. Real TCP samples can constrain a local phase model without being mistaken for a complete pose at every camera exposure.") },
      { kind: "figure", id: "motion" },
      { kind: "p", text: l("因此，关键不是把机器人采样率“提升”到相机频率，而是利用低频真实观测与已知运动结构，找出值得采样的运动事件。", "The task is therefore not to “raise” the robot's measured rate to the camera rate. It is to use sparse real observations and known motion structure to locate the event worth imaging.") },
    ],
  },
  {
    id: "event-time",
    number: "03",
    title: l("问题降维：不再重建完整轨迹", "Problem reduction: stop reconstructing the full trajectory"),
    deck: l("从连续状态估计，转向少数关键摆弧事件的时间估计。", "Move from continuous-state reconstruction to the timing of a few key weave events."),
    blocks: [
      { kind: "p", text: l("逐帧补偿要求每个图像时刻的 TCP 位置、速度与延迟都足够准确；同相位稳像只需确定目标相位对应的时刻 t_phase 或 t_peak。后者约束更强，求解目标也更窄。", "Per-frame compensation asks for accurate TCP position, velocity, and delay at every exposure. Same-phase observation needs the time t_phase or t_peak of a chosen phase. That is a narrower target with stronger prior constraints.") },
      { kind: "subhead", text: l("关键相位如何定义", "Defining a key phase") },
      { kind: "p", text: l("可选事件包括左右极值、中心过零点或固定目标相位。对于摆弧极值，局部运动的一阶导数为零；周期模型或极值附近的局部拟合可以用于估计该事件时刻。", "A target event may be a left or right extremum, a center crossing, or another fixed phase. At an extremum the local weave derivative is zero; a periodic model or local fit near that extremum can estimate its time.") },
      { kind: "formula", expression: "x_weave(t) = A sin(ωt + φ)      dx_weave(t) / dt = 0 at a peak", caption: l("模型与极值条件；公式为说明性局部模型", "Illustrative local model and extremum condition") },
      { kind: "figure", id: "reduction" },
      { kind: "p", text: l("t_phase 适合用于事件时间选帧，不能推导出“已获得完整 200 Hz / 1 kHz TCP 真值”。局部慢变假设与运动连续性缩小估计范围，但不消除真实伺服误差。", "t_phase supports event-time frame selection, not a claim of complete 200 Hz or 1 kHz TCP truth. Slow local trends and motion continuity narrow the estimate without removing real servo error.") },
    ],
  },
  {
    id: "temporal-selection",
    number: "04",
    title: l("思路转换：从空间补偿到时间选帧", "The shift: from spatial compensation to temporal selection"),
    deck: l("估计事件时间，再从高频真实 RAW 历史中找到同相位帧。", "Estimate the event time, then find a same-phase frame in real high-rate RAW history."),
    blocks: [
      { kind: "p", text: l("摆弧运动具有可重复的周期结构。在多个周期里取相同相位的图像，相机相对熔池的观察状态更接近，便能形成相位一致的关键帧序列。此处选择的是实际曝光的帧，不对每张图像做几何逆变换。", "Periodic weave makes repeatable phase selection possible. Choosing images at the same phase across cycles brings the camera's relative viewpoint closer to the same state and forms a phase-consistent key-frame sequence. The selected images were actually exposed; they are not per-frame geometric warps.") },
      { kind: "figure", id: "transition" },
      { kind: "subhead", text: l("时间域选帧的核心匹配", "The essential temporal match") },
      { kind: "formula", expression: "i* = argminᵢ |t_cam(i) − t_phase|      I_key = I_RAW(t_cam(i*))", caption: l("在共同时间轴上选择距离目标相位最近的真实帧", "Choose the real acquired frame nearest the target phase on a common timeline") },
      { kind: "figure", id: "matching" },
      { kind: "subhead", text: l("新的瓶颈：RAW 时间采样粒度", "The new limit: RAW temporal sampling") },
      { kind: "p", text: l("目标由空间域逐帧补偿转向时间域选帧后，相机采样间隔决定了理想最近邻量化误差上界。120 Hz 的间隔约 8.33 ms，上界约 ±4.17 ms；200 Hz 的间隔为 5 ms，上界为 ±2.5 ms。这只是均匀采样的理想量化项，不包含机器人相位估计和跨设备同步误差。", "Once the goal shifts to temporal selection, the camera sample interval bounds ideal nearest-frame quantization. At 120 Hz the interval is about 8.33 ms and the bound about ±4.17 ms; at 200 Hz they are 5 ms and ±2.5 ms. These are uniform-sampling quantization terms only, excluding phase-estimation and cross-device timing error.") },
      { kind: "formula", expression: "|e_camera,quant| ≤ T_camera / 2", caption: l("理想最近邻时间量化上界", "Ideal nearest-frame temporal quantization bound") },
      { kind: "note", text: l("200 Hz 的意义是 RAW 时间采样分辨率，不代表系统输出 200 FPS 视频或具备 ±2.5 ms 端到端精度。", "200 Hz describes RAW temporal sampling resolution, not 200 FPS video output or ±2.5 ms end-to-end accuracy.") },
    ],
  },
  {
    id: "isp-decoupling",
    number: "05",
    title: l("架构重构：把 ISP 移出关键路径", "Architecture redesign: move ISP off the capture path"),
    deck: l("先获得密集真实采样，再决定哪些帧值得完整成像。", "Acquire dense real samples first; decide which frames deserve full image processing afterward."),
    blocks: [
      { kind: "p", text: l("传统串行链路默认每采一帧 RAW 就立即完成 ISP，再交给上位机与算法。完整 ISP 涉及黑电平、坏点、去马赛克、颜色与降噪等处理；若每帧都执行，处理能力可能先于 Sensor 读出成为时间采样瓶颈。", "A conventional serial path assumes every RAW frame immediately passes through full ISP before host processing. Full ISP includes black-level correction, bad-pixel handling, demosaicing, color work, and denoising. Processing throughput can become the temporal-sampling limit before sensor readout does.") },
      { kind: "figure", id: "isp" },
      { kind: "list", items: [l("Sensor 连续采集带时间戳的 RAW，并保留在滚动历史窗口。", "The sensor continuously records timestamped RAW into rolling history."), l("根据机器人侧估计的 t_phase，查询最近的真实 RAW 帧。", "The robot-side t_phase selects the nearest real RAW frame."), l("仅对被选中的 Key RAW 执行完整 ISP，然后进入视觉处理。", "Only selected Key RAW receives full ISP before vision processing.")], ordered: true },
      { kind: "p", text: l("此架构把 RAW 采样能力与完整成像负载解耦。它追求更密的时间观测点与更少的无效 ISP 计算，并不声称所有设备都能持续达到精确 200 Hz，也不把未测吞吐量写成结果。", "This architecture separates RAW sampling capability from full imaging load. It seeks denser time observations and less unnecessary ISP work; it does not claim every device sustained exactly 200 Hz or present unmeasured throughput as a result.") },
    ],
  },
  {
    id: "dual-timeline",
    number: "06",
    title: l("双时间轴协同：让机器人与相机在时间上相遇", "Dual timelines: make robot and camera meet in time"),
    deck: l("两条链路不必同频，却必须在经过校正的共同时间基准上关联。", "The two paths need not share a rate, but their events must be related on a corrected common time base."),
    blocks: [
      { kind: "p", text: l("机器人侧从离散 TCP 观测、运动趋势分离与局部摆弧模型得到 t_phase；相机侧独立连续采集 RAW、记录靠近曝光时刻的时间戳，并保留可回溯的历史窗口。机器人的判断可能滞后于采集，因此相机不能等待判断后才开始拍摄。", "The robot path derives t_phase from discrete TCP observations, trend separation, and a local weave model. The camera independently captures RAW, timestamps near exposure, and retains retrievable history. Robot-side inference can lag exposure, so the camera cannot wait for that inference before capturing.") },
      { kind: "subhead", text: l("机器人侧：估计事件，也可以预测下一周期", "Robot side: estimate an event, potentially predict the next cycle") },
      { kind: "p", text: l("最近一段 TCP 状态可约束摆弧周期、振幅与相位；极值或固定相位对应 t_phase。当周期稳定时，当前事件还可以用于预测下一周期的同相位时刻。预测仍然是模型估计，不会把 60 Hz 测量变成高频真值。", "Recent TCP states constrain weave period, amplitude, and phase, yielding t_phase at an extremum or fixed phase. When the period is stable, one event can predict the next same-phase event. Prediction remains a model estimate, not high-rate measured truth.") },
      { kind: "formula", expression: "t̂_phase(n + 1) = t_phase(n) + T_weave", caption: l("下一周期事件时间预测的概念式", "Conceptual next-cycle event prediction") },
      { kind: "subhead", text: l("相机侧：真实 RAW 历史与完整帧生命周期", "Camera side: real RAW history and complete frame lifetime") },
      { kind: "p", text: l("Multi-Chunk + Ring Buffer 将连续生产与按相位消费分离。逻辑历史窗口约 200–250 ms，物理容量约 64 帧；它们是该方案的结构参数，不是经过全面 benchmark 得出的普适最优值。", "A multi-chunk ring buffer separates continuous production from phase-based consumption. Its logical history window is about 200–250 ms and its physical capacity about 64 frames. These are design parameters, not universal optima proven by exhaustive benchmarking.") },
      { kind: "figure", id: "buffer" },
      { kind: "p", text: l("完整 RAW 帧从写入、封存、读取到回收有明确所有权。多 chunk 用来吸收临时处理延迟；环形复用使内存长期有界。该设计不被表述为已证明解决所有异常帧的唯一原因。", "Complete RAW frames have explicit ownership through writing, freezing, reading, and recycling. Multiple chunks absorb temporary processing delay; ring reuse keeps storage bounded. The design is not presented as proof of a single cause for all anomalous frames.") },
      { kind: "subhead", text: l("共同时间基准：Measurement Time ≠ Callback Time", "Common time base: measurement time is not callback time") },
      { kind: "p", text: l("相机与机器人没有共享硬件时钟。初始化时同时记录两侧设备计数与工控机参考时间，建立软件同步锚点；后续把设备计数换算到共同时间轴，再比较相位时刻与 RAW 采集时刻。网络、ROS 调度和线程延迟不能直接充当原始采集时间。", "Camera and robot lack a shared hardware clock. At initialization, both device counters and a host reference time establish a software synchronization anchor. Subsequent counters map to a common timeline before phase and RAW acquisition times are compared. Network, ROS scheduling, and thread delay must not stand in for original acquisition time.") },
      { kind: "formula", expression: "C_camera⁰ ↔ C_robot⁰ ↔ t_sync      C_device → t_device → t_common", caption: l("启动锚点与设备计数的软件时间映射", "Startup anchor and software mapping from device counters") },
      { kind: "subhead", text: l("长期运行：初始 offset 校准仍会漂移", "Long runs: correcting initial offset still leaves drift") },
      { kind: "p", text: l("原文记录了长时间运行后相机与机器人 count 映射逐渐偏移的现象。两侧时钟频率有微小差异时，一次同步只能校正当时的 offset，不能阻止后续 drift 累积。因此在设备空闲窗口周期性读取新的计数并更新映射。", "The source article records a gradual shift in the camera-to-robot count mapping during long operation. A small clock-rate difference means one synchronization corrects only the current offset, not future drift. New counters are therefore read during idle windows to refresh the mapping.") },
      { kind: "figure", id: "clock" },
      { kind: "figure", id: "clock-mapping" },
      { kind: "note", text: l("这是软件时间校准与漂移补偿，不等于已实现 PTP 或硬实时全局时钟；最终精度仍受计数器分辨率、晶振、同步时延与调度影响。", "This is software time calibration and drift compensation, not implemented PTP or a hard real-time global clock. Counter resolution, oscillators, synchronization delay, and scheduling still limit accuracy.") },
      { kind: "subhead", text: l("完整系统：两条时间轴，一次真实选帧", "Full system: two timelines and one real frame selection") },
      { kind: "figure", id: "system" },
      { kind: "p", text: l("相位匹配后，选中的 RAW 帧经 ISP 形成同相位图像序列，并交由下游视觉算法或人工观察。2D / 3D 几何求解属于协作或既有链路；本篇重点解释其上游的采样、相位与时间系统设计。", "After matching, selected RAW frames pass through ISP into a phase-consistent image sequence for downstream vision or observation. Detailed 2D / 3D geometry belongs to collaborative or existing work; this essay focuses on upstream sampling, phase, and timing design.") },
    ],
  },
  {
    id: "error-evolution",
    number: "07",
    title: l("误差分析与方案演进", "Error analysis and future evolution"),
    deck: l("理想采样上界只是其中一项；真实总误差需要实验表征。", "The ideal sampling bound is only one term; real total error needs experimental characterization."),
    blocks: [
      { kind: "p", text: l("相位估计与成像误差来自多个来源，不能仅用相机帧率解释。原文将它们按机器人采样、模型、通信、同步和相机采集五类拆开；当前没有公开实验足以给出各项占比。", "Phase matching and imaging error have several sources beyond camera frame rate. The source article separates robot sampling, model, communication, synchronization, and camera acquisition terms. No public experiment supports numerical proportions for them.") },
      { kind: "formula", expression: "e_total = e_robot + e_model + e_comm + e_sync + e_camera", caption: l("结构化误差清单，不是经过标定的线性统计模型", "Structural error inventory, not a calibrated statistical model") },
      { kind: "figure", id: "error" },
      { kind: "subhead", text: l("随着硬件接口升级，方案可以演进", "The path can evolve with better hardware interfaces") },
      { kind: "p", text: l("如果未来可获得更高频率的伺服状态，并有更精确的硬件时间同步，逐帧状态融合与空间补偿才有更充分的信息基础。这些属于未来条件与方向，不是本项目已实现的能力。", "Higher-rate servo state and more precise hardware clock synchronization would provide a stronger basis for per-frame fusion and spatial compensation. They are future conditions and directions, not capabilities implemented in this project.") },
      { kind: "figure", id: "evolution" },
    ],
  },
  {
    id: "methodology",
    number: "08",
    title: l("思考：硬件约束下如何重新定义问题", "Method: redefine the problem under hardware constraints"),
    deck: l("这项工作的关键不是某个单独算法，而是识别信息瓶颈并重构求解路径。", "The key contribution is identifying the information bottleneck and restructuring the solution path."),
    blocks: [
      { kind: "p", text: l("逐帧融合效果不佳时，继续调参数无法改变约 60 Hz 状态所含的信息量。先向下检查设备接口与真实观测，再向上寻找摆弧工艺的结构化先验，才有机会从错误的求解目标中退出。", "When per-frame fusion performs poorly, more tuning cannot change the information in roughly 60 Hz state. Inspect the device interface and real observations first, then use structured weave-process priors to leave the wrong optimization target behind.") },
      { kind: "p", text: l("运动分解把未知高频状态收缩为慢变趋势和周期相位；问题降维把逐帧空间补偿收缩为关键事件时间；架构重构再让相机高频采样与 ISP 按需处理各自承担合适的任务。", "Motion decomposition turns unknown high-rate state into a slow trend and periodic phase. Problem reduction replaces per-frame spatial compensation with event timing. Architecture redesign then assigns dense sampling to the camera and selective work to ISP.") },
      { kind: "figure", id: "method" },
    ],
  },
];

export const sanyEssayMedia = {
  "hero-robot.webp": l("机器人现场素材", "robot project photograph"),
  "weld-pool-raw.webp": l("熔池 RAW 帧", "weld-pool RAW frame"),
  "weld-pool-processed.webp": l("ISP 后图像", "post-ISP image"),
  "robot-camera-setup.webp": l("机器人与相机布置", "robot–camera setup"),
  "debug-interface.webp": l("脱敏调试界面", "sanitized debug interface"),
  "phase-sequence.webp": l("同相位序列", "phase-consistent sequence"),
} satisfies Record<SanyMediaName, LocalizedText>;
