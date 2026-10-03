import type { Metadata } from "next";
import { projectNames } from "../../../lib/project-presentation";
import { ProjectCase } from "../../../components/project-case";
import { getProjectWithNeighbors } from "../../../lib/portfolio";

export const metadata: Metadata = { title: projectNames["auto-aim"].zh + " | 王凯豪工程案例" };

export default function Page() {
  return <ProjectCase {...getProjectWithNeighbors("auto-aim")!} />;
}
