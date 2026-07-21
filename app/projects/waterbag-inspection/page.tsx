import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { projects } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "工业水样袋缺陷检测 | 王凯豪项目案例" };
export default function Page() { return <ProjectCase project={projects[0]} previous={projects[4]} next={projects[1]} />; }
