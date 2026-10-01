import Link from "next/link";
import { capabilities, flagshipProjects, personalProjects, writingTopics } from "../lib/portfolio";
import { Localized, T } from "../components/localized";
import { ContactBand, SiteFooter, SiteHeader } from "../components/site-shell";
import { FeaturedCaseCard, SecondaryCaseCard } from "../components/engineering-work";

export default function Home() {
  const writingHighlights = [writingTopics[0], writingTopics[1], writingTopics[3]];
  const [featuredProject, ...secondaryProjects] = flagshipProjects;

  return (
    <main className="home-page engineering-home">
      <SiteHeader active="home" />

      <section className="engineering-hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="engineering-hero-main">
          <p className="section-kicker">ENGINEERING PORTFOLIO / CASEBOOK</p>
          <h1><T zh="王凯豪" en="Kyle Wang" /></h1>
          <p className="role"><T zh="机器人软件开发工程师" en="Robotics Software Engineer" /></p>
          <p className="stack">C++ · ROS 2 · Industrial Vision · Robot Control</p>
          <p className="hero-description"><T zh="将工业相机、视觉算法、ROS 2 与机械臂控制整合为可运行、可诊断、可交付的机器人软件系统。" en="I integrate industrial cameras, perception algorithms, ROS 2, and robot control into deployable, diagnosable robotics systems." /></p>
          <div className="hero-actions">
            <a className="button button-primary" href="#selected-work"><T zh="精选工程案例" en="Selected work" /> <span>↓</span></a>
            <Link className="hero-text-link" href="/resume"><T zh="查看简历" en="Resume" /> ↗</Link>
          </div>
        </div>
        <aside className="engineering-hero-route" aria-label="工程能力链路 / Engineering capability route">
          <span><T zh="系统范围" en="SYSTEM SCOPE" /></span>
          <ol>
            <li><b>01</b><T zh="设备与采集" en="Devices & acquisition" /></li>
            <li><b>02</b><T zh="视觉与三维感知" en="Vision & 3D perception" /></li>
            <li><b>03</b><T zh="状态、坐标与通信" en="State, frames & communication" /></li>
            <li><b>04</b><T zh="机器人执行与交付" en="Robot execution & delivery" /></li>
          </ol>
        </aside>
      </section>

      <section className="flagship-work section-shell" id="selected-work">
        <header className="engineering-section-head">
          <div><span>01 / SELECTED ENGINEERING WORK</span><h2><T zh="真实工业系统、机器人闭环与三维视觉工程案例" en="Industrial systems, robot vision loops, and 3D perception" /></h2></div>
          <p><T zh="四个最重要的项目：从系统交付到视觉闭环，用技术与结果证据快速说明工程价值。" en="Four essential projects, presented through technical focus and result evidence." /></p>
        </header>
        <div className="selected-engineering-work">
          <FeaturedCaseCard project={featuredProject} />
          <div className="engineering-secondary-grid">
            {secondaryProjects.map((project) => <SecondaryCaseCard project={project} key={project.slug} />)}
          </div>
        </div>
      </section>

      <section className="home-core-capabilities section-shell">
        <header className="engineering-section-head">
          <div><span>02 / ENGINEERING CAPABILITIES</span><h2><T zh="把算法放进可运行的系统" en="Putting algorithms into working systems" /></h2></div>
          <p><T zh="能力覆盖传感器接入、实时数据路径、视觉算法、状态与坐标、设备控制和交付诊断。" en="Capabilities span sensing, real-time data paths, vision, state and frames, device control, delivery, and diagnostics." /></p>
        </header>
        <div className="home-core-grid">
          {capabilities.map((capability, index) => <article key={capability.code}><span>0{index + 1}</span><h3><Localized text={capability.title} /></h3><p><Localized text={capability.text} /></p><div>{capability.items.slice(0, 3).map((item, itemIndex) => <span key={item.zh}><Localized text={item} />{itemIndex < 2 && <i> · </i>}</span>)}</div></article>)}
        </div>
      </section>

      <section className="other-engineering section-shell">
        <header className="engineering-section-head">
          <div><span>03 / OTHER ENGINEERING PROJECTS</span><h2><T zh="个人与开源工程" en="Personal and open-source engineering" /></h2></div>
          <p><T zh="作为旗舰案例之外的补充，展示数据工具、机器人仿真与跨平台产品开发。" en="Supporting work across data tooling, robot simulation, and cross-platform product engineering." /></p>
        </header>
        <div className="other-engineering-list">
          {personalProjects.map((project) => <Link href={`/projects/${project.slug}`} key={project.slug}><span>{project.index}</span><div><small><Localized text={project.category} /></small><h3>{project.title}</h3><p><Localized text={project.summary} /></p></div><b>{project.tech.slice(0, 3).join(" · ")}</b><i aria-hidden="true">→</i></Link>)}
        </div>
        <Link className="section-text-link" href="/projects"><T zh="查看全部项目" en="View all projects" /> →</Link>
      </section>

      <section className="home-writing-brief section-shell">
        <div className="home-primary-heading"><span>04 / TECHNICAL WRITING</span><h2><T zh="把工程问题写清楚" en="Making engineering problems understandable" /></h2></div>
        <p><T zh="持续整理 ROS 2、工业视觉、C++ 系统编程与 Linux 实时链路中的实践经验。" en="Writing about ROS 2, industrial vision, C++ systems, and Linux real-time engineering." /></p>
        <div className="home-writing-topics">{writingHighlights.map((topic) => <span key={topic.slug}><Localized text={topic.title} /></span>)}</div>
        <Link href="/writing"><T zh="查看技术文章" en="View technical writing" /> →</Link>
      </section>

      <ContactBand />
      <SiteFooter />
    </main>
  );
}
