import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { projects } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "MascotMate | 王凯豪项目案例" };
export default function Page() { return <ProjectCase project={projects[4]} previous={projects[3]} next={projects[0]} />; }
