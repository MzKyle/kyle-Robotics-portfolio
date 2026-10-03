import { PortfolioImage as Image } from "./portfolio-image";
import { T } from "./localized";

const autoAimSource = "https://github.com/QDU-VRobot/AUTO-Aming-system/blob/0825d3ac9bda5091994b709389569d2b74b2a360/";
const waterbagSource = "https://github.com/MzKyle/Defect-detection-of-water-sampling-bags/blob/cc0fd59729a05cd9bbce098df2f3e15d2411e0b0/";

export function AutoAimEvidence() {
  return <div className="project-evidence autoaim-evidence">
    <figure className="repository-comparison">
      <span className="repository-figure-label">DETECTION / DOCUMENTATION EXAMPLE</span>
      <Image src="/images/evidence/autoaim-result.png" alt="公开仓库文档中的装甲板检测示例" width={1080} height={670} unoptimized sizes="(max-width: 600px) calc(100vw - 40px), 60vw" />
      <figcaption><T zh="公开仓库 armor_detector 文档中的检测示例。" en="Detection example from the public armor_detector documentation." /> <a href={autoAimSource + "src/rm_auto_aim/armor_detector/README.md"} target="_blank" rel="noreferrer"><T zh="查看图源与模块说明" en="Image source and module docs" /> ↗</a></figcaption>
    </figure>
    <div className="repository-modes">
      <a href={autoAimSource + "src/rm_vision/rm_vision_bringup/launch/vision_bringup.launch.py"} target="_blank" rel="noreferrer"><span>LIVE</span><strong><T zh="实车链路" en="Live robot" /></strong><code>vision_bringup.launch.py ↗</code></a>
      <a href={autoAimSource + "src/rm_vision/rm_vision_bringup/launch/sim_bringup.launch.py"} target="_blank" rel="noreferrer"><span>SIMULATION</span><strong><T zh="仿真目标" en="Simulated targets" /></strong><code>sim_bringup.launch.py ↗</code></a>
      <a href={autoAimSource + "src/rm_vision/rm_vision_bringup/launch/video.launch.py"} target="_blank" rel="noreferrer"><span>REPLAY</span><strong><T zh="视频回放" en="Video replay" /></strong><code>video.launch.py ↗</code></a>
    </div>
  </div>;
}

export function WaterbagCodeLinks({ kind }: { kind: "capture" | "order" | "trace" }) {
  const links = {
    capture: [{ name: "BagCaptureAssembler", path: "cpp_backend/detect_orchestrator/include/detect_orchestrator/bag_runtime.hpp" }, { name: "InspectionPipeline", path: "cpp_backend/detect_orchestrator/include/detect_orchestrator/pipeline.hpp" }],
    order: [{ name: "SortReorderBuffer", path: "cpp_backend/detect_orchestrator/src/bag_runtime.cpp" }, { name: "Backend tests", path: "cpp_backend/detect_orchestrator/tests/backend_tests.cpp" }],
    trace: [{ name: "Storage / JSONL", path: "cpp_backend/detect_orchestrator/src/storage.cpp" }, { name: "Dashboard", path: "docs/frontend/README.md" }],
  }[kind];
  return <div className="repository-code-links"><span><T zh="对应代码" en="Source code" /></span>{links.map(link => <a href={waterbagSource + link.path} key={link.name} target="_blank" rel="noreferrer">{link.name} ↗</a>)}</div>;
}

export function VolumeGeometryFigure() {
  return <figure className="volume-geometry-figure">
    <div className="volume-geometry-panels">
      <div><span>01 / REFERENCE</span><svg viewBox="0 0 320 200" fill="none" aria-hidden="true"><path className="geometry-grid" d="m30 139 130-65 130 65-130 65zM62 155l130-65M96 171l130-65M128 187l130-65M63 123l130 65M95 107l130 65M128 90l130 65" /><path className="geometry-plane" d="m45 136 115-57 115 57-115 57z" /><path className="geometry-height" d="M160 160V40m-5 8 5-8 5 8" /><circle cx="118" cy="116" r="3" /><circle cx="142" cy="131" r="3" /><circle cx="198" cy="142" r="3" /><circle cx="184" cy="108" r="3" /></svg><h3><T zh="基准平面" en="Reference plane" /></h3><p>RANSAC · <T zh="高度基准" en="Height reference" /></p></div>
      <div><span>02 / TILT</span><svg viewBox="0 0 320 200" fill="none" aria-hidden="true"><path className="geometry-grid" d="m30 139 130-65 130 65-130 65zM62 155l130-65M96 171l130-65M128 187l130-65M63 123l130 65M95 107l130 65M128 90l130 65" /><path className="geometry-bounds" d="M67 49h182v122H67z" /><path className="geometry-object" d="m80 130 129-66 30 35-129 66zm0 0-8-29 129-66 8 29m-8-29 30 35 8 29" /><path className="geometry-height" d="M110 168h90M114 164a36 36 0 0 1 28-17" /></svg><h3><T zh="倾斜关系" en="Tilt geometry" /></h3><p><T zh="姿态偏差与几何补偿" en="Pose bias and compensation" /></p></div>
      <div><span>03 / THIN OBJECT</span><svg viewBox="0 0 320 200" fill="none" aria-hidden="true"><path className="geometry-grid" d="m30 139 130-65 130 65-130 65zM62 155l130-65M96 171l130-65M128 187l130-65M63 123l130 65M95 107l130 65M128 90l130 65" /><path className="geometry-noise" d="m75 128 85-43 85 43-85 43z" /><path className="geometry-object" d="m75 118 85-43 85 43-85 43zM75 118v10l85 43 85-43v-10M160 161v10" /><path className="geometry-height" d="M263 112v24m-4-24h8m-8 24h8" /></svg><h3><T zh="厚度与噪声" en="Thickness and noise" /></h3><p><T zh="超薄物体的有效性判断" en="Validity for ultra-thin objects" /></p></div>
    </div>
    <figcaption><T zh="点云几何概念示意，用于解释测量基准、倾斜和超薄物体；非实测点云或误差曲线。" en="Conceptual geometry illustrating the reference plane, tilt, and thin objects; not measured point clouds or error curves." /></figcaption>
  </figure>;
}
