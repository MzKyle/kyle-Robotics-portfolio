import { PortfolioImage as Image } from "./portfolio-image";
import Link from "next/link";
import { personalProjects } from "../lib/portfolio";
import { projectMedia } from "../lib/project-media";
import { Localized, T } from "./localized";
import { PreferenceControl } from "./preferences";
import { HomeNavigation } from "./home-navigation";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="portfolio-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={diagonal ? "M5 15 15 5M5 5h10v10" : "M3 10h13M11 5l5 5-5 5"} /></svg>;
}

function SocialIcon({ kind }: { kind: "github" | "email" | "writing" }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {kind === "github" && <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.82c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />}
    {kind === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>}
    {kind === "writing" && <><path d="M4 4h7c2 0 3 1 3 3v14c0-2-1-3-3-3H4zM14 7c0-2 1-3 3-3h3v14h-3c-2 0-3 1-3 3" /><path d="M7 8h4M7 11h4" /></>}
  </svg>;
}

const selectedWork = [
  {
    slug: "sany-welding-robotics", category: "SANY · 2026", image: "/images/projects/welding-vision-concept-v3.webp",
    title: { zh: "焊接机器人系统化的设计开发", en: "Systematic design and development of welding robotics" },
    description: { zh: "在约 60 Hz 机器人状态的约束下，用相位选帧、RAW 环形历史与后置 ISP 重构焊接视觉链路。", en: "Rebuilt welding vision around phase-aware frame selection, RAW history and deferred ISP under a 60 Hz robot-state constraint." },
    result: { zh: "RAW 120 → 200 Hz · 摆弧焊纠偏 ±0.5 mm", en: "RAW 120 → 200 Hz · weave correction ±0.5 mm" },
    tech: ["C++", "ROS 2", "Shared Memory", "Robot Vision"], alt: "AI 生成的通用焊接机器人与视觉传感器示意，非三一项目实拍",
  },
  {
    slug: "waterbag-inspection", category: "INDUSTRIAL VISION · 2025", image: "/images/projects/缺陷检测装置1.png",
    title: { zh: "从微小缺陷，到有序分拣", en: "From subtle defects to ordered sorting" },
    description: { zh: "将双面三光源成像、级联检测和 Bag ID 重排接入 C++ 主控，打通检测、分拣与生产追溯。", en: "A C++ controller connects six-frame imaging, cascaded inspection and Bag-ID reordering with sorting and traceability." },
    result: { zh: "Recall ≈97% · 六帧 / 袋 ≈200 ms", en: "Recall ≈97% · six frames / bag ≈200 ms" },
    tech: ["C++17", "ONNX / CUDA", "Modbus", "SQLite"], alt: "工业水样袋视觉缺陷检测工位",
  },
  {
    slug: "auto-aim", category: "ROBOMASTER · 2024–2025", image: "/images/projects/Robomaster封面.png",
    title: { zh: "让视觉与控制形成闭环", en: "Closing the loop between vision and control" },
    description: { zh: "主导自瞄系统架构迭代，将采集、检测、跟踪、串口和可视化组件化，推进 EKF 预测与标定工具。", en: "Led auto-aim architecture, componentizing capture, detection, tracking, serial I/O and visualization, with EKF prediction and calibration tools." },
    result: { zh: "5 个核心模块 · 通信开销下降约 30%", en: "5 core modules · communication overhead down ≈30%" },
    tech: ["ROS 2", "Component", "OpenCV", "EKF"], alt: "RoboMaster 机器人与视觉开发场景",
  },
  {
    slug: "3d-volume-measurement", category: "3D PERCEPTION · 2025", image: "/images/projects/point-cloud-index.svg",
    title: { zh: "深度相机视觉测算物体体积", en: "Measuring object volume with depth-camera vision" },
    description: { zh: "从深度滤波、RANSAC 基准拟合到几何补偿，处理物流体积测量中的噪声与姿态偏差。", en: "Depth filtering, RANSAC references and geometric compensation address noise and pose bias in logistics volume measurement." },
    result: { zh: "倾斜物体相对误差 ≤3% · 后处理耗时 −40%", en: "Tilted-object relative error ≤3% · post-processing time −40%" },
    tech: ["Orbbec", "Point Cloud", "RANSAC", "OpenCV"], alt: "深度相机点云与体积测量的几何示意",
  },
];

const roles = [
  { period: "2026.03 — 08", title: { zh: "算法工程师 · 三一集团", en: "Algorithm Engineer · SANY" }, text: { zh: "参与焊接机器人域控系统开发，负责多设备软件时间轴、RAW 采集与相位稳像，设计前置扫描与高度预读纠偏模块。", en: "Developed welding-controller modules across multi-device software timing, RAW acquisition, phase stabilization and pre-scan height correction." }, href: "/projects/sany-welding-robotics", tech: ["Robot Integration", "C++", "3D Vision"] },
  { period: "2025.07 — 11", title: { zh: "算法工程师 · 青岛点之云", en: "Algorithm Engineer · Dianzhiyun" }, text: { zh: "研发物流体积测量算法，优化深度图与点云几何。倾斜物体相对误差控制在 3% 以内，端到端处理时延下降约 20%。", en: "Developed depth and point-cloud algorithms for logistics measurement, with tilted-object relative error within 3% and end-to-end latency down about 20%." }, href: "/projects/3d-volume-measurement", tech: ["Depth Camera", "Geometry", "Performance"] },
  { period: "2024.06 — 2025.06", title: { zh: "算法组组长 · QDU VRobot", en: "Vision Team Lead · QDU VRobot" }, text: { zh: "主导 RoboMaster 自瞄架构与实车调试；创立 VRobot 技术开发组织，建立 Git 协作、代码规范与新人培养体系。", en: "Led RoboMaster vision architecture and field debugging. Founded VRobot and established Git workflows, code standards and technical onboarding." }, href: "/projects/auto-aim", tech: ["ROS 2", "Team Leadership", "Calibration"] },
];

export function PortfolioHome() {
  return <main className="portfolio-home" id="top">
    <a className="portfolio-skip-link" href="#selected-work"><T zh="跳到精选项目" en="Skip to selected work" /></a>
    <div className="portfolio-layout">
      <header className="home-identity">
        <div className="home-identity-top"><Link href="/" className="home-wordmark" aria-label="王凯豪 / Kyle Wang">KW<span>.</span></Link><div className="home-utility"><Link href="/resume"><T zh="简历" en="Resume" /><Arrow /></Link><PreferenceControl /></div></div>
        <div className="home-identity-copy"><p className="home-eyebrow">KYLE WANG / 王凯豪</p><h1><T zh="王凯豪" en="Kyle Wang" /></h1><h2><T zh="机器人软件与视觉工程" en="Robotics Software & Vision" /></h2><p className="home-introduction"><T zh={"连接相机、算法与机器人，\n把现场问题变成可靠的软件。"} en="Connecting cameras, algorithms and robots. Building reliable software for the real world." /></p><p className="home-education"><span aria-hidden="true" /><T zh="青岛大学 · 2027 届" en="Qingdao University · Class of 2027" /></p></div>
        <HomeNavigation />
        <div className="home-identity-bottom"><div className="home-social-links"><a href="https://github.com/MzKyle" target="_blank" rel="noreferrer" aria-label="GitHub · MzKyle" title="GitHub"><SocialIcon kind="github" /></a><a href="https://mzkyle.blog.csdn.net" target="_blank" rel="noreferrer" aria-label="CSDN 技术博客 / Technical writing" title="CSDN"><SocialIcon kind="writing" /></a><a href="mailto:2972689924@qq.com" aria-label="发送邮件 / Email Kyle" title="Email"><SocialIcon kind="email" /></a></div><p className="home-side-note">C++ · ROS 2 · INDUSTRIAL VISION</p></div>
      </header>
      <div className="home-content">
        <section className="home-work home-section" id="selected-work" aria-labelledby="home-work-title">
          <h2 className="home-section-label" id="home-work-title"><span>01</span><T zh="精选项目" en="Selected work" /></h2>
          <div className="home-project-list">{selectedWork.map((project, index) => <Link className="home-project" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="home-project-heading"><span className="home-project-category">{project.category}</span><h3><T {...project.title} /><Arrow /></h3></div>
            <figure className="home-project-visual"><Image src={project.image} alt={project.alt} width={360} height={240} unoptimized priority={index === 0} sizes="(max-width: 600px) calc(100vw - 40px), 190px" style={{ objectPosition: projectMedia[project.slug]?.coverPosition }} /></figure>
            <p className="home-project-description"><T {...project.description} /></p>
            <p className="home-project-result"><T {...project.result} /></p>
            <ul className="portfolio-tags">{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul>
          </Link>)}</div>
          <Link className="home-more-link" href="/projects"><T zh="浏览全部工程案例" en="View all engineering work" /><Arrow /></Link>
        </section>
        <section className="home-about home-section" id="about" aria-labelledby="home-about-title"><h2 className="home-section-label" id="home-about-title"><span>02</span><T zh="关于我" en="About" /></h2><p><T zh="我是一名专注机器人软件与工业视觉的工程开发者。喜欢沿着数据的路径，从传感器、时间戳和坐标系，一直追到算法结果与机器人动作。" en="I'm an engineer focused on robotics software and industrial vision. I like following data from sensors, timestamps and coordinate frames all the way to perception results and robot motion." /></p><p><T zh="在三一集团、工业视觉项目和 RoboMaster 团队中，我做过高帧率采集、点云几何、模型部署与实时控制。最关心的是：系统能否在现场稳定运行，出了问题能否被看见、被复现、被解决。" en="Across SANY, industrial inspection and RoboMaster, I've worked on high-rate capture, point-cloud geometry, model deployment and real-time control. I care about systems that run reliably in the field, and failures that can be observed, reproduced and resolved." /></p></section>
        <section className="home-experience home-section" id="experience" aria-labelledby="home-experience-title"><h2 className="home-section-label" id="home-experience-title"><span>03</span><T zh="工程经历" en="Experience" /></h2><div className="home-experience-list">{roles.map(role => <Link href={role.href} className="home-role" key={role.period}><span className="home-role-period">{role.period}</span><div><h3><T {...role.title} /><Arrow /></h3><p><T {...role.text} /></p><ul className="portfolio-tags">{role.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></div></Link>)}</div><a className="home-more-link" href="/resume.pdf" target="_blank" rel="noreferrer"><T zh="查看完整简历" en="View full résumé" /><Arrow diagonal /></a></section>
        <section className="home-open-source home-section" aria-labelledby="home-open-source-title"><h2 className="home-section-label" id="home-open-source-title"><span>+</span><T zh="也在做的事" en="On my workbench" /></h2><div className="home-small-projects">{personalProjects.map(project => <Link href={`/projects/${project.slug}`} key={project.slug}><div><h3>{project.title}<Arrow /></h3><p><Localized text={project.subtitle} /></p></div><span>{project.tech[0]}</span></Link>)}</div></section>
        <section className="home-writing home-section" id="writing" aria-labelledby="home-writing-title"><h2 className="home-section-label" id="home-writing-title"><span>04</span><T zh="技术手记" en="Writing" /></h2><Link className="home-writing-feature" href="/projects/sany-welding-robotics/technical"><div className="home-writing-art" aria-hidden="true"><svg viewBox="0 0 150 100" fill="none"><path className="writing-axis" d="M10 70h130M70 10v80" /><path className="writing-wave" d="M10 50c10-40 20-40 30 0s20 40 30 0 20-40 30 0 20 40 30 0" /><circle cx="70" cy="50" r="4" /></svg><span>t → RAW</span></div><div><span className="home-project-category">2026 / SYSTEM DESIGN</span><h3><T zh="基于运动相位的时间域稳像设计" en="Phase-aware temporal stabilization" /><Arrow /></h3><p><T zh="把全轨迹重建降维为关键相位时间估计。含公式、系统图与交互实验。" en="Reducing full-trajectory reconstruction to key-phase timing. With formulas, system diagrams and interactive experiments." /></p></div></Link><Link className="home-more-link" href="/writing"><T zh="更多 ROS 2、视觉与 C++ 手记" en="More notes on ROS 2, vision and C++" /><Arrow /></Link></section>
        <section className="home-contact" aria-labelledby="home-contact-title"><p className="home-project-category">LET&apos;S BUILD SOMETHING THAT WORKS</p><h2 id="home-contact-title"><T zh="聊聊下一个机器人项目。" en="Let's talk about your next robotics project." /></h2><p><T zh="关注机器人软件、ROS 2 系统集成与工业视觉方向的机会。" en="Interested in opportunities in robotics software, ROS 2 systems and industrial vision." /></p><a href="mailto:2972689924@qq.com" className="home-more-link">2972689924@qq.com<Arrow diagonal /></a></section>
        <footer className="home-footer"><p><T zh="持续构建，也持续记录。" en="Always building. Always taking notes." /></p><div><span>© 2026 Kyle Wang</span><a href="#top"><T zh="回到顶部" en="Back to top" /> ↑</a></div></footer>
      </div>
    </div>
  </main>;
}
