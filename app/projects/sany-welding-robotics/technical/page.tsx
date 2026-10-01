import type { Metadata } from "next";
import { SanyTechnicalEssay } from "../../../../components/sany-essay/SanyTechnicalEssay";
import "../../../../components/sany-essay/sany-essay.css";

export const metadata: Metadata = {
  title: "基于运动相位的时间域稳像设计 | SANY 技术深读",
  description: "机器人约 60 Hz 状态与高频 RAW 相机的采样失配、运动相位估计、真实选帧、ISP 解耦和跨设备时间轴设计。",
};

export default function Page() {
  return <SanyTechnicalEssay />;
}
