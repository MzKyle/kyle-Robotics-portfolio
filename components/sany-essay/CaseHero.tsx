import Link from "next/link";
import { T } from "../localized";
import { SanyHeroVisual } from "./SanyMedia";

export function CaseHero() {
  return <header className="essay-hero">
    <Link className="essay-back" href="/projects/sany-welding-robotics">← <T zh="SANY 项目概览" en="SANY project overview" /></Link>
    <div className="essay-hero-grid">
      <div className="essay-hero-copy">
        <p className="essay-overline">SANY INTERNSHIP · ROBOTICS SOFTWARE</p>
        <h1><span className="lang-zh">基于运动相位的<br />时间域稳像设计</span><span className="lang-en">Phase-aware<br />Temporal Stabilization</span></h1>
        <p className="essay-hero-english">Phase-aware Temporal Stabilization<br />for Robotic Welding Vision</p>
        <p className="essay-hero-summary"><T zh="面对约 60 Hz FANUC TCP 状态与最高约 200 Hz RAW 相机之间的采样失配，通过运动先验将全轨迹重建降维为关键相位时间估计，再从高频 RAW 历史中选取同相位真实帧，并通过 ISP 后处理完成稳定熔池观测。" en="Faced with roughly 60 Hz FANUC TCP state and RAW camera capability up to about 200 Hz, this design uses motion priors to reduce full-trajectory reconstruction to key-phase timing, selects real same-phase frames from high-rate RAW history, and processes only those frames through ISP for stable weld-pool observation." /></p>
        <dl className="essay-hero-meta">
          <div><dt>ROLE</dt><dd><T zh="机器人软件实习" en="Robotics software intern" /></dd></div>
          <div><dt>FOCUS</dt><dd><T zh="相位估计与时间系统" en="Phase estimation & timing" /></dd></div>
          <div><dt>SYSTEM</dt><dd>Robot · RAW · ISP</dd></div>
        </dl>
      </div>
      <SanyHeroVisual />
    </div>
  </header>;
}
