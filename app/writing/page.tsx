import type { Metadata } from "next";
import { writingTopics } from "../../lib/portfolio";
import { T } from "../../components/localized";
import { PageIntro, SiteFooter, SiteHeader } from "../../components/site-shell";
import { WritingTopicBrowser } from "../../components/writing-topic-browser";
import { FeaturedWriting } from "../../components/featured-writing";
export const metadata: Metadata = { title: "技术文章 | 王凯豪", description: "王凯豪围绕 ROS 2、工业视觉、C++、Linux 实时性与机器人标定整理的技术文章与工程实践。" };

export default function WritingPage() {
  return <main><SiteHeader active="writing" /><PageIntro eyebrow={{ zh: "技术文章", en: "TECHNICAL WRITING" }} title={{ zh: "机器人软件工程的持续思考与实践", en: "Robotics software engineering, examined through systems and practice" }} description={{ zh: "王凯豪围绕 ROS 2、工业视觉、C++ 系统编程、Linux 实时性与机器人标定持续输出技术内容，呈现其对系统原理、工程决策与现场问题的理解。", en: "Kyle Wang writes about ROS 2, industrial vision, C++ systems, Linux real-time engineering, and robot calibration—demonstrating how he reasons about architecture, technical decisions, and field problems." }} meta={{ zh: "ROS 2 · 工业视觉 · C++ · Linux · 机器人系统", en: "ROS 2 · INDUSTRIAL VISION · C++ · LINUX · ROBOTICS" }} />
    <FeaturedWriting />
    <section className="writing-page section-shell">
      <div className="writing-page-heading writing-page-heading-single"><div className="section-primary-heading"><h2><T zh="技术能力" en="Technical Expertise" /></h2><p><T zh="内容覆盖传感器接入、视觉感知与空间计算、ROS 2 通信、Linux 实时链路和 C++ 工程化，既关注底层原理，也关注系统能否稳定运行与交付。" en="The writing spans sensor integration, perception and geometry, ROS 2 communication, Linux real-time paths, and production C++—connecting underlying principles with reliable system delivery." /></p></div></div>
      <WritingTopicBrowser topics={writingTopics} />
      <div className="writing-source-note"><span aria-hidden="true">✦</span><p><strong><T zh="源于真实工程问题" en="Grounded in real engineering problems" /></strong><T zh="文章将工业相机接入、机器人通信、时间同步、坐标标定、性能调优与故障定位等实践沉淀为可复用的方法，体现王凯豪分析复杂系统和清晰表达技术判断的能力。" en="These articles turn camera integration, robot communication, time synchronization, calibration, performance tuning, and fault diagnosis into reusable methods—evidence of Kyle's systems thinking and technical communication." /></p></div>
    </section>
    <SiteFooter /></main>;
}
