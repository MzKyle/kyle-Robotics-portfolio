import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { projects } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "DataScope Studio | 王凯豪项目案例" };
export default function Page() { return <ProjectCase project={projects[2]} previous={projects[1]} next={projects[3]} />; }
