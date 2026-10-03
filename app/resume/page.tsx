import type { Metadata } from "next";
import Link from "next/link";
import { experiences, flagshipProjects, honors } from "../../lib/portfolio";
import { Localized, T } from "../../components/localized";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
export const metadata: Metadata = { title: "简历 | 王凯豪", description: "王凯豪的机器人软件开发工程师在线简历。" };

export default function ResumePage() {
  return (
    <main>
      <SiteHeader active="resume" />
      <section className="resume-hero">
        <div>
          <p className="section-kicker"><T zh="在线简历" en="RESUME" /></p>
          <h1><T zh="王凯豪" en="Kyle Wang" /></h1>
          <p><T zh="机器人软件开发工程师" en="Robotics Software Engineer" /></p>
        </div>
        <div>
          <a className="button button-primary" href="/resume.pdf" download="王凯豪简历.pdf"><T zh="下载 PDF" en="Download PDF" /> <span>↓</span></a>
          <a className="button button-secondary" href="mailto:2972689924@qq.com"><T zh="联系我" en="Contact me" /> <span>↗</span></a>
        </div>
      </section>

      <section className="resume-layout section-shell">
        <aside>
          <div>
            <span><T zh="联系方式" en="CONTACT" /></span>
            <a href="mailto:2972689924@qq.com">2972689924@qq.com</a>
            <a href="tel:19862681939">19862681939</a>
            <a href="https://github.com/MzKyle" target="_blank" rel="noreferrer">github.com/MzKyle</a>
            <a href="https://mzkyle.blog.csdn.net" target="_blank" rel="noreferrer">mzkyle.blog.csdn.net</a>
          </div>
          <div>
            <span><T zh="教育经历" en="EDUCATION" /></span>
            <strong><T zh="青岛大学" en="Qingdao University" /></strong>
            <p><T zh="电子信息工程" en="Electronic Information Engineering" /><br /><T zh="卓越工程师计划" en="Excellence Engineer Program" /><br />2023.09 — 2027.06</p>
          </div>
          <div>
            <span><T zh="核心技术" en="CORE STACK" /></span>
            <ul>
              <li>Modern C++ / CMake</li>
              <li>ROS 2 / TF / Component</li>
              <li>OpenCV / PCL / RANSAC</li>
              <li>YOLO / ONNX / CUDA</li>
              <li>Linux / Time Sync / Shared Memory</li>
              <li>Python / AI Workflow</li>
            </ul>
          </div>
        </aside>

        <div className="resume-main">
          <section>
            <h2><T zh="个人简介" en="SUMMARY" /></h2>
            <p className="resume-summary"><T zh="熟悉 C/C++、Python、CMake 与 ROS 2，具备多线程并发、异步任务、内存与数据生命周期管理及 Linux 工程调试能力。工程经历覆盖工业相机、多设备时间关联、共享内存 / IPC、点云几何、ONNX / CUDA 部署与机器人系统联调。" en="Skilled in C/C++, Python, CMake and ROS 2, with concurrency, asynchronous tasks, memory-lifecycle management and Linux debugging experience. Work spans industrial cameras, multi-device time association, shared memory/IPC, point-cloud geometry, ONNX/CUDA deployment and robot integration." /></p>
          </section>

          <section>
            <h2><T zh="工作经历" en="EXPERIENCE" /></h2>
            {experiences.map((item) => (
              <article key={item.company.zh}>
                <div><span>{item.period}</span><h3><Localized text={item.company} /></h3><strong><Localized text={item.role} /></strong></div>
                <ul>{item.details.map((detail) => <li key={detail.zh}><Localized text={detail} /></li>)}</ul>
              </article>
            ))}
          </section>

          <section>
            <h2><T zh="代表项目" en="SELECTED PROJECTS" /></h2>
            {flagshipProjects.map((project) => (
              <article key={project.slug}>
                <div><span>{project.year}</span><h3>{project.title}</h3><strong><Localized text={project.subtitle} /></strong></div>
                <p><Localized text={project.summary} /></p>
                <Link className="text-link" href={`/projects/${project.slug}`}><T zh="查看项目案例" en="View case study" /> →</Link>
              </article>
            ))}
          </section>

          <section>
            <h2><T zh="荣誉奖项" en="HONORS" /></h2>
            <ul className="honor-list">{honors.map((honor) => <li key={honor.zh}><Localized text={honor} /></li>)}</ul>
          </section>
        </div>
      </section>

      <section className="pdf-preview section-shell">
        <div><p className="section-kicker"><T zh="PDF 简历" en="RESUME PDF" /></p><h2><T zh="完整简历" en="Full resume" /></h2><a href="/resume.pdf" target="_blank" rel="noreferrer"><T zh="在新窗口打开" en="Open in a new window" /> ↗</a></div>
        <iframe src="/resume.pdf" title="王凯豪简历 PDF / Kyle Wang resume PDF" />
      </section>
      <SiteFooter />
    </main>
  );
}
