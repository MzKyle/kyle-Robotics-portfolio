import type { Metadata } from "next";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";
export const metadata: Metadata = { title: "DataScope Studio | 王凯豪项目案例" };
export default function Page() { return <ProjectCase {...getProjectWithNeighbors("datascope-studio")!} />; }
