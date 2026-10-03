import Link from "next/link";
import { T } from "./localized";

export function FeaturedWriting() {
  return <section className="featured-writing section-shell" aria-labelledby="featured-writing-title">
    <div className="featured-writing-heading"><span className="section-kicker">SELECTED WRITING</span><h2 id="featured-writing-title"><T zh="从这里开始读" en="Start with these notes" /></h2></div>
    <div className="featured-writing-grid">
      <Link className="writing-essay-feature" href="/projects/sany-welding-robotics/technical">
        <div className="writing-essay-art" aria-hidden="true"><svg viewBox="0 0 480 150" fill="none"><path className="writing-axis" d="M24 110h432M240 22v108" /><path className="writing-wave" d="M24 76c18-56 36-56 54 0s36 56 54 0 36-56 54 0 36 56 54 0 36-56 54 0 36 56 54 0 36-56 54 0 36 56 54 0" /><path className="writing-axis" d="M78 30v94M186 30v94M294 30v94M402 30v94" /><circle cx="240" cy="76" r="5" /></svg><span>PHASE → RAW → ISP</span></div>
        <div className="writing-essay-copy"><span className="home-project-category">2026 / SYSTEM DESIGN</span><h3><T zh="基于运动相位的时间域稳像设计" en="Phase-aware temporal stabilization" /> <i aria-hidden="true">↗</i></h3><p><T zh="把全轨迹重建降维为关键相位时间估计。含公式、系统图与交互实验。" en="Reducing full-trajectory reconstruction to key-phase timing. With formulas, system diagrams and interactive experiments." /></p></div>
      </Link>
      <div className="featured-writing-notes">
        <a href="https://blog.csdn.net/2301_80079642/article/details/146779683" target="_blank" rel="noreferrer"><span>ROS 2 / 2025.03</span><h3>ROS 2 ---时间戳对齐 <i aria-hidden="true">↗</i></h3><small>CSDN · <T zh="阅读全文" en="Read article" /></small></a>
        <a href="https://blog.csdn.net/2301_80079642/article/details/164371640" target="_blank" rel="noreferrer"><span>IMAGING / 2026.09</span><h3>ISP--- RAW 图像 从传感器噪声模型到快门时序与频闪效应 <i aria-hidden="true">↗</i></h3><small>CSDN · <T zh="阅读全文" en="Read article" /></small></a>
      </div>
    </div>
  </section>;
}
