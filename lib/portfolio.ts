export type LocalizedText = { zh: string; en: string };

const l = (zh: string, en: string): LocalizedText => ({ zh, en });

export type ProjectDetail = {
  slug: string;
  index: string;
  title: string;
  subtitle: LocalizedText;
  category: LocalizedText;
  year: string;
  image: string;
  imageNote: LocalizedText;
  imageMode?: "cover" | "contain";
  overviewImage?: { src: string; alt: string };
  repo: string;
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
};

export const projects: ProjectDetail[] = [
  {
    slug: "waterbag-inspection",
    index: "01",
    title: "Waterbag Inspection",
    subtitle: l("工业水样袋视觉缺陷检测系统", "Industrial water-sampling bag visual inspection system"),
    category: l("工业视觉", "INDUSTRIAL VISION"),
    year: "2025.02 — 2025.12",
    image: "/images/projects/缺陷检测装置1.png",
    imageMode: "contain",
    imageNote: l("工业水样袋缺陷检测工位", "Industrial waterbag inspection station"),
    overviewImage: { src: "/images/projects/缺陷检测装置2.png", alt: "工业水样袋缺陷检测装置实拍" },
    repo: "https://github.com/MzKyle/Defect-detection-of-water-sampling-bags",
    role: l("软件开发工程师 / 端到端系统交付", "Software engineer / end-to-end system delivery"),
    status: l("工业项目完整交付", "Complete industrial system delivery"),
    summary: l("面向白色、半透明、低对比度水样袋，构建采图、检测、分拣和追溯一体化工业视觉系统。", "Built an integrated acquisition, inspection, sorting, and traceability system for white, translucent, low-contrast water-sampling bags."),
    intro: l("水样袋通常是白色、半透明、低对比度的，缺陷可能是针孔、毛发、黑点、异物、压痕、折痕、污染或封边异常。单张普通正面光图片很容易遇到两个问题：缺陷太浅看不见，或者折痕和反光太像缺陷。", "Folds, glare, and material texture can hide tiny defects on translucent bags, making single-image inspection unreliable. The system addresses imaging, detection, concurrent scheduling, physical sorting order, and result traceability as one production pipeline."),
    challenge: l("人工做水袋缺陷检测时是在大背光灯下用手调换不同角度来找缺陷，这中多角度观察微小缺陷的能力对受硬件限制只能平放检测的机器来说是个很大的挑战", "Inference results must stay aligned with the physical Bag ID, both sides, and every lighting condition. Even when concurrent inference finishes out of order, the PLC must never sort the wrong bag."),
    contribution: [
      l("主导 C++17 产线后端的模块边界、袋级状态机与多线程调度设计。", "Led the C++17 production backend architecture, bag-level state machine, and multithreaded scheduling."),
      l("完成工业相机、PLC、硬触发时序及分拣执行的端到端接入。", "Integrated industrial cameras, PLC control, hardware-trigger timing, and physical sorting end to end."),
      l("组织两阶段模型训练、ONNX 导出与 C++ Runtime 部署，使算法进入稳定生产链路。", "Connected two-stage model training and ONNX export to a stable C++ runtime deployment."),
      l("建立 Mock 测试、JSONL 审计、SQLite 同步与 Dashboard 追溯体系。", "Built mock testing, JSONL audit records, SQLite synchronization, and dashboard traceability."),
    ],
    tech: ["C++17", "YOLO", "ONNX Runtime", "PLC", "SQLite", "JSONL", "Flask", "Mock Hardware"],
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
    repo: "https://github.com/QDU-VRobot/AUTO-Aming-system",
    role: l("算法组组长 / 框架设计 / 核心模块开发", "Vision lead / framework design / core module development"),
    status: l("实车闭环与竞赛验证", "Validated on robots and in competition"),
    summary: l("将工业相机、装甲板识别、PnP、EKF 跟踪、弹道解算和串口控制组织为 ROS 2 实时视觉闭环。", "Integrated industrial cameras, armor detection, PnP, EKF tracking, trajectory solving, and serial control into a ROS 2 real-time vision loop."),
    intro: l("项目面向 RoboMaster 高动态对抗场景，需要在有限算力和强运动干扰下完成稳定识别、状态估计、提前量计算与云台控制。作为算法组组长，我主导 2025 赛季框架设计与 ROS 2 通信链路重构，并负责手眼标定、模块解耦和团队协作规范。", "The system targets RoboMaster's high-dynamic combat environment, where detection, state estimation, lead prediction, and gimbal control must remain stable under motion and compute constraints. As vision lead, I drove the 2025 framework and ROS 2 communication refactor, built the hand-eye calibration workflow, separated core modules, and established team development practices."),
    challenge: l("从相机观测到云台控制的每一步都依赖统一时间、坐标系和目标状态；任何延迟、TF 偏差或串口异常都会直接表现为瞄准抖动和预测误差。", "Every stage from camera observation to gimbal command depends on consistent time, frames, and target state. Latency, TF errors, or serial faults immediately appear as aiming jitter and prediction error."),
    contribution: [
      l("担任算法组组长，主导 2025 赛季框架设计、ROS 2 通信链路重构与模块职责划分。", "Served as vision lead, driving the 2025 architecture, ROS 2 communication refactor, and package boundaries."),
      l("负责装甲板检测、PnP、跟踪与控制链路的集成调试，并推动不同机器人配置复用。", "Integrated and tuned armor detection, PnP, tracking, and control while enabling reuse across robot configurations."),
      l("独立开发手眼标定模块与采样质量检查，将相机安装外参写入 URDF/Xacro 链路。", "Developed the hand-eye calibration module and sample-quality checks, feeding camera extrinsics into the URDF/Xacro chain."),
      l("建立仿真、视频回放、实车调试和可视化工作流，降低完整硬件依赖。", "Established simulation, video replay, robot tuning, and visualization workflows to reduce full-hardware dependency."),
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

export type Experience = {
  period: string;
  company: LocalizedText;
  role: LocalizedText;
  summary: LocalizedText;
  details: LocalizedText[];
  metrics: LocalizedText[];
  kind: "employment" | "project";
};

export const experiences: Experience[] = [
  {
    period: "2026.03 — PRESENT",
    company: l("三一集团 · 耘创新实验室", "SANY Group · Innovation Lab"),
    role: l("算法工程师 / 工业焊接机器人", "Algorithm Engineer / Industrial Welding Robotics"),
    summary: l("参与工业级焊接机器人域控系统，负责焊缝粗定位、快速纠偏停止、多源数据记录与模型部署优化。", "Contributing to an industrial welding robot domain-control system across seam pre-positioning, fast correction and stopping, multimodal recording, and model deployment optimization."),
    details: [l("设计“轮询下探 + 3D 激光线扫”两级定位策略，结合 RANSAC 平面拟合与 OBB 估计工件初始位置。", "Designed a two-stage probe-and-3D-laser-scan positioning strategy using RANSAC plane fitting and OBB estimation."), l("完成 2D/3D 多模态数据时空对齐与坐标转换，接入 SAM2 分割和 X/Z 双维度纠偏流程。", "Implemented spatiotemporal alignment and frame transforms for 2D/3D data, integrating SAM2 segmentation and X/Z correction."), l("开发点云、熔池图像和机械臂姿态的记录、回放、可视化与云端归档链路。", "Built recording, replay, visualization, and cloud archiving for point clouds, weld-pool imagery, and robot poses."), l("参与引弧板定位模型推理优化，在保证精度的情况下实现 40% 以上提速。", "Optimized arc-strike plate inference by over 40% while preserving accuracy.")],
    metrics: [l("±0.5 mm 定位精度", "±0.5 mm positioning"), l("40%+ 推理提速", "40%+ faster inference"), l("2D/3D 多模态数据", "2D/3D multimodal data"), l("全链路记录与回放", "Full-chain record and replay")],
    kind: "employment",
  },
  {
    period: "2025.07 — 2025.11",
    company: l("青岛点之云智能科技有限公司", "Qingdao Dianzhiyun Intelligent Technology"),
    role: l("算法工程师 / 物流体积测量", "Algorithm Engineer / Logistics Volume Measurement"),
    summary: l("基于 Orbbec Gemini 2L 与 Intel RealSense 研发物流体积测量系统，覆盖托盘、超薄件和不规则异形件。", "Developed logistics volume-measurement systems with Orbbec Gemini 2L and Intel RealSense for pallets, ultra-thin items, and irregular objects."),
    details: [l("优化深度图填充、边缘滤波与连通图分割，解决边缘分割模糊问题。", "Improved depth filling, edge filtering, and connected-component segmentation to sharpen object boundaries."), l("设计倾斜缓冲补偿与整体计算方法，提升托盘内倾斜物体和超薄物体测量效果。", "Designed tilt-buffer compensation and holistic measurement methods for tilted and ultra-thin pallet items."), l("开发不规则中大型异形件多视角测量，并将测量精度提升至毫米级。", "Developed multi-view measurement for medium and large irregular objects with millimeter-level accuracy."), l("同步开发 Qt 前端交互、结果展示与数据传输存储功能。", "Built Qt interactions, result visualization, and data transfer and storage features.")],
    metrics: [l("97%+ 托盘测量精度", "97%+ pallet accuracy"), l("95%+ 超薄物体准确率", "95%+ thin-object accuracy"), l("毫米级异形件测量", "Millimeter-level irregular objects"), l("Qt 数据工具", "Qt data tooling")],
    kind: "employment",
  },
  {
    period: "2025.02 — 2025.12",
    company: l("工业水样袋检测项目", "Industrial Waterbag Inspection Project"),
    role: l("项目制软件开发 / 工业视觉系统交付", "Project-based Software Development / Industrial Vision Delivery"),
    summary: l("以项目制方式完成低对比度水样袋缺陷检测系统，从相机与 PLC 接入、C++ 实时后端到模型部署、分拣和追溯形成完整闭环。", "Delivered a project-based low-contrast waterbag inspection system spanning camera and PLC integration, a C++ runtime, model deployment, sorting, and traceability."),
    details: [l("搭建多光源 burst 采图与两阶段检测流程，提升半透明材料微缺陷的可见性与检出稳定性。", "Built multi-light burst capture and two-stage detection to improve micro-defect visibility and stability."), l("设计袋级状态机与 Bag ID 重排序机制，确保并发推理结果按物理顺序驱动 PLC 分拣。", "Designed a bag-level state machine and Bag ID reorder mechanism so concurrent inference drives PLC sorting in physical order."), l("通过相机 / PLC Adapter 与 Mock 硬件建立可替换设备层和无硬件测试链路。", "Created replaceable camera/PLC adapters and mock-hardware test paths."), l("使用 SQLite、JSONL 与 Dashboard 记录完整检测结果，实现生产问题回放与追溯。", "Recorded complete inspection results with SQLite, JSONL, and a dashboard for production replay and traceability.")],
    metrics: [l("采图到分拣闭环", "Capture-to-sort loop"), l("Bag ID 顺序一致性", "Bag ID order integrity"), l("C++17 + ONNX", "C++17 + ONNX"), l("可追溯生产记录", "Traceable production records")],
    kind: "project",
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
  { code: "SYS.01", title: l("机器人系统集成", "Robotics Systems Integration"), text: l("把相机、算法服务和机械臂控制组织为可运行、可恢复的 ROS 2 链路。", "Connect cameras, algorithm services, and robot control into operational and recoverable ROS 2 systems."), items: [l("ROS 2 / TF / Service", "ROS 2 / TF / Services"), l("多传感器接入", "Multi-sensor integration"), l("机械臂运动流程", "Robot motion workflows"), l("现场异常处理", "On-site fault handling")] },
  { code: "VIS.02", title: l("工业视觉与点云", "Industrial Vision and Point Clouds"), text: l("面向真实工业场景处理低对比度图像、深度数据、点云定位与模型推理。", "Solve low-contrast imaging, depth processing, point-cloud localization, and inference in real industrial scenes."), items: [l("OpenCV / PCL", "OpenCV / PCL"), l("RANSAC / OBB", "RANSAC / OBB"), l("SAM2 / YOLO / ONNX", "SAM2 / YOLO / ONNX"), l("2D / 3D 坐标对齐", "2D / 3D alignment")] },
  { code: "ENG.03", title: l("C++ 工程化", "C++ Production Engineering"), text: l("关注实时链路、状态一致性、模块边界以及系统的部署、记录与诊断。", "Engineer real-time paths, state integrity, module boundaries, deployment, recording, and diagnostics."), items: [l("Modern C++ / STL", "Modern C++ / STL"), l("CMake", "CMake"), l("并发与状态机", "Concurrency and state machines"), l("Qt / SQLite / 工具", "Qt / SQLite / tooling")] },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
