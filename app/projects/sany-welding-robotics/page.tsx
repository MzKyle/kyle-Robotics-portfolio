import type { Metadata } from "next";
import { SanyCase } from "../../../components/case-study/sany-case";
import "../../../components/case-study/sany-case.css";
import { getProjectWithNeighbors } from "../../../lib/portfolio";

export const metadata: Metadata = {
  title: "工业焊接机器人实时感知与摆弧焊视觉系统 | 王凯豪工程案例",
  description: "60 Hz 机器人状态与 200 Hz RAW 相机约束下的相位感知、Buffer 架构、ISP 解耦与跨设备时间轴设计。",
};

export default function Page() {
  return <SanyCase {...getProjectWithNeighbors("sany-welding-robotics")!} />;
}
