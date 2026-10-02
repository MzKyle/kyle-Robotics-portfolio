import type { Metadata } from "next";
import { getProject, personalProjects } from "../../lib/portfolio";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { ProjectsIntro } from "../../components/projects/projects-intro";
import { SanyFeaturedExperience } from "../../components/projects/sany-featured-experience";
import { SelectedEngineeringGrid } from "../../components/projects/selected-engineering-grid";
import { PersonalEngineeringList } from "../../components/projects/personal-engineering-list";
import styles from "../../components/projects/projects.module.css";

export const metadata: Metadata = {
  title: "工程案例 | 王凯豪",
  description: "工业焊接机器人、工业视觉、机器人闭环与三维视觉工程案例，以及个人开源工程。",
};

export default function ProjectsPage() {
  return (
    <main>
      <SiteHeader active="projects" />
      <div className={styles.container}>
        <ProjectsIntro />
        <SanyFeaturedExperience project={getProject("sany-welding-robotics")!} />
        <SelectedEngineeringGrid projects={[
          getProject("waterbag-inspection")!,
          getProject("auto-aim")!,
          getProject("3d-volume-measurement")!,
        ]} />
        <PersonalEngineeringList projects={personalProjects} />
      </div>
      <SiteFooter />
    </main>
  );
}
