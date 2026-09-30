import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";

export const metadata: Metadata = {
  title: "3D Volume Measurement | 王凯豪工程案例",
  description: "基于深度相机、点云、RANSAC 与几何补偿的物流体积测量系统。",
};

export default function Page() {
  return <ProjectCase {...getProjectWithNeighbors("3d-volume-measurement")!} />;
}
