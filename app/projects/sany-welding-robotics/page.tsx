import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";

export const metadata: Metadata = {
  title: "工业焊接机器人系统工程 | 王凯豪工程案例",
  description: "经过脱敏的工业焊接机器人域控、时序对齐、高吞吐数据路径与空间纠偏工程案例。",
};

export default function Page() {
  return <ProjectCase {...getProjectWithNeighbors("sany-welding-robotics")!} />;
}
