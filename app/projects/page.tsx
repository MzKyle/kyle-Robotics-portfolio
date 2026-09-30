import type { Metadata } from "next";
import { getProject, personalProjects } from "../../lib/portfolio";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { ProjectsHero } from "../../components/projects/projects-hero";
import { SanyFeaturedExperience } from "../../components/projects/sany-featured-experience";
import { WaterbagProjectSection } from "../../components/projects/waterbag-project-section";
import { RoboMasterProjectSection } from "../../components/projects/robomaster-project-section";
import { VolumeMeasurementSection } from "../../components/projects/volume-measurement-section";
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
        <ProjectsHero />
        <SanyFeaturedExperience project={getProject("sany-welding-robotics")!} />
        <WaterbagProjectSection project={getProject("waterbag-inspection")!} />
        <RoboMasterProjectSection project={getProject("auto-aim")!} />
        <VolumeMeasurementSection project={getProject("3d-volume-measurement")!} />
        <PersonalEngineeringList projects={personalProjects} />
      </div>
      <SiteFooter />
    </main>
  );
}
