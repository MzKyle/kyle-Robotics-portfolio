import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";

export const metadata: Metadata = { title: "RoboMaster 视觉闭环自瞄系统 | 王凯豪项目案例" };

export default function Page() {
  return <ProjectCase {...getProjectWithNeighbors("auto-aim")!} />;
}
