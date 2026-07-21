import Link from "next/link";
import { capabilities, experiences, projects, writingTopics } from "../lib/portfolio";
import { Localized, T } from "../components/localized";
import { ContactBand, SiteFooter, SiteHeader } from "../components/site-shell";

export default function Home() {
  const leadProject = projects[0];
  const projectHighlights = projects.slice(1);
  const employment = experiences.filter((item) => item.kind === "employment");
  const writingHighlights = [writingTopics[0], writingTopics[1], writingTopics[3]];

  return (
    <main className="home-page">
      <SiteHeader active="home" />

      <section className="hero home-hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy home-hero-copy">
          <div className="home-hero-primary">
            <h1 className="home-name"><T zh="王凯豪" en="Kyle Wang" /></h1>
            <p className="role"><T zh="机器人软件开发工程师" en="Robotics Software Engineer" /></p>
            <p className="stack">C++ · ROS 2 · Industrial Vision · Robot Control</p>
            <p className="hero-description">
              <T
                zh="将工业相机、视觉算法、ROS 2 与机械臂控制整合为可运行、可诊断、可交付的机器人软件系统。"
                en="I integrate industrial cameras, perception algorithms, ROS 2, and robot control into deployable, diagnosable robotics systems."
              />
            </p>
            <div className="home-system-route" aria-label="核心工程链路 / Core engineering route">
              <strong><T zh="核心链路" en="CORE ROUTE" /></strong>
              <span><T zh="设备接入" en="Devices" /></span><i>→</i>
              <span><T zh="视觉感知" en="Perception" /></span><i>→</i>
              <span>ROS 2</span><i>→</i>
              <span><T zh="机器人执行" en="Robot execution" /></span>
            </div>
            <div className="hero-actions">
              <Link className="button button-primary" href="/projects"><T zh="查看核心项目" en="View core projects" /> <span>→</span></Link>
              <Link className="button button-secondary" href="/resume"><T zh="查看简历" en="View resume" /> <span>↗</span></Link>
            </div>
            <p className="home-current-role">
              <strong><T zh="当前" en="CURRENT" /></strong>
              <span><T zh="三一集团 · 工业焊接机器人与视觉定位" en="SANY Group · industrial welding robotics and visual positioning" /></span>
            </p>
          </div>
          <aside className="home-hero-brief" aria-label="工程能力范围 / Engineering scope">
            <p><T zh="工程能力范围" en="ENGINEERING SCOPE" /></p>
            <h2><T zh="从真实设备到可交付系统" en="From real devices to deployable systems" /></h2>
            <dl>
              <div><dt><T zh="传感与设备" en="SENSING" /></dt><dd><T zh="工业相机、深度数据、串口与 PLC 接入" en="Industrial cameras, depth data, serial links, and PLC integration" /></dd></div>
              <div><dt><T zh="机器人链路" en="ROBOTICS" /></dt><dd><T zh="ROS 2、TF、算法服务与机械臂流程" en="ROS 2, TF, algorithm services, and robot workflows" /></dd></div>
              <div><dt><T zh="工程交付" en="DELIVERY" /></dt><dd><T zh="仿真验证、状态诊断、数据记录与部署" en="Simulation, diagnostics, data records, and deployment" /></dd></div>
            </dl>
          </aside>
        </div>
        <div className="hero-visual home-hero-visual" role="img" aria-label="工业焊接机器人工作站场景示意 / Industrial welding robot workstation overview">
          <div className="visual-background" />
        </div>
      </section>

      <section className="home-selected-work section-shell">
        <header className="home-section-head">
          <div>
            <h2><T zh="个人项目" en="Personal Projects" /></h2>
          </div>
          <div>
            <p><T zh="从工业视觉检测到机器人闭环与工程工具，重点展示感知、控制和系统交付能力。" en="Selected work spanning industrial inspection, closed-loop robotics, and engineering tools." /></p>
            <Link href="/projects"><T zh="查看全部项目" en="View all projects" /> →</Link>
          </div>
        </header>

        <Link className="home-featured-project" href={`/projects/${leadProject.slug}`}>
          <div className={`home-featured-image home-featured-image-${leadProject.imageMode ?? "cover"}`}>
            <img src={leadProject.image} alt={`${leadProject.title} — ${leadProject.subtitle.zh}`} fetchPriority="high" decoding="async" />
          </div>
          <div className="home-featured-copy">
            <div className="home-project-meta"><span><T zh="重点案例" en="FLAGSHIP CASE" /></span><time>{leadProject.year}</time></div>
            <h3>{leadProject.title}</h3>
            <h4><Localized text={leadProject.subtitle} /></h4>
            <p><Localized text={leadProject.summary} /></p>
            <ul className="home-featured-proof">
              {leadProject.decisions.map((decision) => <li key={decision.title.zh}><Localized text={decision.title} /></li>)}
            </ul>
            <footer><span>{leadProject.tech.slice(0, 4).join(" · ")}</span><b><T zh="查看完整案例" en="View case study" /> →</b></footer>
          </div>
        </Link>

        <div className="home-project-list">
          {projectHighlights.map((project) => (
            <Link className="home-project-row" href={`/projects/${project.slug}`} key={project.slug}>
              <span className="home-project-number">{project.index}</span>
              <div className={`home-project-thumb home-project-thumb-${project.imageMode ?? "cover"} home-project-thumb-${project.slug}`}>
                <img src={project.image} alt={`${project.title} — ${project.subtitle.zh}`} loading="lazy" decoding="async" />
              </div>
              <div className="home-project-summary">
                <small><Localized text={project.category} /> · {project.year}</small>
                <h3>{project.title}</h3>
                <p><Localized text={project.subtitle} /></p>
              </div>
              <span className="home-project-tech">{project.tech.slice(0, 3).join(" · ")}</span>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-core-capabilities section-shell">
        <header className="home-section-head home-section-head-compact">
          <div className="home-primary-heading">
            <h2><T zh="核心能力" en="Core Capabilities" /></h2>
            <p><T zh="从设备接入到机器人系统交付" en="From device integration to robotics delivery" /></p>
          </div>
          <p><T zh="能够推进传感器、感知算法、ROS 2 控制链路与现场部署之间的完整集成工作。" en="Able to carry robotics systems from sensors and perception through ROS 2 control and field deployment." /></p>
        </header>
        <div className="home-core-grid">
          {capabilities.map((capability, index) => (
            <article key={capability.code}>
              <span>0{index + 1}</span>
              <h3><Localized text={capability.title} /></h3>
              <p><Localized text={capability.text} /></p>
              <div>{capability.items.slice(0, 3).map((item, itemIndex) => <span key={item.zh}><Localized text={item} />{itemIndex < 2 && <i> · </i>}</span>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-career section-shell">
        <header className="home-section-head home-section-head-compact">
          <div className="home-primary-heading">
            <h2><T zh="工作经历" en="Work Experience" /></h2>
            <p><T zh="在工业现场完成机器人软件开发" en="Robotics software built in industrial environments" /></p>
          </div>
          <Link href="/experience"><T zh="查看完整经历" en="View full experience" /> →</Link>
        </header>
        <div className="home-career-list">
          {employment.map((item, index) => (
            <article key={item.company.zh}>
              <div className="home-career-period"><time>{item.period}</time>{index === 0 && <span><T zh="在职" en="CURRENT" /></span>}</div>
              <div className="home-career-title"><h3><Localized text={item.company} /></h3><p><Localized text={item.role} /></p></div>
              <p className="home-career-summary"><Localized text={item.summary} /></p>
              <strong><Localized text={item.metrics[0]} /></strong>
            </article>
          ))}
        </div>
      </section>

      <section className="home-writing-brief section-shell">
        <div className="home-primary-heading">
          <h2><T zh="技术文章" en="Technical Writing" /></h2>
          <p><T zh="把工程问题写清楚" en="Making engineering problems understandable" /></p>
        </div>
        <p><T zh="持续整理 ROS 2、工业视觉、C++ 系统编程与 Linux 实时链路中的实践经验。" en="Writing about ROS 2, industrial vision, C++ systems, and Linux real-time engineering." /></p>
        <div className="home-writing-topics">
          {writingHighlights.map((topic) => <span key={topic.slug}><Localized text={topic.title} /></span>)}
        </div>
        <Link href="/writing"><T zh="查看技术文章" en="View technical writing" /> →</Link>
      </section>

      <ContactBand />
      <SiteFooter />
    </main>
  );
}
