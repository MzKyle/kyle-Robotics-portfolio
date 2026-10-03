import type { Metadata } from "next";
import { PreWeldLocalization } from "../../../../components/compact-cases/PreWeldLocalization";
import "../../../../components/compact-cases/compact-cases.css";

export const metadata: Metadata = { title: "焊前 3D 点云定位 | SANY 工程案例", description: "预存工件点云、实时 3D 观测与机器人 TCP 位姿关联形成焊前高度纠偏。" };
export default function Page() { return <PreWeldLocalization />; }
