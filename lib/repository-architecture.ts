import type { LocalizedText } from "./portfolio";

type Node = { name: string; detail: LocalizedText };
export type RepositoryArchitecture = {
  title: LocalizedText;
  source: string;
  revision: string;
  entryLabel: LocalizedText;
  entries: Node[];
  core: Node;
  modules: string[];
  outputLabel: LocalizedText;
  outputs: Node[];
};

export const repositoryArchitectures: Record<string, RepositoryArchitecture> = {
  "datascope-studio": {
    title: { zh: "多入口，共用一个本地数据核心", en: "Multiple entry points, one local data core" },
    source: "https://github.com/MzKyle/DataScope-Studio/blob/3b3840bd3e7dd66c90bcfdadfb8704158a2fdfac/docs/architecture/README.md",
    revision: "3b3840b",
    entryLabel: { zh: "交互与自动化", en: "Interaction & automation" },
    entries: [
      { name: "Tauri / React → FastAPI", detail: { zh: "桌面交互与本地 HTTP 接口", en: "Desktop UI and local HTTP API" } },
      { name: "datascope CLI", detail: { zh: "脚本与批处理入口", en: "Scripting and batch entry point" } },
    ],
    core: { name: "datascope_core", detail: { zh: "数据识别、映射、转换与查询", en: "Inspect, map, convert and query" } },
    modules: ["Adapters", "Mapping / Templates", "Query Index"],
    outputLabel: { zh: "本地状态与产物", en: "Local state & artifacts" },
    outputs: [
      { name: "SQLite Catalog", detail: { zh: "项目与作业状态", en: "Project and job state" } },
      { name: "Rerun SDK / CLI", detail: { zh: "Recording 与 Viewer", en: "Recording and viewer" } },
      { name: "Workspace Artifacts", detail: { zh: "映射、录制与导出文件", en: "Mappings, recordings and exports" } },
    ],
  },
  "robot-sim": {
    title: { zh: "配置驱动的机器人仿真与验收", en: "Configuration-driven simulation and acceptance" },
    source: "https://github.com/MzKyle/Robot-Sim/blob/a40f8ed894e71fb53229a0a2a04cc8e5fb160904/docs/architecture/README.md",
    revision: "a40f8ed",
    entryLabel: { zh: "配置与启动", en: "Configuration & launch" },
    entries: [
      { name: "Profile / Scene / Case", detail: { zh: "机器人、场景与验收用例", en: "Robot, scene and acceptance case" } },
      { name: "run_case / sim.launch.py", detail: { zh: "用例执行与交互仿真", en: "Case execution and interactive simulation" } },
    ],
    core: { name: "robot_domain", detail: { zh: "机器人模型与启动链路编排", en: "Robot model and runtime orchestration" } },
    modules: ["registry / schema", "Description", "Scenarios"],
    outputLabel: { zh: "运行链路", en: "Runtime integration" },
    outputs: [
      { name: "Gazebo → ros2_control", detail: { zh: "仿真与控制器", en: "Simulation and controllers" } },
      { name: "ros2_control → MoveIt2", detail: { zh: "运动规划与执行", en: "Motion planning and execution" } },
      { name: "Gazebo → Bridge → Sensors", detail: { zh: "传感器数据桥接", en: "Sensor data bridging" } },
    ],
  },
  "mascotmate": {
    title: { zh: "运行时编排、行为与本地状态", en: "Runtime orchestration, behavior and local state" },
    source: "https://github.com/MzKyle/MascotMate/blob/490d72ff5357e167e0ddf05988f1488177c099db/docs/architecture/README.md",
    revision: "490d72f",
    entryLabel: { zh: "互动与行为", en: "Interaction & behavior" },
    entries: [
      { name: "InteractionController", detail: { zh: "点击、长按与甩飞", en: "Click, hold and throw" } },
      { name: "BehaviorBrain", detail: { zh: "行为调度与规则策略", en: "Behavior scheduling and policy" } },
    ],
    core: { name: "Main.gd", detail: { zh: "生命周期、菜单与窗口同步", en: "Lifecycle, menus and window sync" } },
    modules: ["PetPhysics", "PetSprite", "SkinManager"],
    outputLabel: { zh: "状态与桌面工具", en: "State & desktop tools" },
    outputs: [
      { name: "State / Events / Memory", detail: { zh: "本地状态、事件与记忆", en: "Local state, events and memory" } },
      { name: "skin.json / actions.json", detail: { zh: "动作帧与皮肤资源", en: "Animation frames and skin assets" } },
      { name: "ScreenshotPins → helper", detail: { zh: "截图贴图与平台辅助", en: "Screenshot pins and platform helper" } },
    ],
  },
};
