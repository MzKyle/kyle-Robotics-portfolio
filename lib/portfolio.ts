export type LocalizedText = { zh: string; en: string };

const l = (zh: string, en: string): LocalizedText => ({ zh, en });

export type ProjectDetail = {
  slug: string;
  index: string;
  title: string;
  subtitle: LocalizedText;
  category: LocalizedText;
  year: string;
  image?: string;
  imageNote: LocalizedText;
  imageMode?: "cover" | "contain";
  cardLayout?: "top" | "side";
  homeImage?: string;
  homeImageMode?: "cover" | "contain";
  homeImagePosition?: string;
  homeDescription?: LocalizedText;
  homeTech?: string[];
  homeEvidence?: { value: string; label: LocalizedText }[];
  homeVisualSteps?: LocalizedText[];
  overviewImage?: { src: string; alt: string };
  repo?: string;
  role: LocalizedText;
  status: LocalizedText;
  summary: LocalizedText;
  intro: LocalizedText;
  challenge: LocalizedText;
  contribution: LocalizedText[];
  tech: string[];
  flow: LocalizedText[];
  modules: { code: string; title: LocalizedText; text: LocalizedText }[];
  decisions: { title: LocalizedText; text: LocalizedText }[];
  engineering: { title: LocalizedText; text: LocalizedText }[];
  validation: { tag: string; title: LocalizedText; text: LocalizedText }[];
  outcomes: { label: LocalizedText; value: string; note: LocalizedText }[];
  value: LocalizedText[];
  kind?: "flagship" | "personal";
  accent?: "timing" | "pipeline" | "control" | "geometry" | "tooling";
  ownership?: { label: LocalizedText; type: "mine" | "collaboration" | "existing" }[];
  problems?: { title: LocalizedText; constraint: LocalizedText; decision: LocalizedText }[];
  deepDive?: { title: LocalizedText; text: LocalizedText }[];
  confidentialityNote?: LocalizedText;
};

const existingProjects: ProjectDetail[] = [
  {
    slug: "waterbag-inspection",
    index: "01",
    title: "Waterbag Inspection",
    subtitle: l("工业水样袋视觉缺陷检测系统", "Industrial water-sampling bag visual inspection system"),
    category: l("工业视觉", "INDUSTRIAL VISION"),
    year: "2025.02 — 2025.12",
    image: "/images/projects/缺陷检测装置1.png",
    imageMode: "contain",
    cardLayout: "side",
    homeImage: "/images/projects/缺陷检测装置1.png",
    homeImageMode: "cover",
    homeImagePosition: "center 44%",
    homeDescription: l("构建采图、检测、分拣与数据追溯一体化工业视觉系统。", "Built an integrated industrial vision system for capture, inspection, sorting, and traceability."),
    homeTech: ["C++17", "Industrial Camera", "ONNX", "Modbus RTU"],
    homeEvidence: [
      { value: "END-TO-END", label: l("完整工业视觉链路", "Complete industrial vision path") },
      { value: "BAG ID", label: l("有序分拣状态管理", "Ordered sorting state") },
    ],
    imageNote: l("工业水样袋缺陷检测工位", "Industrial waterbag inspection station"),
    overviewImage: { src: "/images/projects/缺陷检测装置2.png", alt: "工业水样袋缺陷检测装置实拍" },
    repo: "https://github.com/MzKyle/Defect-detection-of-water-sampling-bags",
    role: l("软件开发工程师 / C++ 视觉后端主控", "Software engineer / C++ vision backend lead"),
    status: l("工业项目完整交付", "Complete industrial system delivery"),
    summary: l("面向白色、半透明、低对比度水样袋，构建采图、检测、分拣和追溯一体化工业视觉系统。", "Built an integrated acquisition, inspection, sorting, and traceability system for white, translucent, low-contrast water-sampling bags."),
    intro: l("水样袋通常是白色、半透明、低对比度的，缺陷可能是针孔、毛发、黑点、异物、压痕、折痕、污染或封边异常。单张普通正面光图片很容易遇到两个问题：缺陷太浅看不见，或者折痕和反光太像缺陷。", "Folds, glare, and material texture can hide tiny defects on translucent bags, making single-image inspection unreliable. The system addresses imaging, detection, concurrent scheduling, physical sorting order, and result traceability as one production pipeline."),
    challenge: l("人工做水袋缺陷检测时是在大背光灯下用手调换不同角度来找缺陷，这中多角度观察微小缺陷的能力对受硬件限制只能平放检测的机器来说是个很大的挑战", "Inference results must stay aligned with the physical Bag ID, both sides, and every lighting condition. Even when concurrent inference finishes out of order, the PLC must never sort the wrong bag."),
    contribution: [
      l("独立开发 C++ 视觉后端主控模块，接入工业相机采集、Modbus RTU、缺陷推理调度与末端分拣控制。", "Independently developed the C++ vision backend controller across industrial-camera capture, Modbus RTU, inference scheduling, and end-of-line sorting."),
      l("参与多光源频闪 Burst 成像与‘整图快速粗检 + ROI 微缺陷精检’链路，面向亚像素级缺陷提升可见性与检出稳定性。", "Contributed to multi-light burst imaging and a full-image coarse pass plus ROI micro-defect refinement for sub-pixel-scale defects."),
      l("完成 YOLO 训练调优、ONNX 导出与 CUDA 部署，并使用 EfficientNet 完成细分类。", "Trained and tuned YOLO, exported ONNX for CUDA deployment, and used EfficientNet for fine-grained classification."),
      l("建立 Bag ID 状态机、乱序结果重排及 JSONL、SQLite、Flask Dashboard 追溯链路。", "Built the Bag-ID state machine, out-of-order result reordering, and a JSONL/SQLite/Flask dashboard traceability path."),
    ],
    tech: ["C++17", "Industrial Camera", "Modbus RTU", "YOLO / ONNX", "CUDA", "EfficientNet", "SQLite / JSONL", "Flask"],
    flow: [l("多光源 Burst 采图", "Multi-light burst capture"), l("Bag ID 组包", "Bag ID aggregation"), l("整图粗检", "Full-image inspection"), l("微缺陷补检", "Micro-defect refinement"), l("结果融合与重排序", "Fusion and reordering"), l("PLC 分拣与追溯", "PLC sorting and traceability")],
    modules: [
      { code: "CAMERA DRIVER", title: l("工业相机与硬触发采集", "Industrial camera and hardware trigger"), text: l("对接海康 MVS SDK，完成连续取流、Burst 会话、Chunk 硬件时间戳和光源/曝光元数据封装；回调只负责收帧，保存与推理移出采集线程。", "Integrates Hikrobot MVS for continuous acquisition, burst sessions, chunk timestamps, and lighting/exposure metadata. Camera callbacks only receive frames; storage and inference stay off the capture thread.") },
      { code: "PLC DRIVER", title: l("产线动作与确认机制", "Line control and acknowledgements"), text: l("统一管理激光到位、光源闪烁、工位拨杆与末端分拣，内置 ACK、超时与重试语义，把机械动作纳入可恢复的软件边界。", "Manages presence sensing, strobes, station levers, and end sorting with ACK, timeout, and retry semantics so mechanical actions remain recoverable.") },
      { code: "CAPTURE ASSEMBLER", title: l("A/B 面六帧袋级组包", "Six-frame A/B bag assembly"), text: l("BagCaptureAssembler 按 Bag ID 等待 A/B 两面、每面三种光照共六帧；缺帧或超时直接进入 fail-safe NG，避免不完整样本继续流入分拣。", "BagCaptureAssembler waits for both sides and three lighting frames per side under one Bag ID. Missing or timed-out frames fail safe to NG.") },
      { code: "ORCHESTRATOR", title: l("检测编排与状态隔离", "Detection orchestration and state isolation"), text: l("DetectOrchestrator 将到位/放行动作与缺陷推理解耦，工位线程不等待模型；缺陷任务按 Bag ID 分片到 worker，保证同袋状态串行一致。", "DetectOrchestrator separates presence/release actions from defect inference. Station flow never waits on the model, while workers are sharded by Bag ID for per-bag consistency.") },
      { code: "REORDER BUFFER", title: l("并发结果物理重排序", "Physical reordering of concurrent results"), text: l("SortReorderBuffer 接收乱序完成的推理结果，只按下一物理 Bag ID 向 sorter thread 释放 OK/NG 指令，阻断并发完成顺序对 PLC 的影响。", "SortReorderBuffer accepts out-of-order inference and releases OK/NG commands to the sorter thread only in physical Bag ID order.") },
      { code: "TRACEABILITY", title: l("可查询的生产记录", "Queryable production records"), text: l("每袋记录帧、相机、动作、原因、检测框、阶段耗时、ACK 和 state trace；JSONL 作为审计源，再同步到 SQLite 与 Flask 看板。", "Each bag records frames, cameras, actions, reasons, boxes, stage timings, ACKs, and state traces in JSONL, then synchronizes to SQLite and a Flask dashboard.") },
    ],
    decisions: [
      { title: l("多光源时序成像", "Sequenced multi-light imaging"), text: l("不同缺陷在不同入射光下具有不同可见性，因此按时序采集多光源图像并按袋级组织，而不是依赖单张图像。", "Different defects become visible under different illumination. Images are therefore captured in a timed multi-light burst and grouped per bag instead of relying on one frame.") },
      { title: l("两阶段检测", "Two-stage detection"), text: l("先使用整图模型完成粗检，再对候选区域进行微缺陷补检，在速度与小目标检出能力之间取得平衡。", "A full-image model performs the first pass, followed by targeted micro-defect inspection to balance throughput and small-object recall.") },
      { title: l("Bag ID 重排序", "Bag ID reordering"), text: l("推理可以并发，但物理分拣必须严格按 Bag ID 输出，通过袋级状态机与重排序缓冲避免误分拣。", "Inference is concurrent, while physical sorting remains strictly ordered by Bag ID through a bag-level state machine and reorder buffer.") },
    ],
    engineering: [
      { title: l("三种光路覆盖不同缺陷", "Three lighting paths expose different defects"), text: l("背光突出毛发、针孔与透射异常，双侧暗场增强划痕和细线，交叉偏振抑制反光并显现浅色污染；光照策略直接服务于缺陷可见性。", "Backlight reveals fibers, pinholes, and transmission anomalies; dual dark field enhances scratches and fine lines; cross polarization suppresses glare and exposes pale contamination.") },
      { title: l("采图时序可验证", "Verifiable capture timing"), text: l("将 trigger、exposure_start/end 与 light_on/off 作为结构化事件校验；超过抖动阈值或曝光不落在亮灯窗口内时，样本被标记无效并安全分拣。", "Trigger, exposure, and light events are validated structurally. Excess jitter or exposure outside the lighting window invalidates the sample and routes it safely.") },
      { title: l("实时层与训练层分离", "Runtime and training separation"), text: l("C++ 负责确定性的设备、队列、状态与 PLC 链路，Python 负责 Ultralytics 训练、benchmark、ONNX 导出及数据观察，两侧通过明确模型和结果契约衔接。", "C++ owns deterministic devices, queues, state, and PLC control; Python owns training, benchmarking, ONNX export, and data observation, joined through explicit contracts.") },
      { title: l("多线程但不牺牲一致性", "Concurrency without losing consistency"), text: l("poll、station、defect worker、sorter 与可选异步写盘各自独立；队列延迟、presence、stage1/2、control、总延迟与重试均进入观测字段。", "Polling, station flow, defect workers, sorting, and optional async persistence are isolated while queue, inference, control, total latency, and retry timings remain observable.") },
    ],
    validation: [
      { tag: "UNIT + CTEST", title: l("状态与顺序测试", "State and ordering tests"), text: l("覆盖到位检测、动作顺序、三帧元数据、A/B 六帧组包、Bag ID 重排序、结果明细和配置加载。", "Covers presence, action order, three-frame metadata, six-frame assembly, Bag ID reordering, result details, and configuration.") },
      { tag: "MOCK E2E", title: l("无硬件整链路验收", "Hardware-free end-to-end acceptance"), text: l("Mock Camera 与 Mock PLC 可以运行一次完整生产循环，生成与真实适配器相同的 JSONL 结果和状态轨迹。", "Mock camera and PLC run a complete production cycle and generate the same JSONL and state traces as real adapters.") },
      { tag: "HARDWARE PATH", title: l("真实设备适配", "Real device adapters"), text: l("真实海康相机支持硬触发、Chunk timestamp 与可选 PTP；PLC 路径包含闪光、拨杆、末端分拣以及确认/重试。", "The Hikrobot path supports hard trigger, chunk timestamps, and optional PTP; PLC control covers strobes, levers, end sorting, acknowledgements, and retries.") },
      { tag: "OPERATIONS", title: l("运行观察与复盘", "Operational observability"), text: l("JSONL 同步到 SQLite 后，可在 Dashboard 按袋查询检测框、原因、耗时和分拣动作，为现场定位与问题回放提供证据。", "JSONL synchronizes into SQLite so the dashboard can inspect per-bag boxes, reasons, timings, and sort actions for incident analysis.") },
    ],
    outcomes: [
      { label: l("系统闭环", "System loop"), value: "4-STAGE", note: l("采图、检测、分拣、追溯", "Capture, inspect, sort, trace") },
      { label: l("推理结构", "Inference design"), value: "2-STAGE", note: l("整图粗检 + 微缺陷补检", "Full image + micro-defect refinement") },
      { label: l("顺序一致性", "Order integrity"), value: "BAG ID", note: l("按物理顺序输出 OK / NG", "Physical-order OK / NG output") },
      { label: l("交付保护", "Delivery protection"), value: "LOCKED", note: l("按客户要求加入模型加密锁", "Model protection for customer delivery") },
    ],
    value: [l("完成从采图、检测、分拣到追溯的工业视觉系统闭环", "Delivered the complete industrial vision loop from capture to traceability"), l("同时具备 C++ 实时后端、模型训练与 ONNX 部署能力", "Combined a C++ production backend with model training and ONNX deployment"), l("解决并发推理与物理 Bag ID 顺序一致性这一关键工程问题", "Solved the critical consistency problem between concurrent inference and physical Bag ID order"), l("通过 Adapter、Mock、状态机和追溯链路体现生产级软件意识", "Demonstrated production engineering through adapters, mocks, state machines, and traceability")],
  },
  {
    slug: "auto-aim",
    index: "02",
    title: "AUTO-Aiming System",
    subtitle: l("RoboMaster 视觉闭环目标跟踪与控制系统", "RoboMaster closed-loop visual targeting and control system"),
    category: l("机器人视觉与控制", "ROBOT VISION & CONTROL"),
    year: "2024.06 — 2025.06",
    image: "/images/projects/Robomaster封面.png",
    imageNote: l("RoboMaster 真实视觉检测画面", "Real RoboMaster vision output"),
    imageMode: "cover",
    homeDescription: l("将工业相机、PnP、EKF、运动预测与控制通信组成 ROS 2 实时视觉闭环。", "Combined industrial cameras, PnP, EKF, motion prediction, and control communication into a ROS 2 real-time vision loop."),
    homeTech: ["ROS 2", "C++17 / C++20", "OpenCV", "PnP / EKF"],
    homeEvidence: [
      { value: "ROS 2 LOOP", label: l("实时视觉闭环", "Real-time vision loop") },
      { value: "EKF / PNP", label: l("状态估计与空间解算", "State and spatial estimation") },
    ],
    repo: "https://github.com/QDU-VRobot/AUTO-Aming-system",
    role: l("算法组组长 / 框架设计 / 核心模块开发", "Vision lead / framework design / core module development"),
    status: l("实车闭环与竞赛验证", "Validated on robots and in competition"),
    summary: l("将工业相机、装甲板识别、PnP、EKF 跟踪、弹道解算和串口控制组织为 ROS 2 实时视觉闭环。", "Integrated industrial cameras, armor detection, PnP, EKF tracking, trajectory solving, and serial control into a ROS 2 real-time vision loop."),
    intro: l("项目面向 RoboMaster 高动态对抗场景，需要在有限算力和强运动干扰下完成稳定识别、状态估计、提前量计算与云台控制。作为算法组组长，我主导 2025 赛季总体自瞄架构与性能迭代，推进 ROS 2 通信重构、成像链路调优、标定工具和团队工程规范。", "The system targets RoboMaster's high-dynamic combat environment, where detection, estimation, lead prediction, and gimbal control must remain stable under motion and compute constraints. As vision lead, I drove the 2025 auto-aim architecture and performance iteration across ROS 2 communications, imaging, calibration tooling, and team practices."),
    challenge: l("从相机观测到云台控制的每一步都依赖统一时间、坐标系和目标状态；任何延迟、TF 偏差或串口异常都会直接表现为瞄准抖动和预测误差。", "Every stage from camera observation to gimbal command depends on consistent time, frames, and target state. Latency, TF errors, or serial faults immediately appear as aiming jitter and prediction error."),
    contribution: [
      l("担任算法组组长，主导 2025 赛季总体自瞄架构与性能迭代；重构 ROS 2 通信并解耦图像处理与目标解算。", "Served as vision lead, driving the 2025 auto-aim architecture and performance iteration while decoupling image processing from target solving through a ROS 2 communications refactor."),
      l("采用 ROS 2 Component 与 intra-process 通信，减少 DDS 序列化、数据复制与链路延迟，并改善部署和调参体验。", "Used ROS 2 components and intra-process communication to reduce DDS serialization, copies, and path latency while improving deployment and tuning."),
      l("调优工业相机成像参数与形态学处理，并开发 SensorCalibration 可视化交互软件完成相机内外参标定。", "Tuned industrial-camera imaging and morphology, and developed the SensorCalibration visual tool for intrinsic and extrinsic calibration."),
      l("集成社区开源方案，以 EKF 融合目标位姿观测与本机运动状态；创建 VRobot 技术组织并建立开发、版本与新人培训规范。", "Integrated community open-source solutions, used an EKF to fuse target-pose observations with host motion, and founded VRobot with development, versioning, and onboarding practices."),
    ],
    tech: ["ROS 2 Humble", "C++17 / C++20", "OpenCV", "PnP", "Eigen / EKF", "TF2", "LibXR / UART", "OpenVINO / TensorRT"],
    flow: [l("工业相机采图", "Industrial camera input"), l("装甲板检测与分类", "Armor detection and classification"), l("PnP 位姿解算", "PnP pose estimation"), l("多模型 EKF 跟踪", "Multi-model EKF tracking"), l("弹道与提前量解算", "Ballistics and lead solving"), l("串口下发云台控制", "UART gimbal command")],
    modules: [
      { code: "CAMERA INPUT", title: l("多相机与回放入口", "Multi-camera and replay inputs"), text: l("hik_camera、mindvision_camera 与 video_publisher 统一发布图像和 CameraInfo；英雄吊射模式可在普通与吊射相机参数间完成运行时切换。", "hik_camera, mindvision_camera, and video_publisher publish a common image and CameraInfo contract; hero mode supports runtime switching between standard and lob-shot camera settings.") },
      { code: "ARMOR DETECTOR", title: l("识别、分类与 PnP", "Detection, classification, and PnP"), text: l("同时保留灯条筛选 + MLP 数字分类和 YOLO 关键点两条检测后端，结合标定内参输出相机光学坐标系下的装甲板三维观测。", "Supports both light-bar plus MLP classification and YOLO-keypoint backends, then uses calibrated intrinsics to produce 3D armor observations in the optical frame.") },
      { code: "ARMOR TRACKER", title: l("多模型 EKF 状态估计", "Multi-model EKF state estimation"), text: l("整车中心、单装甲板与前哨站使用不同状态模型；LOST、DETECTING、TRACKING、TEMP_LOST 状态机配合迟滞切换，处理旋转与短时遮挡。", "Vehicle-center, single-armor, and outpost models run under a LOST/DETECTING/TRACKING/TEMP_LOST state machine with hysteresis for rotation and occlusion.") },
      { code: "TRAJECTORY", title: l("预测与弹道实时解算", "Prediction and real-time ballistics"), text: l("根据目标速度、角速度和当前 TF 预测未来命中点，支持解析/查表补偿；独立线程可配置 CPU 亲和性、SCHED_FIFO 与内存锁定并在权限不足时降级。", "Predicts the future intercept from target motion and TF, with analytic or table compensation. A dedicated thread supports CPU affinity, SCHED_FIFO, and memory locking with graceful fallback.") },
      { code: "SERIAL BOUNDARY", title: l("ROS 2 与下位机边界", "ROS 2 to controller boundary"), text: l("rm_serial_driver 将 pitch、yaw、开火与目标编号转换为 LibXR UART 话题，同时把下位机 AHRS 四元数转为 joint_states，闭合 TF 与控制反馈。", "rm_serial_driver converts pitch, yaw, fire, and target ID into LibXR UART topics, then turns AHRS quaternions back into joint_states to close TF and feedback.") },
      { code: "CALIBRATION + TF", title: l("手眼标定与坐标树", "Hand-eye calibration and frame tree"), text: l("标定节点联合棋盘格 PnP 与云台姿态，拒绝模糊、运动中、时间不同步或姿态重复的样本；结果直接输出可写入 xacro/launch 的 xyz 与 rpy。", "Calibration combines board PnP with gimbal attitude, rejects blurred, moving, stale, or redundant samples, and outputs xacro/launch-ready xyz and rpy.") },
    ],
    decisions: [
      { title: l("ROS 2 模块化链路", "Modular ROS 2 pipeline"), text: l("将采图、识别、跟踪、弹道和通信拆分为清晰节点与接口，便于独立调试、参数替换和不同机器人分支复用。", "Camera, detection, tracking, trajectory, and communication are separated behind explicit ROS 2 interfaces for isolated debugging and reuse across robot variants.") },
      { title: l("多模型状态估计", "Multi-model state estimation"), text: l("针对整车中心、单装甲板与前哨站使用不同 EKF 模型和带迟滞的切换逻辑，适配旋转、遮挡与临时丢失。", "Separate EKF models cover vehicle center, single armor, and outpost targets, with hysteresis-based switching for rotation, occlusion, and temporary loss.") },
      { title: l("仿真、回放与实车共用接口", "Shared simulation, replay, and robot interfaces"), text: l("通过视频发布、目标仿真和真云台 + 仿真目标模式，让算法在缺少完整硬件时仍可验证主链路。", "Video replay, target simulation, and real-gimbal/simulated-target modes verify the main chain even when full hardware is unavailable.") },
    ],
    engineering: [
      { title: l("Component 化部署", "Composable deployment"), text: l("主链路节点以 ROS 2 component 注册并装入多线程容器，弹道节点独立容器运行，便于分别设置线程数、CPU 亲和性与实时策略。", "Main-path nodes are ROS 2 components in a multithreaded container, while trajectory runs separately for independent threading, affinity, and real-time policy.") },
      { title: l("统一时间与坐标约束", "Unified time and frame constraints"), text: l("图像以 camera_optical_frame 发布，观测经 TF 转到 odom；下位机姿态反向驱动 joint_states 与 robot_state_publisher，识别、跟踪和弹道共享同一坐标树。", "Images originate in camera_optical_frame, observations transform into odom, and controller attitude drives joint_states and robot_state_publisher so perception, tracking, and ballistics share one frame tree.") },
      { title: l("面向调车的可观测性", "Observability built for tuning"), text: l("发布二值图、数字 ROI、识别结果、灯条/装甲板 debug、tracker 误差、trajectory 补偿以及 RViz/Foxglove marker，让误差可沿链路逐级定位。", "Binary images, digit ROIs, detection results, light/armor debug, tracker errors, trajectory compensation, and RViz/Foxglove markers expose each stage for tuning.") },
      { title: l("完整实车调参顺序", "Disciplined robot tuning sequence"), text: l("按曝光与帧率、内参、URDF/手眼、时间戳、识别、跟踪、弹道的顺序调试，先消除上游误差再优化控制输出。", "Tuning proceeds through exposure, intrinsics, URDF/hand-eye, timestamps, detection, tracking, and ballistics so upstream errors are removed before control optimization.") },
    ],
    validation: [
      { tag: "REAL ROBOT", title: l("实车闭环模式", "Full robot loop"), text: l("真实相机、真实串口、TF、识别、跟踪和弹道共同运行，用于正式调车与比赛。", "Runs real cameras, serial control, TF, detection, tracking, and ballistics for robot tuning and competition.") },
      { tag: "NO HARDWARE", title: l("感知链独立验证", "Perception without controller hardware"), text: l("无下位机时仍可运行相机、识别和跟踪，独立排查图像与状态估计问题。", "Runs camera, detection, and tracking without a lower controller to isolate perception and estimation issues.") },
      { tag: "SIM + HYBRID", title: l("纯仿真与真云台混合模式", "Simulation and hybrid gimbal mode"), text: l("rm_simulator 可直接生成装甲板观测，也可使用真实云台姿态验证串口、TF、弹道和机械响应。", "rm_simulator can produce armor observations directly or pair with real gimbal attitude to validate serial, TF, ballistics, and mechanical response.") },
      { tag: "VIDEO REPLAY", title: l("可重复视频回放", "Repeatable video replay"), text: l("视频替代相机进入同一 detector component，可保存识别结果视频，用相同样本复现实车问题和比较参数。", "Video replaces the camera in the same detector component and can record annotated output for repeatable issue reproduction and parameter comparisons.") },
    ],
    outcomes: [
      { label: l("系统范围", "System scope"), value: "E2E", note: l("从相机到云台控制闭环", "Camera-to-gimbal closed loop") },
      { label: l("输入模式", "Input modes"), value: "3", note: l("海康、MindVision、视频回放", "Hikrobot, MindVision, video replay") },
      { label: l("运行模式", "Run modes"), value: "5", note: l("实车、无硬件、仿真、混合、回放", "Robot, no-hardware, simulation, hybrid, replay") },
      { label: l("团队成果", "Team result"), value: "NATIONAL", note: l("全国大学生机器人竞赛三等奖", "National robotics competition third prize") },
    ],
    value: [l("以算法组组长身份推动框架重构、核心开发与团队协作", "Led the framework refactor, core development, and team collaboration"), l("掌握从工业相机、检测和状态估计到云台控制的完整视觉闭环", "Built a complete loop from industrial cameras and state estimation to gimbal control"), l("具备手眼标定、TF、串口协议和实车调参的软硬件协同能力", "Combined hand-eye calibration, TF, serial protocols, and on-robot tuning"), l("将竞赛代码沉淀为带架构、算法、接口和运行文档的可维护工程", "Turned competition code into a maintainable system with architecture, algorithm, interface, and operation documentation")],
  },
  {
    slug: "datascope-studio",
    index: "03",
    title: "DataScope Studio",
    subtitle: l("机器人多模态数据可视化与诊断工具", "Multimodal robotics data visualization and diagnostics"),
    category: l("机器人数据工具", "ROBOTICS DATA TOOL"),
    year: "2026",
    image: "https://raw.githubusercontent.com/MzKyle/DataScope-Studio/main/docs/assets/cover.png",
    imageNote: l("DataScope Studio README 项目界面", "DataScope Studio README project view"),
    imageMode: "contain",
    repo: "https://github.com/MzKyle/DataScope-Studio",
    role: l("产品设计 / 全栈开发 / 开源维护", "Product design / full-stack development / open-source maintenance"),
    status: l("跨平台产品化", "Cross-platform product delivery"),
    summary: l("把图像、点云、日志和 ROS 2 Bag 自动映射为可交互的 Rerun 可视化，并建立离线查询与诊断工作流。", "Maps images, point clouds, logs, and ROS 2 bags into interactive Rerun visualizations with offline query and diagnostic workflows."),
    intro: l("机器人项目的数据往往散落在 CSV、JSONL、图片目录、点云文件和 ROS 2 Bag 中。DataScope Studio 将零散的数据分析脚本整合为“导入—识别—映射—校验—可视化—查询”的完整产品流程，为团队提供可复用的数据诊断基础设施。", "Robotics data is commonly scattered across CSV, JSONL, image directories, point clouds, and ROS 2 bags. DataScope Studio turns one-off scripts into an import, schema, mapping, validation, visualization, and query workflow."),
    challenge: l("核心问题不是简单打开文件，而是理解异构数据的结构、时间轴和语义，并让桌面端、API 与命令行共享同一套可靠的转换能力。", "The challenge is not merely opening files, but understanding heterogeneous structure, time, and semantics while sharing one reliable conversion core across desktop, API, and CLI clients."),
    contribution: [
      l("从重复编写机器人数据可视化脚本的痛点出发，定义产品流程、信息架构与桌面交互。", "Defined the product workflow, information architecture, and desktop UX around repeated robotics visualization pain points."),
      l("设计 datascope_core、Adapter、Mapping、Workspace 与 SQLite Catalog 的公共核心架构。", "Designed the shared datascope_core architecture across adapters, mappings, workspaces, and the SQLite catalog."),
      l("完成 Tauri/React 桌面端、FastAPI、本地 Python Runtime 与 Rerun 的跨栈集成。", "Integrated the Tauri/React desktop, FastAPI, local Python runtime, and Rerun across the stack."),
      l("建立自动测试、严格验收、安装包构建、文档与跨平台 Release 流程。", "Established automated testing, strict acceptance, installer builds, documentation, and cross-platform releases."),
    ],
    tech: ["Tauri", "React", "FastAPI", "Python", "SQLite", "Rerun", "ROS 2 Bag", "MCAP"],
    flow: [l("导入本地数据", "Import local data"), l("识别 Schema", "Detect schema"), l("自动 Mapping", "Generate mapping"), l("校验与转换", "Validate and convert"), l("生成 Recording", "Build recording"), l("查询与诊断", "Query and diagnose")],
    modules: [
      { code: "TAURI / REACT", title: l("桌面产品入口", "Desktop product surface"), text: l("仪表盘、导入流程、Schema Inspector、Mapping Editor、Recording、查询、诊断与设置形成一套连续工作流；安装版自动拉起本地 API 和 Python Runtime。", "Dashboard, import flow, schema inspector, mapping editor, recordings, query, diagnostics, and settings form one workflow; installers launch the local API and Python runtime automatically.") },
      { code: "FASTAPI", title: l("稳定的本地服务契约", "Stable local service contract"), text: l("HTTP 层负责请求校验、错误包装和任务接口。桌面端优先直连缓存的本地端口，失败后再回退 Tauri 代理，兼顾响应速度与可用性。", "The HTTP layer owns validation, error contracts, and jobs. Desktop requests the cached local port first, then falls back to the Tauri proxy for speed and resilience.") },
      { code: "DATASCOPE CORE", title: l("三入口共用的业务核心", "One business core for three clients"), text: l("Desktop、API 与 CLI 复用 Workspace、导入、Mapping、转换、查询与项目包逻辑，避免多套入口产生功能漂移。", "Desktop, API, and CLI share workspace, import, mapping, conversion, query, and project-package logic to prevent behavioral drift.") },
      { code: "ADAPTER REGISTRY", title: l("异构机器人数据适配", "Heterogeneous robotics adapters"), text: l("统一 inspect、infer_streams、preview、convert 协议，覆盖 CSV、JSONL、文本日志、图像/检测结果、点云、MCAP 与 ROS 2 DB3。", "A common inspect/infer_streams/preview/convert protocol covers CSV, JSONL, text logs, images and detections, point clouds, MCAP, and ROS 2 DB3.") },
      { code: "MAPPING V2", title: l("从字段到可视化语义", "From columns to visualization semantics"), text: l("自动推断时间字段、单位、标量、状态、日志和几何语义，再通过模板、草稿、预览、校验与确认把数据映射到稳定的 Rerun entity path。", "Infers time, units, scalars, states, logs, and geometry, then uses templates, drafts, previews, validation, and confirmation to produce stable Rerun entity paths.") },
      { code: "CATALOG + QUERY", title: l("离线索引、查询与诊断", "Offline indexing, query, and diagnostics"), text: l("SQLite 管理项目、数据源、stream、mapping、recording、job 和 query index；支持错误日志、低电量、检测失败、topic、时间同步与状态持续时间查询。", "SQLite tracks projects, sources, streams, mappings, recordings, jobs, and query indexes, supporting errors, low battery, detection failures, topics, time sync, and state-duration analysis.") },
    ],
    decisions: [
      { title: l("本地优先", "Local-first"), text: l("数据默认留在用户本机，workspace、SQLite catalog 和生成产物都有明确路径，适合处理体积大且敏感的机器人数据。", "Data stays on the user's machine by default, with explicit paths for workspaces, the SQLite catalog, and generated artifacts.") },
      { title: l("公共核心复用", "Shared core"), text: l("Desktop、FastAPI 与 CLI 统一调用 datascope_core，避免三套入口复制业务逻辑和产生行为差异。", "Desktop, FastAPI, and CLI clients share datascope_core, avoiding duplicated business logic and behavior drift.") },
      { title: l("Adapter + Mapping", "Adapter + mapping"), text: l("通过适配层接入 CSV、JSONL、图像、点云、MCAP 与 ROS 2 DB3，通过模板和 Mapping 将数据转换为统一可视化语义。", "Adapters ingest CSV, JSONL, images, point clouds, MCAP, and ROS 2 DB3; templates and mappings convert them into consistent visualization semantics.") },
    ],
    engineering: [
      { title: l("一键导入编排", "Single-request import orchestration"), text: l("import-workflow 在一次请求中完成添加数据源、inspect、模板推荐、草稿 Mapping、预览和校验，减少桌面端往返与重复扫描。", "import-workflow performs source registration, inspection, template recommendation, draft mapping, preview, and validation in one request, reducing UI round trips and rescans.") },
      { title: l("大数据路径优化", "Large-data path optimization"), text: l("Workspace 异步预热；转换进度按阶段/比例节流写库；表格与 query row 使用迭代处理和 SQLite cursor 流式读取，控制长任务的内存与 I/O。", "Workspace preheats asynchronously; progress writes are throttled by stage and percentage; table and query rows use iteration and SQLite cursors to control memory and I/O.") },
      { title: l("Rerun 产物契约", "Rerun artifact contract"), text: l("每次构建同时生成非空 .rrd Recording 与 .rbl Blueprint，并记录尺寸、版本、转换器、校验和 catalog 注册信息；缺失产物会得到明确状态。", "Each build produces non-empty .rrd and .rbl artifacts with size, version, converter, validation, and catalog metadata; missing artifacts receive explicit status.") },
      { title: l("可迁移工作区", "Portable workspaces"), text: l("raw、cache、recordings、blueprints、mappings、logs 和 exports 路径明确；项目可导出为 .datascope.zip 并在另一台机器重新打开。", "Explicit raw, cache, recordings, blueprints, mappings, logs, and exports paths make projects portable as .datascope.zip packages.") },
    ],
    validation: [
      { tag: "PR GATE", title: l("快速质量门", "Fast pull-request gate"), text: l("统一脚本执行 Python、API 与前端测试以及必要依赖检查，让每次提交都通过同一组基础验收。", "A single acceptance entry runs Python, API, frontend, and dependency checks so every change passes the same baseline.") },
      { tag: "RELEASE GATE", title: l("发布严格验收", "Strict release acceptance"), text: l("Release profile 在快速门之外覆盖正式 Runtime、桌面集成与可选 Tauri 安装包构建，确保源码和交付物一致。", "The release profile extends fast checks with production runtime, desktop integration, and optional Tauri installer builds.") },
      { tag: "API + UI", title: l("真实工作流冒烟", "Real workflow smoke tests"), text: l("从创建项目、导入、自动 Mapping、确认、构建 Recording，到查询、诊断与项目导出，按用户路径验证 API 和桌面交互。", "Smoke tests follow the user path from project creation and auto-mapping through recording, query, diagnostics, and export across API and desktop.") },
      { tag: "3 OS", title: l("跨平台可安装交付", "Installable delivery across three OSes"), text: l("Release 提供 Windows x64、macOS Apple Silicon/Intel、Debian 与 AppImage 产物，桌面端随包携带本地 API、Python Runtime 与 Rerun 集成。", "Releases provide Windows x64, macOS Apple Silicon/Intel, Debian, and AppImage artifacts with the local API, Python runtime, and Rerun integration included.") },
    ],
    outcomes: [
      { label: l("内置适配器", "Built-in adapters"), value: "7", note: l("表格、文本、图像、点云与机器人 Bag", "Tables, text, images, point clouds, robot bags") },
      { label: l("共享核心", "Shared core"), value: "1", note: l("Desktop、API、CLI 复用 datascope_core", "One core across desktop, API, and CLI") },
      { label: l("工作方式", "Processing"), value: "LOCAL", note: l("默认本地处理与持久化", "Local processing and persistence by default") },
      { label: l("交付形态", "Delivery"), value: "DESKTOP", note: l("跨平台安装包与命令行工具", "Cross-platform installers and CLI") },
    ],
    value: [l("能够独立完成桌面端、API、Python 核心与数据层的跨栈架构", "Designed the desktop, API, Python core, and data layer as one cross-stack architecture"), l("能够把重复的数据脚本需求提炼为可扩展的工程产品", "Turned repetitive data scripts into an extensible engineering product"), l("具备开源项目文档、测试、打包和跨平台发布能力", "Delivered documentation, testing, packaging, and cross-platform releases"), l("体现对机器人数据可观测性与工程诊断的系统理解", "Demonstrated a systems view of robotics observability and diagnostics")],
  },
  {
    slug: "robot-sim",
    index: "04",
    title: "Robot-Sim",
    subtitle: l("ROS 2 机器人仿真与系统验收工具链", "ROS 2 simulation and system acceptance toolchain"),
    category: l("机器人仿真", "ROBOTICS SIMULATION"),
    year: "2025 — 2026",
    image: "https://raw.githubusercontent.com/MzKyle/Robot-Sim/main/docs/assets/cover.svg",
    imageNote: l("Robot-Sim README 项目封面", "Robot-Sim README project cover"),
    imageMode: "contain",
    repo: "https://github.com/MzKyle/Robot-Sim",
    role: l("架构设计 / ROS 2 开发 / 仿真验证", "Architecture / ROS 2 development / simulation validation"),
    status: l("系统级仿真工具", "System-level simulation tool"),
    summary: l("用可重复执行的验证场景检查模型、控制器、MoveIt、传感器和工业任务流程是否能够可靠协同运行。", "Uses repeatable acceptance scenarios to validate robot models, controllers, MoveIt, sensors, and industrial task flows together."),
    intro: l("很多机器人仿真仓库只能展示一次 Gazebo 画面，却无法回答控制器是否正确、规划执行是否稳定、传感器链路是否连通。Robot-Sim 将仿真从“展示 Demo”提升为“系统验收工具”。", "Many simulation repositories show a Gazebo demo but cannot prove that controllers, planning, sensors, and tasks work reliably together. Robot-Sim treats simulation as a system acceptance tool."),
    challenge: l("同一套工作空间需要同时管理机器人模型、控制器、规划配置、场景、传感器桥接和任务脚本，还要让不同机器人 Profile 具有一致的启动、验证和产物结构。", "One workspace must coordinate robot models, controllers, planning, scenes, sensor bridges, and task scripts while keeping a consistent launch, validation, and artifact structure across robot profiles."),
    contribution: [
      l("设计 schema/profile/scene/validation case 架构，把机器人差异收敛到声明式配置。", "Designed the schema/profile/scene/validation-case architecture, isolating robot differences in declarative configuration."),
      l("搭建 ROS 2、Gazebo Harmonic、ros2_control、MoveIt 2 与 ros_gz bridge 的统一启动链路。", "Built one launch path across ROS 2, Gazebo Harmonic, ros2_control, MoveIt 2, and ros_gz bridge."),
      l("开发 run_case 验收执行器、Profile Lint、Smoke Helper 与结构化报告产物。", "Developed the run_case acceptance runner, profile lint, smoke helpers, and structured reporting artifacts."),
      l("实现 Panda、FANUC 及工业工作站配置，并将焊接、分拣和 Pick & Place 组织为可复现任务。", "Implemented Panda, FANUC, and industrial-cell profiles, turning welding, sorting, and pick-and-place into reproducible tasks."),
    ],
    tech: ["ROS 2 Humble", "Gazebo Harmonic", "ros2_control", "MoveIt 2", "RViz", "rosbag", "URDF / Xacro", "Python"],
    flow: [l("选择 Profile", "Select profile"), l("加载模型与场景", "Load model and scene"), l("启动控制器", "Start controllers"), l("规划与执行", "Plan and execute"), l("运行验收 Case", "Run acceptance case"), l("生成日志与报告", "Generate logs and reports")],
    modules: [
      { code: "BRINGUP", title: l("统一启动与验收入口", "Unified launch and acceptance entry"), text: l("sim.launch.py 按 profile 与 mode 编排仿真，run_case 负责 schema 校验、进程管理、等待条件、任务执行和报告；scaffold_robot 可生成外部机器人接入模板。", "sim.launch.py composes simulation by profile and mode; run_case handles schema validation, processes, readiness, tasks, and reports; scaffold_robot generates external integration templates.") },
      { code: "DESCRIPTION", title: l("模型与配置渲染", "Model and configuration rendering"), text: l("Profile 统一指向 URDF/Xacro、关节、tool link、world、controller、MoveIt、传感器与 bridge；启动前渲染 robot.urdf 并使用 check_urdf 校验。", "Profiles bind URDF/Xacro, joints, tool links, worlds, controllers, MoveIt, sensors, and bridges; robot.urdf is rendered and checked before launch.") },
      { code: "CONTROL + MOVEIT", title: l("从关节状态到轨迹执行", "From joint state to trajectory execution"), text: l("mock 模式使用 GenericSystem，light/full 使用 gz_ros2_control；控制器 action 接入 MoveIt plan/execute，统一检查 joint_states、controller active 与 trajectory action。", "Mock mode uses GenericSystem while light/full use gz_ros2_control; controller actions connect to MoveIt plan/execute with checks for joint states, active controllers, and trajectory actions.") },
      { code: "SCENARIO LIBRARY", title: l("可参数化场景库", "Parameterized scenario library"), text: l("Scene 与 world preset 使用 schema: 3；参数、variant 和带固定 seed 的 random_boxes generator 可以生成可复现的障碍密度与工业布局。", "Schema-3 scenes and world presets support parameters, variants, and fixed-seed random_boxes generation for reproducible obstacle density and industrial layouts.") },
      { code: "SENSOR RECEIVERS", title: l("统一传感器验收", "Unified sensor acceptance"), text: l("RGB、深度/PointCloud2、LaserScan/LiDAR 点云与 IMU 经 ros_gz_bridge 进入 receiver，统计消息数、频率、时间戳和 frame 并发布 diagnostics。", "RGB, depth/PointCloud2, LaserScan/LiDAR point clouds, and IMU pass through ros_gz_bridge into receivers that track counts, rates, timestamps, frames, and diagnostics.") },
      { code: "VALIDATION CASES", title: l("工业任务验收库", "Industrial acceptance suite"), text: l("内置空运动、障碍避让、fixture-to-pallet、Panda Pick & Place、标定、输送线分拣、焊前 3D 定位与 2D 纠偏干运行等用例。", "Built-in cases cover empty motion, obstacle clearance, fixture-to-pallet, Panda pick-and-place, calibration, conveyor sorting, 3D weld pre-positioning, and 2D correction dry runs.") },
    ],
    decisions: [
      { title: l("Profile 化组织", "Profile-based organization"), text: l("Panda 与 FANUC 使用独立 Profile 管理模型、控制器和任务配置，同时共享验收框架和工具链。", "Panda and FANUC profiles isolate model, controller, and task configuration while sharing the same acceptance framework.") },
      { title: l("场景即测试", "Scenarios as tests"), text: l("把焊接预定位、输送线分拣和 Pick & Place 组织为可重复运行的 Case，而不是依赖人工拖动和肉眼判断。", "Welding pre-positioning, conveyor sorting, and pick-and-place become repeatable cases instead of manual one-off demonstrations.") },
      { title: l("验证产物可追溯", "Traceable validation artifacts"), text: l("统一收集日志、指标、报告和 rosbag，便于定位模型、控制器、规划或传感器链路中的问题。", "Logs, metrics, reports, and rosbags are collected consistently to isolate issues across models, control, planning, and sensing.") },
    ],
    engineering: [
      { title: l("三档仿真模式", "Three simulation modes"), text: l("mock 不启动 Gazebo，快速验证链路与产物；light 启动 headless Gazebo 和控制；full 默认加入 MoveIt/RViz、bridge 与传感器，兼顾反馈速度和系统覆盖。", "Mock skips Gazebo for fast pipeline checks, light runs headless Gazebo and control, and full adds MoveIt/RViz, bridges, and sensors for complete coverage.") },
      { title: l("分阶段可诊断启动", "Diagnosable staged startup"), text: l("一次验收依次经过 Profile Lint、URDF、spawn、控制链、传感器、TF、MoveIt、指标和产物，每一步保留状态、耗时、返回码与日志路径。", "Acceptance progresses through lint, URDF, spawn, control, sensors, TF, MoveIt, metrics, and artifacts, preserving status, duration, return code, and logs per step.") },
      { title: l("指标驱动而非肉眼判断", "Metrics over visual guesswork"), text: l("报告记录 sensor Hz、TF 完整性、规划成功率、规划/执行耗时、末端误差、控制器峰值误差、TCP clearance 与业务动作。", "Reports capture sensor rate, TF integrity, plan success, planning/execution time, goal error, peak controller error, TCP clearance, and business actions.") },
      { title: l("外部机器人可扩展", "Extensible to external robots"), text: l("外部包通过固定 share 路径提供 profile、scene 和 validation case，无需修改核心仓库；生成的 scaffold 同样经过 schema 测试。", "External packages expose profiles, scenes, and cases through fixed share paths without modifying core code, and generated scaffolds pass the same schema tests.") },
    ],
    validation: [
      { tag: "SCHEMA + UNIT", title: l("配置与执行逻辑测试", "Configuration and runner tests"), text: l("覆盖内置 profile/case、scene 参数与 variant、registry、配置迁移、外部 scaffold 和 legacy module adapter。", "Covers built-in profiles/cases, scene parameters and variants, registries, migration, external scaffolds, and legacy adapters.") },
      { tag: "PROFILE LINT", title: l("接入完整性检查", "Integration completeness lint"), text: l("不启动完整仿真即可检查 ROS package、xacro、controller、MoveIt、bridge、receiver、world source 与 smoke 规则。", "Checks ROS packages, xacro, controllers, MoveIt, bridges, receivers, worlds, and smoke rules without launching full simulation.") },
      { tag: "MOCK / FULL", title: l("快速与完整 Smoke", "Fast and full smoke paths"), text: l("CI 默认执行 mock smoke 获取快速反馈；手动与定时流程覆盖 Gazebo、MoveIt、传感器和工业 case 的 full smoke。", "CI defaults to mock smoke for fast feedback, while manual and scheduled flows cover Gazebo, MoveIt, sensors, and industrial cases in full mode.") },
      { tag: "RUN ARTIFACTS", title: l("可交付验收产物", "Deliverable acceptance artifacts"), text: l("每次 run_case 保存 effective case/profile、manifest、metrics、validation metrics、Markdown/HTML 报告、日志和可选 rosbag，失败时也尽量保留证据。", "Each run preserves effective configs, manifests, metrics, Markdown/HTML reports, logs, and optional rosbags, including evidence on failure.") },
    ],
    outcomes: [
      { label: l("机器人配置", "Robot profiles"), value: "3", note: l("Panda、FANUC 与工业工作站", "Panda, FANUC, and industrial cell") },
      { label: l("验证范围", "Validation scope"), value: "E2E", note: l("模型、控制、规划、传感器与任务", "Model, control, planning, sensors, tasks") },
      { label: l("内置用例", "Built-in cases"), value: "9", note: l("运动、传感、分拣与焊接任务", "Motion, sensing, sorting, and welding") },
      { label: l("任务方向", "Task focus"), value: "INDUSTRIAL", note: l("焊接预定位与输送线分拣", "Welding pre-positioning and conveyor sorting") },
    ],
    value: [l("能够组织 ROS 2、Gazebo、MoveIt 2 与 ros2_control 的复杂工作空间", "Organized a complex ROS 2, Gazebo, MoveIt 2, and ros2_control workspace"), l("能够把仿真场景设计为可重复执行的系统验收 Case", "Designed simulation scenarios as repeatable system acceptance cases"), l("同时覆盖协作机器人与工业机械臂，体现平台化设计能力", "Covered collaborative and industrial arms through a reusable platform design"), l("具备用仿真提前验证真实机器人集成风险的工程意识", "Used simulation to reduce real-robot integration risk before deployment")],
  },
  {
    slug: "mascotmate",
    index: "05",
    title: "MascotMate",
    subtitle: l("跨平台桌面宠物与互动产品", "Cross-platform interactive desktop companion"),
    category: l("跨平台产品", "SIDE PROJECT · PRODUCT"),
    year: "2025 — 2026",
    image: "/images/projects/3041149f-a6cf-4b66-aefa-e2e29be65b78.png",
    imageNote: l("桌面互动产品角色示意", "Desktop companion product visual"),
    overviewImage: { src: "/images/projects/蜡笔小新.png", alt: "MascotMate 桌面宠物角色示意图" },
    repo: "https://github.com/MzKyle/MascotMate",
    role: l("产品设计 / 客户端开发", "Product design / desktop client development"),
    status: l("跨平台桌面产品", "Cross-platform desktop product"),
    summary: l("一个具备多种互动模式、皮肤系统和跨平台适配能力的桌面宠物，用来探索桌面交互与产品化开发。", "A desktop companion with multiple interaction modes, a skin system, and cross-platform behavior, built as a product-focused side project."),
    intro: l("MascotMate 围绕透明窗口、桌面事件、角色状态和皮肤资源构建长期可用的桌面陪伴体验，集中体现客户端工程、交互设计和跨平台适配能力。", "MascotMate builds a lasting desktop companion around transparent windows, desktop events, character state, and skin assets, demonstrating client engineering and cross-platform product design."),
    challenge: l("桌面宠物需要处理透明窗口、拖拽、点击穿透、屏幕边界、多显示器与不同系统行为差异，还要让动作、状态和皮肤资源保持清晰可扩展。", "A desktop companion must handle transparent windows, dragging, click-through behavior, screen boundaries, multiple monitors, and OS differences while keeping state and assets extensible."),
    contribution: [
      l("独立完成产品定位、交互设计、Godot 客户端架构与持续迭代。", "Owned product direction, interaction design, Godot client architecture, and continued iteration."),
      l("实现透明置顶窗口、像素级点击区域、拖拽/甩飞物理和贴边偷看状态机。", "Implemented transparent always-on-top windows, visible-pixel input, drag/fling physics, and edge-peeking states."),
      l("设计皮肤包规范 v2、能力映射、Fallback 与 Shimeji-ee 导入工具，建立可扩展内容体系。", "Designed skin package v2, capability mapping, fallbacks, and Shimeji-ee import tooling for extensible content."),
      l("打通截图贴图、全局快捷键、本地辅助服务和三平台打包发布。", "Delivered screenshot pins, global hotkeys, local helper services, and packaging across three desktop platforms."),
    ],
    tech: ["Godot 4", "GDScript", "Python", "State Machine", "Skin SDK v2", "Cross-platform Desktop", "GitHub Actions"],
    flow: [l("启动与加载资源", "Start and load assets"), l("角色状态调度", "Schedule character state"), l("桌面事件感知", "Observe desktop events"), l("互动动作反馈", "Respond with interactions"), l("皮肤与模式切换", "Switch skins and modes"), l("跨平台适配", "Adapt across platforms")],
    modules: [
      { code: "MAIN RUNTIME", title: l("窗口与交互编排", "Window and interaction orchestration"), text: l("Main.gd 统一配置窗口、右键菜单、动画、气泡、尺寸和模式切换，通过 Godot signal 协调输入、物理、行为、轻互动与贴图模块。", "Main.gd coordinates window settings, menus, animation, bubbles, sizing, and modes through Godot signals across input, physics, behavior, mini-games, and pins.") },
      { code: "PHYSICS + INPUT", title: l("窗口即物理对象", "The window as a physical object"), text: l("PetPhysics 直接推进窗口坐标；InteractionController 区分单击、双击、长按与拖拽，释放速度决定甩飞或轻放，角色可落地、反弹、吸附和贴边移动。", "PetPhysics advances the actual window position; InteractionController distinguishes click, double-click, hold, and drag, with release velocity driving fling or gentle drop, landing, bounce, attach, and edge motion.") },
      { code: "BEHAVIOR BRAIN", title: l("低打扰陪伴决策", "Low-interruption companion decisions"), text: l("安静、活泼、捣乱三种模式结合时间段、心情、饥饿、体力、亲密度与互动记忆做规则决策，并在忙碌、冷却与休息边界内调度动作。", "Quiet, active, and mischief modes combine time, mood, hunger, energy, affection, and memory while respecting busy state, cooldowns, and rest boundaries.") },
      { code: "SKIN SDK V2", title: l("能力驱动的皮肤系统", "Capability-driven skin system"), text: l("skin.json 以 resting、locomotion、falling、held、edge 等能力映射动作候选，支持方向、逐帧时长、锚点、非透明区域、镜像和无环 fallback。", "skin.json maps resting, locomotion, falling, held, edge, and other capabilities to actions with direction, durations, anchors, used rects, mirroring, and acyclic fallbacks.") },
      { code: "SHIMEJI IMPORT", title: l("外部内容转换工具", "External content conversion"), text: l("Python 导入器解析 actions.xml、behaviors.xml 与图片集，生成 v2 皮肤、能力覆盖、镜像动作和兼容性报告，让第三方资源进入统一 Runtime。", "A Python importer parses actions.xml, behaviors.xml, and image sets into v2 skins, capability coverage, mirrored actions, and compatibility reports for one runtime.") },
      { code: "SCREENSHOT PINS", title: l("截图、贴图与快捷键", "Capture, pin, and hotkey tooling"), text: l("F1/F3/F4 完成区域截图、历史轮换和关闭；跨平台 helper 处理全局热键与图片剪贴板，每张贴图使用独立透明置顶 Window 并支持拖动。", "F1/F3/F4 capture regions, rotate recent history, and close pins; a cross-platform helper handles global hotkeys and image clipboard, while each pin is its own draggable transparent top-level window.") },
    ],
    decisions: [
      { title: l("状态驱动动画", "State-driven animation"), text: l("把待机、移动、拖拽和互动行为组织为明确状态，减少动作切换时的冲突和不可预测行为。", "Idle, movement, drag, and interaction behaviors are modeled as explicit states to avoid conflicting transitions.") },
      { title: l("资源与逻辑分离", "Assets separated from logic"), text: l("皮肤和动作资源独立管理，使新增角色不需要重写桌面交互逻辑。", "Skin and motion assets are managed independently so new characters do not require rewriting desktop interaction logic.") },
      { title: l("克制的桌面存在感", "A restrained desktop presence"), text: l("默认行为尽量不抢焦点、不遮挡工作，通过可配置互动模式平衡陪伴感和生产力。", "Default behavior avoids stealing focus or blocking work; configurable modes balance companionship and productivity.") },
    ],
    engineering: [
      { title: l("可见区域参与碰撞与输入", "Visible pixels drive collision and input"), text: l("每帧 PNG 的 used_rect 经过旋转计算真实接触矩形，同时用于屏幕边界与 mouse_passthrough_polygon，减少透明留白造成的假碰撞和整窗挡鼠标。", "Per-frame used rects generate rotated contact bounds and mouse passthrough polygons, preventing transparent padding from causing false collision or blocking the desktop.") },
      { title: l("状态冲突有明确边界", "Explicit boundaries prevent state conflicts"), text: l("Idle、Grabbed、Flinging、Falling、Landing、Walk、WallAttached、EdgeWalk、Peeking 构成位置状态机；行为请求必须通过忙碌判断，避免交互互相覆盖。", "Idle, Grabbed, Flinging, Falling, Landing, Walk, WallAttached, EdgeWalk, and Peeking form the motion state machine; behavior requests pass busy-state checks to prevent overlap.") },
      { title: l("本地配置与记忆持久化", "Local configuration and memory"), text: l("ConfigStore 保存尺寸、重力、皮肤、快捷键与文案语气，StateStore 维护四项状态和互动记忆；短 debounce 与退出 flush 控制写盘。", "ConfigStore persists size, gravity, skin, shortcuts, and tone, while StateStore tracks four core values and interaction memory with debounced writes and exit flush.") },
      { title: l("平台能力安全降级", "Safe platform fallbacks"), text: l("透明窗口异常可切换 safe window；Wayland 下全局热键降级为应用内快捷键；Linux 图片剪贴板按 wl-copy、xclip 等能力选择后端。", "Safe-window mode handles transparency issues, Wayland falls back to in-app shortcuts, and Linux image clipboard selects available backends such as wl-copy or xclip.") },
    ],
    validation: [
      { tag: "RUNTIME SMOKE", title: l("Godot 无头运行验收", "Godot headless runtime smoke"), text: l("发布前执行 headless runtime smoke，检查场景、脚本、状态流与关键资源在打包环境中可加载。", "Headless runtime smoke checks scenes, scripts, state flow, and critical assets in the packaging environment.") },
      { tag: "ASSET VALIDATION", title: l("资源与清单一致性", "Asset and manifest integrity"), text: l("校验动作非空、帧路径安全、PNG 可读、默认皮肤能力引用有效，并检查资源目录不存在未被清单引用的帧。", "Validation checks non-empty actions, safe frame paths, readable PNGs, valid capability references, and no unreferenced frames.") },
      { tag: "SKIN CORPUS", title: l("皮肤兼容报告", "Skin compatibility reports"), text: l("导入器输出动作/帧数量、能力覆盖、缺失能力、镜像、失败帧、警告与兼容分数；外置 Shimeji 语料可批量回归。", "Imports report action/frame counts, capability coverage, missing capabilities, mirrors, failed frames, warnings, and scores, with external Shimeji corpora for regression.") },
      { tag: "3 PLATFORM", title: l("跨平台打包清单", "Three-platform release checklist"), text: l("GitHub Actions 为 Linux、Windows 与 macOS 构建 portable zip，并在打包前运行 Python 校验和 Godot smoke；安装后再验收透明窗口、互动、贴边、快捷键和贴图。", "GitHub Actions builds Linux, Windows, and macOS portable zips after Python validation and Godot smoke, followed by install-time checks for transparency, interactions, edges, hotkeys, and pins.") },
    ],
    outcomes: [
      { label: l("物理状态", "Physics states"), value: "9", note: l("拖拽、甩飞、落地、行走与偷看", "Drag, fling, land, walk, and peek") },
      { label: l("行为模式", "Behavior modes"), value: "3", note: l("安静、活泼与捣乱", "Quiet, active, and mischief") },
      { label: l("皮肤接口", "Skin interface"), value: "V2", note: l("能力映射、Fallback 与导入报告", "Capabilities, fallbacks, and import reports") },
      { label: l("发布平台", "Release platforms"), value: "3 OS", note: l("Linux、Windows 与 macOS", "Linux, Windows, and macOS") },
    ],
    value: [l("具备从交互构思、状态设计到桌面客户端实现的端到端产品能力", "Delivered the product end to end from interaction concept to desktop implementation"), l("能够处理透明窗口、点击穿透、多显示器和高 DPI 等系统级细节", "Handled system-level details including transparency, click-through input, multiple displays, and high DPI"), l("通过资源与逻辑分离建立可扩展的皮肤和动作体系", "Built an extensible skin and motion system by separating assets from logic"), l("展示机器人项目之外的产品意识、审美和主动创造能力", "Demonstrated product judgment and initiative beyond robotics projects")],
  },
];

const sanyCase: ProjectDetail = {
  slug: "sany-welding-robotics",
  index: "01",
  title: "SANY Industrial Welding Robotics",
  subtitle: l("工业焊接机器人实时感知、时序协同与摆弧焊视觉系统", "Real-time perception, timing, and weave welding vision system"),
  category: l("工业机器人系统工程", "INDUSTRIAL WELDING ROBOTICS"),
  year: "2026.03 — 2026.08",
  imageNote: l("企业项目未公开实拍图，页面使用系统架构示意", "No internal imagery is published; the page uses a system schematic"),
  homeImage: "/images/robot-workstation-hero.png",
  homeImageMode: "cover",
  homeImagePosition: "center",
  homeDescription: l("在约 60 Hz 机器人状态与最高约 200 Hz RAW 相机的约束下，以相位估计、RAW 历史窗口、ISP 后处理和共同时间轴重构摆弧焊视觉链路。", "Redesigned weave welding vision around phase estimation, RAW history, post-selection ISP, and a common timeline under roughly 60 Hz robot state and up to 200 Hz RAW capture."),
  homeTech: ["C++", "ROS 2", "RAW Buffer", "Phase-aware Vision"],
  homeEvidence: [
    { value: "≈60 Hz", label: l("机器人状态", "ROBOT STATE") },
    { value: "200 Hz", label: l("RAW 采样设计目标", "RAW SAMPLING TARGET") },
    { value: "PHASE", label: l("同相位视觉选帧", "PHASE-AWARE VISION") },
  ],
  role: l("算法工程师 / 摆弧焊视觉架构与焊前定位模块", "Algorithm engineer / weave vision architecture and pre-weld positioning"),
  status: l("公开版工程案例 / 已脱敏", "Public engineering case / sanitized"),
  summary: l("面对约 60 Hz 机器人状态与最高约 200 Hz RAW 相机的采样失配，我将摆弧焊视觉问题从逐帧 TCP 补偿重定义为关键相位时间估计与真实 RAW 选帧，并设计相应的 Buffer、ISP 和跨设备时序链路。", "Faced with roughly 60 Hz robot state and up to 200 Hz RAW capture, I reframed weave vision from per-frame TCP compensation to key-phase timing and real RAW frame selection, then designed the buffer, ISP, and cross-device timing path."),
  intro: l("项目包含焊前 3D 点云定位与摆弧焊视觉纠偏两条真实工作线。本案例重点展示后者：在受限机器人状态频率、高吞吐 RAW 数据与异步设备时钟下，如何重新设计感知链路；焊前定位作为相关模块保留。", "The project includes both pre-weld 3D point-cloud positioning and weave welding vision. This case focuses on redesigning the latter under limited robot-state rate, high-throughput RAW data, and asynchronous device clocks, while retaining pre-weld work as a related module."),
  challenge: l("机器人状态约 60 Hz，相机 RAW 可达约 120–200 Hz。低频真实状态不足以重建每帧高频 TCP；采集、后 ISP、Buffer 生命周期与设备计数必须在共同时间轴上配合。", "Robot state was about 60 Hz while RAW camera sampling could reach roughly 120–200 Hz. Real state was too sparse for a high-rate TCP value per frame; capture, post-selection ISP, buffer lifetime, and device counters had to work on a common timeline."),
  contribution: [
    l("在约 60 Hz 机器人状态限制下，提出以运动先验估计关键摆弧相位时间，并从高频 RAW 历史中选择真实同相位帧。", "Under roughly 60 Hz robot state, designed key weave-phase timing from motion priors and selected a real same-phase frame from high-rate RAW history."),
    l("设计多 Chunk + Ring Buffer 的生产者 / 消费者生命周期、约 200–250 ms 历史窗口与约 64 帧物理容量，解耦采集和处理。", "Designed producer/consumer lifetime for a multi-chunk ring buffer, roughly 200–250 ms of history, and about 64 frames of physical capacity to decouple capture and processing."),
    l("将完整 ISP 移到相位选帧之后，并优化 SDK Buffer 到算法模块的数据路径，减少不必要复制。", "Moved full ISP after phase selection and optimized the SDK-buffer-to-compute data path to avoid unnecessary copies."),
    l("将相机与机器人的设备计数映射到共同软件时间轴，在运行中通过周期性重同步处理时钟漂移。", "Mapped camera and robot counters to a common software timeline and handled long-run clock drift through periodic resynchronization."),
    l("参与焊前定位：结合预存工件 3D 点云、机器人 TCP 位姿与实时观测进行空间配准，输出高度纠偏。", "Contributed to pre-weld positioning: registered stored workpiece point clouds, TCP poses, and live observations to derive height correction."),
  ],
  tech: ["C++", "ROS 2", "High-rate RAW", "Multi-Chunk Ring Buffer", "Phase Estimation", "Timing Alignment", "Post ISP", "3D Vision"],
  flow: [l("约 60 Hz 机器人状态", "≈60 Hz robot state"), l("摆弧相位时间估计", "Weave-phase timing"), l("最高约 200 Hz RAW 历史", "Up to 200 Hz RAW history"), l("同相位关键帧", "Same-phase key frame"), l("ISP / 协作几何求解", "ISP / collaborative geometry"), l("机器人纠偏", "Robot correction")],
  modules: [
    { code: "PHASE", title: l("相位感知架构", "Phase-aware architecture"), text: l("将逐帧 TCP 重建降维为关键相位时间估计，以真实 RAW 时间采样代替空间域逐帧补偿。", "Reduces per-frame TCP reconstruction to key-phase timing and uses real RAW time samples instead of per-frame spatial compensation.") },
    { code: "RAW BUFFER", title: l("多 Chunk 环形历史", "Multi-chunk ring history"), text: l("以 WRITING、FROZEN、READING、FREE 生命周期协调采集和处理，保留约 200–250 ms 历史窗口。", "Coordinates capture and processing through WRITING, FROZEN, READING, and FREE lifetimes while retaining roughly 200–250 ms of history.") },
    { code: "TIMING", title: l("共同软件时间轴", "Common software timeline"), text: l("启动时建立相机和机器人计数映射，运行期间周期性重同步以处理时钟漂移。", "Maps camera and robot counters at startup and periodically resynchronizes to handle drift during operation.") },
    { code: "PRE-WELD", title: l("焊前点云定位", "Pre-weld point-cloud positioning"), text: l("相关模块：将预存工件点云、TCP 位姿与实时观测关联，完成空间配准与高度纠偏。", "Related module: connects stored workpiece point clouds, TCP poses, and live observations for registration and height correction.") },
  ],
  decisions: [
    { title: l("从全轨迹转向事件时间", "From full trajectory to event time"), text: l("约 60 Hz 的真实状态不足以重建完整高频 TCP；用周期摆弧先验估计 t_phase，再查找最接近的真实 RAW 帧。", "Roughly 60 Hz real state is insufficient for a full high-rate TCP path. Estimate t_phase from the periodic weave prior and find the nearest real RAW frame.") },
    { title: l("先采集，再选帧，最后处理", "Capture, select, then process"), text: l("让高频 RAW 进入固定容量历史窗口，只有关键帧进入完整 ISP 和下游几何求解。", "Keep high-rate RAW in bounded history; only selected frames proceed to full ISP and downstream geometry.") },
    { title: l("明确 Buffer 所有权", "Make buffer ownership explicit"), text: l("生产者写入完整帧、封存 chunk，消费者读取后释放，避免处理线程阻塞采集线程。", "The producer writes complete frames and freezes chunks; the consumer reads and releases them without blocking capture.") },
    { title: l("维护跨设备时间映射", "Maintain cross-device time mapping"), text: l("以设备计数映射共同软件时间轴，区别采集时刻与回调时刻，并在空闲窗口重新同步以抑制漂移。", "Map device counters to a common software timeline, distinguish capture from callback time, and resynchronize in idle windows to limit drift.") },
  ],
  engineering: [
    { title: l("相位时间", "Phase time"), text: l("以慢变焊缝跟随与周期摆弧的局部运动拆解估计关键相位时间；不声称恢复完整高频轨迹。", "Estimates a key phase time from slow seam following and periodic weave motion, without claiming a full high-rate trajectory.") },
    { title: l("Buffer 生命周期", "Buffer lifetime"), text: l("在 SDK Buffer、共享内存及计算模块之间明确数据所有权、完整帧移交和释放时机，减少隐式复制与悬空引用风险。", "Makes ownership, complete-frame handoff, and release explicit across SDK buffers, shared memory, and compute to reduce hidden copies and dangling-reference risk.") },
    { title: l("设备时钟", "Device clocks"), text: l("相机与机器人计数映射到共同时间轴，定期更新映射，避免一次性 offset 校正后漂移积累。", "Maps camera and robot counters to a common timeline and refreshes the mapping to avoid drift after one-time offset correction.") },
    { title: l("下游集成", "Downstream integration"), text: l("选中的 RAW 帧经 ISP、协作的 2D / 3D 几何求解、clipping 与 EMA，进入机器人纠偏。", "The selected RAW frame passes through ISP, collaborative 2D / 3D geometry, clipping, and EMA before robot correction.") },
  ],
  validation: [
    { tag: "SAMPLING", title: l("采样约束", "Sampling constraint"), text: l("约 60 Hz 机器人状态与约 120–200 Hz RAW 相机形成时间分辨率失配；200 Hz 为 RAW 设计目标。", "Roughly 60 Hz robot state and approximately 120–200 Hz RAW camera sampling create a resolution mismatch; 200 Hz is the RAW design target.") },
    { tag: "TIMING", title: l("设备时间轴", "Device timeline"), text: l("以设备计数、启动映射与周期性重同步核对跨设备时间关系；公开层面只描述毫秒级对齐，不提供额外精度 benchmark。", "Device counters, startup mapping, and periodic resynchronization support cross-device alignment. The public case describes millisecond-level timing without an additional precision benchmark.") },
    { tag: "PRE-WELD", title: l("焊前定位结果", "Pre-weld positioning result"), text: l("公开的 ±0.5 mm 仅属于焊前定位，不代表摆弧焊相位选帧的准确度。", "The public ±0.5 mm result belongs only to pre-weld positioning, not weave-phase frame-selection accuracy.") },
  ],
  outcomes: [
    { label: l("机器人状态", "Robot state"), value: "≈60 Hz", note: l("摆弧焊视觉的输入约束", "Weave vision input constraint") },
    { label: l("RAW 采样", "RAW sampling"), value: "200 Hz", note: l("相机侧设计目标，非视频输出帧率", "Camera-side design target, not video output rate") },
    { label: l("历史窗口", "History window"), value: "200–250 ms", note: l("多 Chunk / Ring Buffer 设计", "Multi-chunk ring buffer design") },
    { label: l("跨设备时序", "Cross-device timing"), value: "ms-level", note: l("软件共同时间轴", "Software common timeline") },
  ],
  value: [l("受采样约束驱动的感知架构重构", "Perception redesign driven by sampling constraints"), l("高吞吐 RAW、Buffer 生命周期与时序对齐", "High-throughput RAW, buffer lifetime, and timing alignment"), l("焊前 3D 定位与机器人系统集成", "Pre-weld 3D positioning and robot integration")],
  kind: "flagship",
  accent: "timing",
  ownership: [
    { label: l("摆弧焊相位感知系统架构", "Phase-aware weave perception architecture"), type: "mine" },
    { label: l("关键相位时间与 RAW 选帧", "Key-phase timing and RAW selection"), type: "mine" },
    { label: l("多 Chunk / Ring Buffer 与帧生命周期", "Multi-chunk ring buffer and frame lifetime"), type: "mine" },
    { label: l("ISP 后处理与数据链路", "Post-selection ISP and data path"), type: "mine" },
    { label: l("共同时间轴与时钟漂移处理", "Common timeline and clock-drift handling"), type: "mine" },
    { label: l("2D 特征、极线 / 极射线与具体 3D Solver", "2D features, epipolar / polar-ray geometry, and detailed 3D solver"), type: "collaboration" },
    { label: l("Industrial Robot / Robot Controller", "Industrial Robot / Robot Controller"), type: "existing" },
    { label: l("3D Camera / Weld-pool Camera", "3D Camera / Weld-pool Camera"), type: "existing" },
  ],
  problems: [
    { title: l("机器人状态只有约 60 Hz", "Robot state only about 60 Hz"), constraint: l("低频观测无法提供逐帧高频 TCP 真值", "Sparse observations cannot provide high-rate TCP truth per frame"), decision: l("以运动先验估计关键相位事件时间", "Estimate key phase-event time using motion priors") },
    { title: l("ISP 限制高频采样", "ISP limits high-rate sampling"), constraint: l("每帧立即 ISP 会占据采集关键路径", "Immediate ISP for every frame occupies the acquisition path"), decision: l("RAW 先进入历史窗口，选帧后 ISP", "Buffer RAW first, run ISP after selection") },
    { title: l("生产者与消费者延迟不匹配", "Producer/consumer timing mismatch"), constraint: l("简单 Buffer 难以吸收处理 jitter", "A simple buffer cannot absorb processing jitter"), decision: l("多 Chunk 环形历史与显式所有权", "Multi-chunk ring history and explicit ownership") },
    { title: l("独立时钟与长期漂移", "Independent clocks and long-run drift"), constraint: l("启动 offset 校正不能抵消设备频率差", "Startup offset correction cannot remove clock-rate mismatch"), decision: l("共同软件时间轴与周期性重同步", "Common software timeline and periodic resynchronization") },
  ],
  deepDive: [
    { title: l("为什么不从 60 Hz 重建完整 TCP？", "Why not reconstruct full TCP from 60 Hz?"), text: l("插值与滤波不能创建未观测到的高频状态；已知摆弧周期先验只用于估计关键相位时间。", "Interpolation and filtering cannot create unobserved high-rate state; the known periodic weave prior is used only to estimate key-phase time.") },
    { title: l("Buffer 如何在高频采集中移交帧？", "How are frames handed off during high-rate capture?"), text: l("多 Chunk / Ring Buffer 将 WRITING、FROZEN、READING 和 FREE 状态显式化，避免消费线程阻塞采集线程。", "A multi-chunk ring buffer makes WRITING, FROZEN, READING, and FREE explicit so processing does not block capture.") },
    { title: l("跨设备时间轴如何保持有效？", "How does the cross-device timeline stay valid?"), text: l("启动阶段以设备计数建立共同软件时间映射；长时间运行后在空闲窗口重同步，避免时钟频率差造成的累计漂移。", "Device counters establish a common software time mapping at startup; idle-window resynchronization limits accumulated drift from clock-rate mismatch.") },
  ],
  confidentialityNote: l("保密说明：设备统一使用抽象名称；不公开客户、内部代号、IP / 网络拓扑、焊接工艺参数、源码、模型细节及未公开设备参数。", "Confidentiality: devices use abstract names. Client identity, internal codenames, IP/network topology, welding parameters, source code, model details, and unpublished device specifications are omitted."),
};

const volumeCase: ProjectDetail = {
  slug: "3d-volume-measurement",
  index: "04",
  title: "3D Volume Measurement",
  subtitle: l("基于深度相机的物流体积测量系统", "Depth-camera-based logistics volume measurement"),
  category: l("三维视觉与几何", "3D VISION & GEOMETRY"),
  year: "2025.07 — 2025.11",
  imageNote: l("项目实拍图待补充，当前使用算法管线示意", "Project imagery pending; the current page uses an algorithm schematic"),
  homeDescription: l("从深度图滤波、点云与平面估计到几何补偿，解决倾斜物体与超薄物体测量问题。", "From depth filtering and point-cloud geometry to compensation for tilted and ultra-thin objects."),
  homeTech: ["Orbbec", "Depth Image", "OpenCV", "Point Cloud"],
  homeEvidence: [
    { value: "97%+", label: l("体积测量准确率", "VOLUME ACCURACY") },
    { value: "+20%", label: l("后处理效率提升", "POST-PROCESSING") },
  ],
  homeVisualSteps: [l("深度图", "DEPTH"), l("点云", "POINT CLOUD"), l("几何建模", "GEOMETRY")],
  role: l("算法工程师 / 深度处理、几何建模与测量优化", "Algorithm engineer / depth processing, geometry, and measurement optimization"),
  status: l("实习项目 / 公开简历范围", "Internship project / public resume scope"),
  summary: l("从深度图滤波、点云与平面估计到几何补偿，面向倾斜物体和超薄物体构建体积测量链路。", "Built a volume-measurement pipeline from depth filtering and point clouds to plane estimation and geometric compensation for tilted and ultra-thin objects."),
  intro: l("深度相机数据存在空洞、边缘伪影和随距离变化的噪声分布；当物体倾斜或厚度接近深度噪声量级时，直接使用包围盒会放大测量误差。", "Depth-camera data contains holes, edge artifacts, and distance-dependent noise. For tilted or ultra-thin objects, direct bounding-box measurement amplifies error."),
  challenge: l("需要在不依赖单一阈值的情况下稳定处理不同距离和材质，同时用几何模型解释倾斜与超薄物体的测量偏差。", "The pipeline must handle varying distance and materials without one fixed threshold, while using geometry to explain bias for tilted and ultra-thin objects."),
  contribution: [
    l("对比多类深度滤波方法，采用时域滤波，并对上表面使用高权重双边滤波以修复空洞与边缘。", "Evaluated depth filters, selecting temporal filtering and a high-weight bilateral filter on top surfaces to repair holes and edges."),
    l("按深度区间设计分级空间滤波，以不同卷积核改善背景、托盘和物体分割。", "Designed graded spatial filtering with depth-dependent kernels to improve separation of background, pallet, and object."),
    l("使用 RANSAC 拟合空托盘点云基准与物体，并以数学建模完成倾斜缓冲补偿。", "Used RANSAC to fit the empty-pallet point-cloud baseline and object, then modeled tilt-buffer compensation mathematically."),
    l("结合 YOLO / SAM 与 OpenCV 后处理，重构核心算子和数据流，并参与上位机软件与多视角点云融合。", "Combined YOLO/SAM with OpenCV post-processing, refactored core operators and data flow, and contributed to host software and multi-view point-cloud fusion."),
  ],
  tech: ["Orbbec", "Depth Image", "OpenCV", "Point Cloud", "RANSAC", "YOLO / SAM", "C++", "Multi-view Fusion"],
  flow: [l("Depth Camera", "Depth Camera"), l("深度滤波", "Depth filtering"), l("Point Cloud", "Point Cloud"), l("平面估计", "Plane estimation"), l("几何建模与补偿", "Geometry & compensation"), l("Volume", "Volume")],
  modules: [
    { code: "DEPTH FILTER", title: l("时域与分级空间滤波", "Temporal and graded spatial filtering"), text: l("结合时域、双边与距离分级策略处理空洞、随机噪声和边缘伪影。", "Combines temporal, bilateral, and distance-aware filtering for holes, random noise, and edge artifacts.") },
    { code: "POINT CLOUD", title: l("深度到空间几何", "Depth to spatial geometry"), text: l("通过相机模型将有效深度转换为点云，为平面估计和物体几何计算提供统一输入。", "Projects valid depth into a point cloud for plane estimation and object geometry.") },
    { code: "RANSAC", title: l("基准平面估计", "Reference-plane estimation"), text: l("使用 RANSAC 抑制物体与异常深度干扰，得到稳定的测量基准。", "RANSAC suppresses object and depth outliers to recover a stable measurement reference.") },
    { code: "COMPENSATION", title: l("倾斜与超薄补偿", "Tilt and ultra-thin compensation"), text: l("以几何模型处理姿态和厚度带来的系统偏差，而不是单纯扩大经验阈值。", "A geometry model handles pose- and thickness-related bias instead of simply widening empirical thresholds.") },
  ],
  decisions: [
    { title: l("先治理深度质量", "Stabilize depth before geometry"), text: l("先处理空洞、边缘伪影和距离相关噪声，再进入点云与尺寸计算。", "Holes, edge artifacts, and distance-dependent noise are treated before point-cloud measurement.") },
    { title: l("用平面建立测量基准", "Use a plane as the measurement reference"), text: l("RANSAC 平面让高度和体积相对于稳定基准计算，降低相机姿态与背景点干扰。", "A RANSAC plane provides a stable reference for height and volume, reducing pose and background interference.") },
    { title: l("对特殊物体显式补偿", "Model special objects explicitly"), text: l("倾斜和超薄物体采用几何补偿，不把它们隐藏在统一经验系数里。", "Tilted and ultra-thin cases use explicit geometric compensation rather than one hidden empirical factor.") },
  ],
  engineering: [
    { title: l("距离相关滤波", "Distance-aware filtering"), text: l("根据不同工作距离下的噪声分布调整空间处理强度，避免近处过度平滑或远处抑噪不足。", "Spatial filtering strength follows noise at different working distances to avoid over-smoothing nearby data or under-filtering distant data.") },
    { title: l("边缘伪影处理", "Edge-artifact handling"), text: l("对物体边缘的混合深度与空洞单独处理，减少轮廓扩张对长宽高的影响。", "Mixed depth and holes near boundaries are handled separately to reduce contour expansion in dimensions.") },
    { title: l("后处理优化", "Post-processing optimization"), text: l("梳理 OpenCV 后处理步骤与数据访问，使公开简历记录的处理效率提升 20%。", "The OpenCV post-processing path and data access were streamlined for the 20% improvement recorded on the public resume.") },
  ],
  validation: [
    { tag: "TILTED OBJECT", title: l("倾斜物体体积测量", "Tilted-object volume measurement"), text: l("公开简历记录倾斜物体的体积测量准确率达到 97%+。", "The public resume records 97%+ volume-measurement accuracy for tilted objects.") },
    { tag: "THIN OBJECT", title: l("超薄物体", "Ultra-thin objects"), text: l("针对厚度接近深度噪声量级的物体，公开结果为 95%+ 准确率。", "For objects near the depth-noise scale, the public result is 95%+ accuracy.") },
    { tag: "PERFORMANCE", title: l("后处理效率", "Post-processing efficiency"), text: l("OpenCV 后处理效率提升 20%，未增加其他未验证 benchmark。", "OpenCV post-processing improved by 20%; no additional unverified benchmark is claimed.") },
  ],
  outcomes: [
    { label: l("倾斜物体体积准确率", "Tilted-object volume accuracy"), value: "97%+", note: l("公开简历结果", "Public resume result") },
    { label: l("超薄物体准确率", "Ultra-thin accuracy"), value: "95%+", note: l("公开简历结果", "Public resume result") },
    { label: l("后处理效率", "Post-processing"), value: "+20%", note: l("OpenCV 路径优化", "OpenCV path optimization") },
    { label: l("算法路径", "Algorithm path"), value: "3D", note: l("深度图、点云与几何建模", "Depth, point cloud, geometry") },
  ],
  value: [l("真正的三维视觉算法与数学建模经验", "Hands-on 3D vision and mathematical modeling"), l("将深度噪声问题转化为可解释的滤波与几何决策", "Translates depth noise into explainable filtering and geometry decisions")],
  kind: "flagship",
  accent: "geometry",
  ownership: [
    { label: l("Orbbec Depth Camera", "Orbbec Depth Camera"), type: "existing" },
    { label: l("深度图滤波与空洞处理", "Depth filtering & hole handling"), type: "mine" },
    { label: l("点云与 RANSAC 平面", "Point cloud & RANSAC plane"), type: "mine" },
    { label: l("几何模型与特殊物体补偿", "Geometry & special-object compensation"), type: "mine" },
    { label: l("结果展示与数据工具", "Result and data tooling"), type: "collaboration" },
  ],
  problems: [
    { title: l("深度图空洞", "Depth holes"), constraint: l("材质与视角导致无效深度", "Material and view produce invalid depth"), decision: l("时域 + 空间填充并保留有效性边界", "Temporal/spatial filling with validity boundaries") },
    { title: l("边缘伪影", "Edge artifacts"), constraint: l("混合深度会扩大物体轮廓", "Mixed depth expands object contours"), decision: l("边缘感知滤波与轮廓后处理", "Edge-aware filtering and contour post-processing") },
    { title: l("倾斜物体", "Tilted objects"), constraint: l("轴对齐包围盒放大尺寸", "Axis-aligned boxes overestimate dimensions"), decision: l("平面关系与几何补偿", "Plane relationships and geometric compensation") },
    { title: l("超薄物体", "Ultra-thin objects"), constraint: l("厚度接近深度噪声量级", "Thickness approaches depth-noise scale"), decision: l("特殊阈值区间与整体几何判断", "Dedicated range handling and holistic geometry") },
  ],
  deepDive: [
    { title: l("为什么先滤波再点云？", "Why filter before point-cloud conversion?"), text: l("深度域更适合利用像素邻域和时间连续性处理空洞；完成质量控制后再投影，可避免无效深度扩散到三维计算。", "Depth space preserves pixel neighborhoods and temporal continuity for hole handling; projecting after quality control prevents invalid depth from spreading into 3D geometry.") },
    { title: l("RANSAC 平面如何参与体积计算？", "How does the RANSAC plane support volume?"), text: l("平面提供背景与高度基准，物体点相对该基准形成高度分布，再进入尺寸、补偿与体积模型。", "The plane provides background and height reference; object points form a relative height distribution for dimensions, compensation, and volume.") },
    { title: l("为什么超薄物体需要单独策略？", "Why do ultra-thin objects need a separate strategy?"), text: l("当厚度与传感器噪声处于同一量级，单点高度不可靠，需要联合平面、区域连续性和整体几何判断。", "When thickness and sensor noise share a scale, single-point height is unreliable; the decision combines the plane, regional continuity, and holistic geometry.") },
  ],
};

const waterbagBase = existingProjects.find((project) => project.slug === "waterbag-inspection")!;
const autoAimBase = existingProjects.find((project) => project.slug === "auto-aim")!;

const waterbagCase: ProjectDetail = {
  ...waterbagBase,
  index: "02",
  kind: "flagship",
  accent: "pipeline",
  flow: [l("Industrial Camera", "Industrial Camera"), l("Image Acquisition", "Image Acquisition"), l("ROI / Detection", "ROI / Detection"), l("Fine Classification", "Fine Classification"), l("Bag State Machine", "Bag State Machine"), l("Result Reordering", "Result Reordering"), l("Modbus RTU", "Modbus RTU"), l("Sorting", "Sorting"), l("Persistence / Traceability", "Persistence / Traceability")],
  ownership: [
    { label: l("Industrial Camera / Lighting", "Industrial Camera / Lighting"), type: "existing" },
    { label: l("C++ 采集、状态机与任务调度", "C++ acquisition, state, and scheduling"), type: "mine" },
    { label: l("粗检、ROI 精检与模型部署", "Detection, ROI refinement, and deployment"), type: "collaboration" },
    { label: l("Bag ID / Reorder Buffer", "Bag ID / Reorder Buffer"), type: "mine" },
    { label: l("Modbus RTU / 分拣控制", "Modbus RTU / sorting control"), type: "mine" },
    { label: l("SQLite / JSONL / Dashboard", "SQLite / JSONL / dashboard"), type: "mine" },
  ],
  problems: [
    { title: l("低对比缺陷", "Low-contrast defects"), constraint: l("半透明材料、折痕与反光干扰", "Translucent material, folds, and glare"), decision: l("多光源 Burst + 粗检 / ROI 精检", "Multi-light burst plus full/ROI inspection") },
    { title: l("并发结果乱序", "Out-of-order inference"), constraint: l("模型完成顺序不等于物理袋序", "Completion order differs from physical bag order"), decision: l("Bag ID 状态机 + Reorder Buffer", "Bag-ID state machine plus reorder buffer") },
    { title: l("设备故障边界", "Device failure boundaries"), constraint: l("相机、光源和分拣动作可能超时", "Camera, lighting, and sorting actions may time out"), decision: l("Adapter、ACK、超时、重试与 fail-safe NG", "Adapters, ACKs, timeout, retry, and fail-safe NG") },
    { title: l("生产追溯", "Production traceability"), constraint: l("现场问题需要还原袋级全链路", "Field issues need bag-level reconstruction"), decision: l("JSONL 审计源 + SQLite + Dashboard", "JSONL audit source plus SQLite and dashboard") },
  ],
  deepDive: [
    { title: l("为什么不能只做 YOLO 推理？", "Why is YOLO inference not enough?"), text: l("产线还需要确定的采图、袋级状态、动作确认、物理顺序、失败策略和可追溯记录，模型只是其中一个模块。", "Production also needs deterministic capture, bag state, action acknowledgements, physical ordering, failure policy, and traceability; the model is one module.") },
    { title: l("Reorder Buffer 如何避免误分拣？", "How does the reorder buffer prevent wrong sorting?"), text: l("worker 可以并发完成，但 sorter 只释放下一物理 Bag ID 的结果；缺失或超时进入明确的安全策略。", "Workers may finish concurrently, but the sorter releases only the next physical Bag ID; missing or timed-out results follow an explicit safe policy.") },
    { title: l("如何在无硬件时验证？", "How is the system tested without hardware?"), text: l("Camera / PLC Adapter 保持相同契约，Mock 设备运行完整生产循环并生成与真实路径一致的状态轨迹。", "Camera and PLC adapters preserve the same contract; mocks run the full production loop and emit the same state traces as real paths.") },
  ],
};

const autoAimCase: ProjectDetail = {
  ...autoAimBase,
  index: "03",
  title: "RoboMaster Auto-Aiming",
  kind: "flagship",
  accent: "control",
  flow: [l("Camera", "Camera"), l("Detection", "Detection"), l("PnP", "PnP"), l("State Estimation / EKF", "State Estimation / EKF"), l("Prediction", "Prediction"), l("Coordinate Transform", "Coordinate Transform"), l("Ballistics / Control", "Ballistics / Control"), l("UART / STM32", "UART / STM32"), l("Gimbal", "Gimbal")],
  ownership: [
    { label: l("Industrial Camera / STM32 / Gimbal", "Industrial Camera / STM32 / Gimbal"), type: "existing" },
    { label: l("ROS 2 架构与 Component 边界", "ROS 2 architecture and component boundaries"), type: "mine" },
    { label: l("Detection / PnP", "Detection / PnP"), type: "collaboration" },
    { label: l("EKF、预测与状态机集成", "EKF, prediction, and state integration"), type: "mine" },
    { label: l("坐标变换、弹道与 UART 链路", "Transforms, ballistics, and UART path"), type: "collaboration" },
    { label: l("团队架构与调试流程", "Team architecture and tuning workflow"), type: "mine" },
  ],
  problems: [
    { title: l("实时视觉闭环", "Real-time visual loop"), constraint: l("感知延迟直接进入控制误差", "Perception latency becomes control error"), decision: l("ROS 2 Component 与 intra-process 通信", "ROS 2 components and intra-process communication") },
    { title: l("目标状态估计", "Target state estimation"), constraint: l("旋转、遮挡与短时丢失", "Rotation, occlusion, and temporary loss"), decision: l("多模型 EKF + 带迟滞状态机", "Multi-model EKF plus hysteretic state machine") },
    { title: l("坐标一致性", "Frame consistency"), constraint: l("相机、云台与世界坐标持续变化", "Camera, gimbal, and world frames keep moving"), decision: l("标定、TF 与时间戳统一约束", "Calibration, TF, and timestamp constraints") },
    { title: l("上下位机协同", "Host-controller coordination"), constraint: l("控制命令和姿态反馈必须闭环", "Commands and attitude feedback must close the loop"), decision: l("NUC ↔ STM32 UART 协议边界", "NUC-to-STM32 UART protocol boundary") },
  ],
  deepDive: [
    { title: l("PnP 误差如何传到控制端？", "How does PnP error reach control?"), text: l("位姿误差会经坐标变换、状态估计和弹道预测继续传播，因此标定、时序与观测质量需要在上游验证。", "Pose error propagates through transforms, estimation, and ballistic prediction, so calibration, timing, and observation quality are verified upstream.") },
    { title: l("为什么使用多模型 EKF？", "Why use multiple EKF models?"), text: l("整车中心、单装甲板与特殊目标的运动结构不同，分模型可让状态定义和切换条件更清晰。", "Vehicle center, single armor, and special targets have different motion structures; separate models keep state definitions and switching explicit.") },
    { title: l("如何降低实车调试成本？", "How is robot tuning cost reduced?"), text: l("视频回放、纯仿真和真云台混合模式复用同一接口，先隔离感知与状态估计，再进入完整实车闭环。", "Video replay, simulation, and real-gimbal hybrid modes share interfaces, isolating perception and estimation before the complete robot loop.") },
  ],
};

const personalCases = existingProjects
  .filter((project) => !["waterbag-inspection", "auto-aim"].includes(project.slug))
  .map((project, index): ProjectDetail => ({
    ...project,
    index: String(index + 5).padStart(2, "0"),
    kind: "personal",
    accent: "tooling",
  }));

export const flagshipProjects: ProjectDetail[] = [sanyCase, waterbagCase, autoAimCase, volumeCase];
export const personalProjects: ProjectDetail[] = personalCases;
export const projects: ProjectDetail[] = [...flagshipProjects, ...personalProjects];

export type InterviewTrackKey = "robotics" | "industrial-vision" | "computer-vision" | "general";
export const interviewTracks: Record<InterviewTrackKey, { title: LocalizedText; subtitle: LocalizedText; slugs: string[] }> = {
  robotics: { title: l("机器人软件", "ROBOTICS SOFTWARE"), subtitle: l("C++ / ROS 2 / 机器人系统", "C++ / ROS 2 / ROBOTICS SYSTEMS"), slugs: ["sany-welding-robotics", "auto-aim", "waterbag-inspection", "3d-volume-measurement"] },
  "industrial-vision": { title: l("工业视觉", "INDUSTRIAL VISION"), subtitle: l("工业视觉 / AI 部署 / 工业软件", "INDUSTRIAL VISION / AI DEPLOYMENT / SOFTWARE"), slugs: ["waterbag-inspection", "sany-welding-robotics", "3d-volume-measurement", "auto-aim"] },
  "computer-vision": { title: l("计算机视觉", "COMPUTER VISION"), subtitle: l("视觉算法 / 3D Vision", "VISION ALGORITHMS / 3D VISION"), slugs: ["3d-volume-measurement", "sany-welding-robotics", "auto-aim", "waterbag-inspection"] },
  general: { title: l("综合技术面", "GENERAL"), subtitle: l("系统、视觉与工程交付", "SYSTEMS / VISION / DELIVERY"), slugs: ["sany-welding-robotics", "waterbag-inspection", "auto-aim", "3d-volume-measurement"] },
};

export type Experience = {
  period: string;
  company: LocalizedText;
  role: LocalizedText;
  summary: LocalizedText;
  details: LocalizedText[];
  metrics: LocalizedText[];
  kind: "employment" | "project";
  caseSlug?: string;
};

export const experiences: Experience[] = [
  {
    period: "2026.03 — 2026.08",
    company: l("三一集团 · 三一耘 AI 总院", "SANY Group · SANY Yun AI Institute"),
    role: l("算法工程师 / 工业焊接机器人", "Algorithm Engineer / Industrial Welding Robotics"),
    summary: l("参与工业焊接机器人域控系统开发，负责焊前定位与摆弧焊纠偏相关模块。", "Contributed to an industrial welding robot domain-control system, owning modules for pre-weld positioning and weave correction."),
    details: [l("以软触发协调 3D Camera、Weld-pool Camera 与 Industrial Robot，初始化对齐时间零点并用 count 记录时间偏移，在受限条件下实现毫秒级多设备同步。", "Coordinated a 3D Camera, Weld-pool Camera, and Industrial Robot with software triggers, aligned time zero, and recorded count-based offsets for millisecond-level synchronization under constrained conditions."), l("以 Shared Memory / Zero-copy 路径将设备 SDK Buffer 直接衔接算法计算模块，提高感知模块频率。", "Connected device SDK buffers to compute modules through a shared-memory/zero-copy path to increase perception frequency."), l("结合预存工件 3D 点云、机器人 TCP 位姿与实时观测完成点云配准，一步输出高度纠偏量。", "Registered a stored workpiece point cloud against live observations using robot TCP poses to output height correction in one step."), l("用多 chunk Buffer 缓存高帧率 RAW 图像，在摆弧峰值按平台法选帧；经后 ISP、2D 极线求交和 3D 解算后，以 clipping 与 EMA 稳定结果。", "Buffered high-rate RAW images across multiple chunks, selected weave-peak frames with a plateau method, then applied post-ISP, 2D polar-ray intersection, 3D solving, clipping, and EMA.")],
    metrics: [l("±0.5 mm 焊前定位", "±0.5 mm pre-weld positioning"), l("毫秒级多设备同步", "Millisecond-level device sync"), l("Shared Memory / Zero-copy", "Shared memory / zero-copy"), l("高帧率 RAW 感知链路", "High-rate RAW perception path")],
    kind: "employment",
    caseSlug: "sany-welding-robotics",
  },
  {
    period: "2025.07 — 2025.11",
    company: l("青岛点之云智能科技有限公司", "Qingdao Dianzhiyun Intelligent Technology"),
    role: l("算法工程师 / 物流体积测量", "Algorithm Engineer / Logistics Volume Measurement"),
    summary: l("基于 Orbbec 深度相机研发物流体积测量系统，工作覆盖深度滤波、点云、几何补偿与后处理优化。", "Developed a logistics volume-measurement system with an Orbbec depth camera across depth filtering, point clouds, geometric compensation, and post-processing optimization."),
    details: [l("对比深度滤波方案，采用时域滤波与上表面高权重双边滤波修复空洞和边缘。", "Evaluated depth filters, selecting temporal filtering and high-weight bilateral filtering on top surfaces to repair holes and edges."), l("按深度范围选择卷积核进行分级空间滤波，改善背景、托盘和物体分割。", "Applied graded spatial filtering with depth-dependent kernels to improve background, pallet, and object segmentation."), l("使用 RANSAC 拟合空托盘点云基准与物体，并以数学建模完成倾斜缓冲补偿。", "Used RANSAC to fit the empty-pallet baseline and object, then modeled tilt-buffer compensation mathematically."), l("结合 YOLO / SAM 与 OpenCV 后处理，重构核心算子和数据流，并参与上位机软件与多视角点云融合。", "Combined YOLO/SAM with OpenCV post-processing, refactored core operators and data flow, and contributed to host software and multi-view point-cloud fusion.")],
    metrics: [l("97%+ 倾斜物体体积准确率", "97%+ tilted-object volume accuracy"), l("95%+ 超薄物体准确率", "95%+ ultra-thin accuracy"), l("端到端效率 +20%", "+20% end-to-end efficiency"), l("深度图 / 点云 / 几何建模", "Depth / point cloud / geometry")],
    kind: "employment",
    caseSlug: "3d-volume-measurement",
  },
  {
    period: "2025.02 — 2025.12",
    company: l("工业水样袋检测项目", "Industrial Waterbag Inspection Project"),
    role: l("软件开发工程师 / C++ 视觉后端主控", "Software Engineer / C++ Vision Backend Lead"),
    summary: l("以项目制方式完成低对比度水样袋缺陷检测系统，从相机与 PLC 接入、C++ 实时后端到模型部署、分拣和追溯形成完整闭环。", "Delivered a project-based low-contrast waterbag inspection system spanning camera and PLC integration, a C++ runtime, model deployment, sorting, and traceability."),
    details: [l("独立开发 C++ 视觉后端主控，完成工业相机采集、Modbus RTU、缺陷推理调度与末端分拣控制闭环。", "Independently developed the C++ vision backend controller across camera capture, Modbus RTU, inference scheduling, and sorting."), l("参与多光源频闪 Burst 成像与整图粗检、ROI 亚像素级微缺陷精检链路。", "Contributed to multi-light burst imaging and a full-image coarse pass followed by ROI-level sub-pixel micro-defect refinement."), l("完成 YOLO 训练调优、ONNX 导出、CUDA 部署及 EfficientNet 细分类。", "Trained and tuned YOLO, exported ONNX for CUDA deployment, and implemented EfficientNet fine classification."), l("以 Bag ID 状态机和重排缓冲保证物理袋序，并以 JSONL、SQLite、Flask Dashboard 实现记录查询、原图回放、质量统计与反向追溯。", "Preserved physical bag order with a Bag-ID state machine and reorder buffer, with JSONL, SQLite, and a Flask dashboard for queries, source-image replay, quality statistics, and reverse traceability.")],
    metrics: [l("独立开发 C++ 主控", "Independently built C++ controller"), l("Bag ID 顺序一致性", "Bag ID order integrity"), l("YOLO / ONNX / CUDA", "YOLO / ONNX / CUDA"), l("可反向追溯生产记录", "Reverse-traceable production records")],
    kind: "project",
    caseSlug: "waterbag-inspection",
  },
];

export type WritingTopic = {
  slug: string;
  code: string;
  title: LocalizedText;
  description: LocalizedText;
  keywords: string[];
  articleKeywords: string[];
  columns: { title: LocalizedText; url: string }[];
};

export const writingTopics: WritingTopic[] = [
  {
    slug: "robotics-ros2",
    code: "ROS.01",
    title: l("机器人系统与 ROS 2", "Robotics Systems and ROS 2"),
    description: l("从通信中间件、执行器与 TF，到机器人日志、时间链路和系统异常恢复。", "From middleware, executors, and TF to observability, timing, and system recovery."),
    keywords: ["ROS 2", "DDS", "TF", "System"],
    articleKeywords: ["ROS", "DDS", "RMW", "机器人", "日志", "时间", "通信", "仿真"],
    columns: [
      { title: l("ROS 2", "ROS 2"), url: "https://blog.csdn.net/2301_80079642/category_12885502.html" },
      { title: l("机器人", "Robotics"), url: "https://blog.csdn.net/2301_80079642/category_13000885.html" },
    ],
  },
  {
    slug: "industrial-vision",
    code: "VIS.02",
    title: l("工业相机与机器视觉", "Industrial Cameras and Machine Vision"),
    description: l("覆盖 2D/3D 成像、点云处理、坐标变换、标定、触发与工业检测。", "2D/3D imaging, point clouds, transforms, calibration, triggering, and inspection."),
    keywords: ["Camera", "OpenCV", "PCL", "Calibration"],
    articleKeywords: ["相机", "视觉", "图像", "点云", "标定", "3D", "OpenCV", "SAM", "ISP"],
    columns: [
      { title: l("机器视觉", "Machine Vision"), url: "https://blog.csdn.net/2301_80079642/category_13007162.html" },
      { title: l("计算机视觉", "Computer Vision"), url: "https://blog.csdn.net/2301_80079642/category_12933652.html" },
    ],
  },
  {
    slug: "cpp-systems",
    code: "CPP.03",
    title: l("C++ 工程化与系统编程", "C++ Engineering and Systems Programming"),
    description: l("关注接口边界、内存与零拷贝、测试调试、并发状态和可维护的工程构建。", "Interfaces, memory and zero-copy paths, testing, debugging, concurrency, and maintainable builds."),
    keywords: ["C++", "Memory", "Testing", "Toolchain"],
    articleKeywords: ["C++", "内存", "拷贝", "线程", "并发", "GTest", "GDB", "CMake", "接口"],
    columns: [
      { title: l("C/C++", "C/C++"), url: "https://blog.csdn.net/2301_80079642/category_12949414.html" },
      { title: l("工具链", "Toolchain"), url: "https://blog.csdn.net/2301_80079642/category_12949340.html" },
    ],
  },
  {
    slug: "linux-realtime",
    code: "SYS.04",
    title: l("Linux 实时性与时间同步", "Linux Real-Time and Time Synchronization"),
    description: l("理解 PTP、PHC、Clocksource、硬件时间戳与机器人实时数据链路。", "PTP, PHC, clocksources, hardware timestamps, and real-time robotics data paths."),
    keywords: ["Linux", "PTP", "Realtime", "Timestamp"],
    articleKeywords: ["Linux", "PTP", "PHC", "时间", "实时", "PREEMPT", "Clock", "内核"],
    columns: [
      { title: l("Linux", "Linux"), url: "https://blog.csdn.net/2301_80079642/category_12884447.html" },
      { title: l("操作系统", "Operating Systems"), url: "https://blog.csdn.net/2301_80079642/category_12899541.html" },
    ],
  },
  {
    slug: "robot-geometry",
    code: "GEO.05",
    title: l("机器人几何、标定与控制", "Robot Geometry, Calibration, and Control"),
    description: l("围绕坐标系、手眼与 TCP 标定、运动学、雅可比矩阵和力反馈建立工程数学基础。", "Coordinate frames, hand-eye and TCP calibration, kinematics, Jacobians, and haptics."),
    keywords: ["Geometry", "Calibration", "Kinematics", "Control"],
    articleKeywords: ["标定", "坐标", "TCP", "手眼", "位姿", "雅可比", "运动学", "拟合", "控制", "力反馈"],
    columns: [
      { title: l("机器人", "Robotics"), url: "https://blog.csdn.net/2301_80079642/category_13000885.html" },
      { title: l("工程数学物理原理", "Engineering Mathematics"), url: "https://blog.csdn.net/2301_80079642/category_13076713.html" },
    ],
  },
];

export const capabilities = [
  { code: "SYS.01", title: l("机器人系统集成", "Robotics Systems Integration"), text: l("把相机、原始多传感器数据、算法服务和机器人控制组织为可运行、可诊断的 ROS 2 链路。", "Connect cameras, raw multi-sensor data, algorithm services, and robot control into operational and diagnosable ROS 2 systems."), items: [l("ROS 2 / TF / Component", "ROS 2 / TF / Components"), l("PTP / 多设备时序", "PTP / multi-device timing"), l("Shared Memory / IPC", "Shared memory / IPC"), l("机器人感知与控制", "Robot perception and control")] },
  { code: "VIS.02", title: l("工业视觉与点云", "Industrial Vision and Point Clouds"), text: l("面向真实工业场景处理低对比度图像、深度数据、点云定位与模型推理。", "Solve low-contrast imaging, depth processing, point-cloud localization, and inference in real industrial scenes."), items: [l("OpenCV / PCL", "OpenCV / PCL"), l("RANSAC / 几何建模", "RANSAC / geometry"), l("YOLO / ONNX / CUDA", "YOLO / ONNX / CUDA"), l("2D / 3D 坐标对齐", "2D / 3D alignment")] },
  { code: "ENG.03", title: l("C++ 工程化与 AI 工作流", "C++ Engineering and AI Workflow"), text: l("以 Modern C++ / CMake 构建生产链路，并用 Python 与 AI 开发工作流完成视觉模型、调试和辅助工具。", "Build production paths with Modern C++/CMake and use Python plus AI-assisted workflows for vision models, debugging, and tooling."), items: [l("Modern C++ / STL", "Modern C++ / STL"), l("CMake / Linux", "CMake / Linux"), l("Python / AI 开发工作流", "Python / AI workflow"), l("并发、状态机与工具", "Concurrency, state, and tooling")] },
];

export const honors: LocalizedText[] = [
  l("2024、2025 RoboMaster 全国三等奖", "2024 & 2025 RoboMaster National Third Prize"),
  l("2024、2025 全国大学生机器人竞赛区域赛二等奖", "2024 & 2025 National College Student Robotics Competition Regional Second Prize"),
  l("2024、2025 RoboMaster 高校联盟赛一等奖", "2024 & 2025 RoboMaster University League First Prize"),
  l("2025 RoboMaster 机器人竞技一等奖", "2025 RoboMaster Robot Competition First Prize"),
  l("2025 全国大学生电子设计大赛省级二等奖", "2025 National Electronics Design Contest Provincial Second Prize"),
  l("2024 谐振杯电子设计大赛一等奖", "2024 Resonance Cup Electronics Design Contest First Prize"),
  l("2024 蓝桥杯山东省二等奖", "2024 Lanqiao Cup Shandong Second Prize"),
  l("青岛大学一等奖学金", "Qingdao University First-Class Scholarship"),
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectWithNeighbors(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return undefined;
  return {
    project: projects[index],
    previous: projects[(index - 1 + projects.length) % projects.length],
    next: projects[(index + 1) % projects.length],
  };
}
