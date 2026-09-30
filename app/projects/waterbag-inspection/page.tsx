import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "工业水样袋缺陷检测 | 王凯豪项目案例" };
export default function Page() { return <ProjectCase {...getProjectWithNeighbors("waterbag-inspection")!} />; }
