import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { projects } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "Robot-Sim | 王凯豪项目案例" };
export default function Page() { return <ProjectCase project={projects[3]} previous={projects[2]} next={projects[4]} />; }
