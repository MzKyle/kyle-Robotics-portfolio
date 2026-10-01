import type { Metadata } from "next";
import { SanyExperienceHub } from "../../../components/compact-cases/SanyExperienceHub";
import "../../../components/compact-cases/compact-cases.css";

export const metadata: Metadata = {
  title: "SANY 工业焊接机器人 | 焊前定位与摆弧焊视觉工程案例",
  description: "三一工业焊接机器人项目中的焊前 3D 定位与基于运动相位的摆弧焊视觉感知系统。",
};

export default function Page() {
  return <SanyExperienceHub />;
}
