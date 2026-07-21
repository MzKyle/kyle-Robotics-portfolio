import type { Metadata } from "next";
import Link from "next/link";
import { capabilities } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";

export const metadata: Metadata = {
  title: "关于我 | 王凯豪",
  description: "机器人软件开发工程师王凯豪的个人概览、技术路线与工程经历。",
};

function DisclosureToggle() {
  return (
    <span className="disclosure-toggle">
      <span className="when-closed"><T zh="展开详情" en="View details" /></span>
      <span className="when-open"><T zh="收起内容" en="Collapse" /></span>
      <b aria-hidden="true">+</b>
    </span>
  );
}

export default function AboutPage() {
  return (
    <main>
      <SiteHeader active="about" />
      <PageIntro
        eyebrow={{ zh: "关于我", en: "ABOUT" }}
        title={{ zh: "从电子信息工程走向工业机器人软件", en: "From electronic engineering to industrial robotics software" }}
        description={{
          zh: "我是王凯豪，青岛大学电子信息工程专业本科生，专注 C++、ROS 2、工业视觉与机器人系统集成。",
          en: "I am Kyle Wang, an Electronic Information Engineering undergraduate focused on C++, ROS 2, industrial vision, and robotics systems integration.",
        }}
        meta={{ zh: "青岛大学 · 2027 年毕业 · 机器人软件", en: "QINGDAO UNIVERSITY · GRADUATING 2027 · ROBOTICS SOFTWARE" }}
      />

      <section className="about-overview section-shell">
        <div className="about-overview-copy">
          <div className="section-primary-heading"><h2><T zh="快速了解" en="At a Glance" /></h2><p><T zh="机器人软件开发工程师" en="Robotics Software Engineer" /></p></div>
          <p><T zh="我擅长把相机、点云、视觉算法、ROS 2 与机械臂控制连接成可运行、可观测、可维护的软件系统。目前主要参与工业焊接机器人与机器视觉开发。" en="I connect cameras, point clouds, perception algorithms, ROS 2, and robot control into operational, observable, and maintainable systems. I currently work on industrial welding robotics and machine vision." /></p>
          <div className="about-overview-actions"><Link href="/projects"><T zh="查看代表项目" en="View selected work" /> →</Link><Link href="/resume"><T zh="查看完整简历" en="View full resume" /> →</Link></div>
        </div>

        <dl className="about-facts">
          <div><dt><T zh="当前经历" en="CURRENT ROLE" /></dt><dd><T zh="三一集团 · 耘创新实验室 / 工业焊接机器人" en="SANY · Yun Innovation Lab / Industrial welding robotics" /></dd></div>
          <div><dt><T zh="核心技术" en="CORE STACK" /></dt><dd>C++ · ROS 2 · Linux · OpenCV · PCL</dd></div>
          <div><dt><T zh="完整链路" en="SYSTEM SCOPE" /></dt><dd><T zh="设备接入 → 感知部署 → 机器人控制 → 仿真诊断" en="Device integration → perception → robot control → simulation and diagnostics" /></dd></div>
          <div><dt><T zh="求职方向" en="ROLE TARGET" /></dt><dd><T zh="机器人软件开发 · ROS 2 系统集成 · 工业视觉工程" en="Robotics software · ROS 2 systems · Industrial vision" /></dd></div>
        </dl>

        <div className="about-overview-chain"><strong><T zh="我能够承担" en="I CAN OWN" /></strong><p><span><T zh="传感器与设备" en="Sensors" /></span><i>→</i><span><T zh="图像与点云" en="Image & point cloud" /></span><i>→</i><span><T zh="算法服务" en="Algorithm services" /></span><i>→</i><span><T zh="运动控制" en="Motion control" /></span><i>→</i><span><T zh="部署与诊断" en="Deployment & diagnostics" /></span></p></div>
      </section>

      <section className="about-disclosures section-shell">
        <div className="disclosure-list">
          <details className="about-disclosure">
            <summary><span className="disclosure-index">01</span><div><small><T zh="经历与路径" en="EXPERIENCE &amp; PATH" /></small><h2><T zh="工程经历与成长路径" en="Experience and engineering journey" /></h2><p><T zh="嵌入式基础 → RoboMaster → 工业视觉 → 焊接机器人系统" en="Embedded foundations → RoboMaster → industrial vision → welding robotics" /></p></div><DisclosureToggle /></summary>
            <div className="disclosure-content">
              <div className="about-expanded-story">
                <p className="about-lead"><T zh="目前，我主要参与工业焊接机器人与机器视觉系统开发，工作内容覆盖 2D/3D 相机采集、点云与图像处理、算法服务接入、坐标转换、FANUC 机械臂运动流程以及系统记录与排障。" en="I currently work on industrial welding robots and machine-vision systems, covering 2D/3D cameras, point-cloud and image processing, algorithm services, coordinate transforms, FANUC motion workflows, and diagnostics." /></p>
                <div><p><T zh="此前，我参与物流 3D 体积测量，并以项目制方式交付工业水样袋缺陷检测系统，打通相机、推理、PLC 分拣与结果追溯。" en="Previously, I worked on 3D logistics measurement and delivered an industrial waterbag inspection system spanning cameras, inference, PLC sorting, and traceability." /></p><p><T zh="RoboMaster 算法组组长经历让我较早接触实时视觉闭环、PnP、状态估计、串口协议与团队协作。" en="Leading a RoboMaster vision team gave me early experience with real-time visual loops, PnP, state estimation, serial protocols, and team collaboration." /></p></div>
              </div>
              <ol className="journey-list">
                <li><time>2023</time><div><small><T zh="基础阶段" en="FOUNDATION" /></small><h3><T zh="电子信息与嵌入式基础" en="Electronics and embedded foundations" /></h3><p><T zh="从 C/C++、51 单片机与 STM32 开始理解内存、外设、串口通信、采样与控制。" en="Built hardware foundations through C/C++, 8051 and STM32 development, peripherals, serial communication, sampling, and control." /></p></div><span>C/C++ · STM32 · UART · CRC</span></li>
                <li><time>2024</time><div><small><T zh="机器人闭环" en="ROBOTICS LOOP" /></small><h3><T zh="RoboMaster 视觉闭环与团队负责" en="RoboMaster visual loop and team leadership" /></h3><p><T zh="担任算法组组长，参与相机接入、装甲板识别、PnP、Tracker / Kalman 预测、坐标变换和 NUC 与 STM32 控制通信。" en="Led camera integration, armor detection, PnP, Tracker / Kalman prediction, transforms, and NUC-to-STM32 control communication." /></p></div><span>ROS 2 · OpenCV · PnP · TRACKER</span></li>
                <li><time>2025</time><div><small><T zh="工业视觉" en="INDUSTRIAL VISION" /></small><h3><T zh="进入工业视觉与项目交付" en="Industrial vision and project delivery" /></h3><p><T zh="参与物流 3D 体积测量并推进水样袋缺陷检测，开始负责相机、模型、PLC、数据库和桌面工具组成的生产链路。" en="Worked on 3D logistics measurement and waterbag inspection across cameras, models, PLCs, databases, and desktop tools." /></p></div><span>3D VISION · ONNX · PLC · QT</span></li>
                <li><time>2026</time><div><small><T zh="机器人系统" en="ROBOTICS SYSTEMS" /></small><h3><T zh="工业焊接机器人与工程工具" en="Welding robotics and engineering tools" /></h3><p><T zh="围绕 FANUC 完善相机、算法与运动控制链路，并开发 DataScope Studio、Robot-Sim 等数据诊断和仿真工具。" en="Integrated cameras, algorithms, and FANUC motion control while building DataScope Studio and Robot-Sim." /></p></div><span>FANUC · MOVEIT 2 · RERUN · GAZEBO</span></li>
              </ol>
            </div>
          </details>

          <details className="about-disclosure">
            <summary><span className="disclosure-index">02</span><div><small><T zh="工程方法" en="ENGINEERING METHOD" /></small><h2><T zh="我如何解决机器人系统问题" en="How I solve robotics system problems" /></h2><p><T zh="系统视图 · 可观测性 · 异常恢复 · 可复现实验" en="System view · observability · robustness · reproducible validation" /></p></div><DisclosureToggle /></summary>
            <div className="disclosure-content">
              <div className="method-list">
                <article><span>01</span><div><small><T zh="系统视图" en="SYSTEM VIEW" /></small><h3><T zh="沿完整链路定位问题" en="Trace the complete system path" /></h3></div><p><T zh="从传感器输入、时间戳、坐标系、算法响应一路检查到运动指令和设备反馈，判断问题属于数据、通信、算法还是控制。" en="Trace sensor input, timestamps, frames, algorithm responses, motion commands, and device feedback to isolate the failing layer." /></p><b>INPUT → TRANSFORM → SERVICE → MOTION → FEEDBACK</b></article>
                <article><span>02</span><div><small><T zh="可观测性" en="OBSERVABILITY" /></small><h3><T zh="让运行状态可以被看见" en="Make runtime state visible" /></h3></div><p><T zh="通过结构化日志、指标、图像与点云记录、rosbag / MCAP 回放和可视化建立可复现的诊断链路。" en="Use logs, metrics, recording, rosbag / MCAP replay, and visualization to reproduce field issues." /></p><b>LOGS · METRICS · RECORDING · REPLAY</b></article>
                <article><span>03</span><div><small><T zh="异常恢复" en="ROBUSTNESS" /></small><h3><T zh="把异常路径放进系统设计" en="Design the failure paths" /></h3></div><p><T zh="通过互斥、状态机、重试、超时和安全退出处理服务超时、Socket 并发、设备断连与推理乱序。" en="Use locking, state machines, retries, timeouts, and safe shutdown for service, socket, device, and inference failures." /></p><b>STATE · TIMEOUT · RETRY · SAFE EXIT</b></article>
                <article><span>04</span><div><small><T zh="验证方法" en="VALIDATION" /></small><h3><T zh="用可复现实验完成技术判断" en="Make decisions with reproducible tests" /></h3></div><p><T zh="针对延迟、精度和稳定性建立基线，控制变量比较推理后端或数据处理方案，用结果推动决策。" en="Establish latency, accuracy, and stability baselines, then compare alternatives under controlled conditions." /></p><b>BASELINE · CONTROL · P95 · REGRESSION</b></article>
              </div>
            </div>
          </details>

          <details className="about-disclosure">
            <summary><span className="disclosure-index">03</span><div><small><T zh="能力体系" en="CAPABILITY MAP" /></small><h2><T zh="能够独立承担的工作" en="Areas I can own independently" /></h2><p><T zh="机器人系统集成 · 工业视觉与点云 · C++ 工程化" en="Robotics integration · industrial vision · C++ engineering" /></p></div><DisclosureToggle /></summary>
            <div className="disclosure-content">
              <div className="capability-editorial">
                {capabilities.map((item) => (
                  <article key={item.code}><span>{item.code}</span><div><h3><Localized text={item.title} /></h3><p><Localized text={item.text} /></p></div><ul>{item.items.map((point) => <li key={point.zh}><Localized text={point} /></li>)}</ul></article>
                ))}
              </div>
            </div>
          </details>

          <details className="about-disclosure">
            <summary><span className="disclosure-index">04</span><div><small><T zh="教育与团队" en="EDUCATION &amp; LEADERSHIP" /></small><h2><T zh="教育、团队角色与荣誉" en="Education, leadership, and honors" /></h2><p><T zh="青岛大学 · RoboMaster 算法组组长 · 电子设计竞赛 · 5 项代表荣誉" en="Qingdao University · RoboMaster team lead · electronics competition · five selected honors" /></p></div><DisclosureToggle /></summary>
            <div className="disclosure-content">
              <div className="education-honors">
                <div className="education-profile"><p className="section-kicker"><T zh="教育与团队" en="EDUCATION &amp; LEADERSHIP" /></p><h2><T zh="青岛大学" en="Qingdao University" /></h2><p><T zh="电子信息工程 · 卓越工程师计划" en="Electronic Information Engineering · Excellence Engineer Program" /></p><span>2023.09 — 2027.06</span><dl><div><dt><T zh="团队角色" en="TEAM ROLE" /></dt><dd><T zh="RoboMaster 算法组组长" en="RoboMaster Vision Team Lead" /></dd></div><div><dt><T zh="竞赛角色" en="COMPETITION ROLE" /></dt><dd><T zh="全国大学生电子设计大赛项目负责人" en="Project Lead, National Electronics Design Contest" /></dd></div><div><dt><T zh="基础方向" en="FOUNDATIONS" /></dt><dd><T zh="电子系统 · 嵌入式开发 · 信号与数据处理" en="Electronics · embedded development · signal and data processing" /></dd></div></dl></div>
                <div className="honors-profile"><p className="section-kicker"><T zh="代表荣誉" en="SELECTED HONORS" /></p><ul><li><span>01</span><T zh="全国大学生机器人竞赛全国三等奖" en="National College Student Robotics Competition — Third Prize" /></li><li><span>02</span><T zh="全国大学生机器人竞赛区域赛二等奖" en="Regional Robotics Competition — Second Prize" /></li><li><span>03</span><T zh="RoboMaster 高校联盟赛二等奖、机器人竞技一等奖" en="RoboMaster University League — Second Prize; Robot Competition — First Prize" /></li><li><span>04</span><T zh="全国大学生电子设计大赛省级二等奖" en="National Electronics Design Contest Provincial — Second Prize" /></li><li><span>05</span><T zh="谐振杯电子设计大赛一等奖" en="Resonance Cup Electronics Design Contest — First Prize" /></li></ul></div>
              </div>
            </div>
          </details>
        </div>
      </section>

      <section className="about-target section-shell">
        <div className="section-primary-heading"><h2><T zh="求职方向" en="Career Focus" /></h2><p><T zh="期待参与真正落地的机器人系统" en="Ready to contribute to robotics systems that ship" /></p></div>
        <div><p><T zh="目标岗位：机器人软件开发、ROS 2 系统集成与工业视觉工程。希望继续深化设备驱动、实时与时间同步、机器人控制和工程工具。" en="Target roles: robotics software, ROS 2 systems integration, and industrial vision engineering, with deeper work in drivers, real-time systems, time synchronization, robot control, and tooling." /></p><div><Link href="/experience"><T zh="查看工作经历" en="View experience" /> →</Link><Link href="/resume"><T zh="查看完整简历" en="View full resume" /> →</Link></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
