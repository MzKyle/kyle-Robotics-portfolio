import { PortfolioImage as Image } from "../portfolio-image";
import Link from "next/link";
import type { ProjectDetail } from "../../lib/portfolio";
import { projectMedia } from "../../lib/project-media";
import { T } from "../localized";
import { SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

const cardCopy: Record<string, {
  category: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  alt: string;
  image?: string;
  imageNote?: { zh: string; en: string };
  tech: string[];
}> = {
  "waterbag-inspection": {
    category: "INDUSTRIAL VISION",
    title: { zh: "工业水样袋视觉质检", en: "Industrial Vision Inspection" },
    description: { zh: "多光源成像、C++ 实时检测、顺序分拣与结果追溯。", en: "Multi-light imaging, C++ inspection, ordered sorting and traceability." },
    alt: "工业水样袋视觉质检装置实拍",
    tech: ["C++", "Camera", "PLC", "ONNX"],
  },
  "auto-aim": {
    category: "ROBOTICS",
    title: { zh: "RoboMaster 视觉自瞄", en: "RoboMaster Auto-Aiming" },
    description: { zh: "构建目标检测、状态估计与云台控制的实时视觉闭环。", en: "A real-time vision loop for target detection, state estimation and gimbal control." },
    alt: "RoboMaster 机器人及视觉开发现场实拍",
    tech: ["ROS 2", "C++", "OpenCV", "EKF"],
  },
  "3d-volume-measurement": {
    category: "3D VISION",
    title: { zh: "三维视觉与点云测量", en: "3D Vision / Point Cloud" },
    description: { zh: "以深度相机与点云几何处理倾斜及超薄物体的体积测量。", en: "Depth-camera and point-cloud geometry for tilted and ultra-thin object measurement." },
    alt: "深度相机点云与体积测量的概念示意，非项目实拍",
    image: "/images/projects/point-cloud-index.svg",
    imageNote: { zh: "点云几何示意", en: "Point-cloud geometry illustration" },
    tech: ["Orbbec", "OpenCV", "Point Cloud", "RANSAC"],
  },
};

export function SelectedEngineeringGrid({ projects }: { projects: ProjectDetail[] }) {
  return (
    <section className={styles.selectedWork} aria-labelledby="selected-title">
      <SectionLabel number="02">SELECTED ENGINEERING WORK</SectionLabel>
      <h2 className={styles.selectedHeading} id="selected-title"><T zh="精选工程项目" en="Selected engineering work" /></h2>
      <div className={styles.selectedGrid}>
        {projects.map((project, index) => {
          const copy = cardCopy[project.slug];
          if (!copy) return null;
          return (
            <Link className={styles.selectedCard} href={`/projects/${project.slug}`} aria-label={`${copy.title.zh} · ${copy.title.en}`} key={project.slug}>
              <div className={styles.cardMeta}><span>{String(index + 1).padStart(2, "0")}</span><span>{copy.category}</span></div>
              <div className={styles.cardImageLink}>
                <div className={styles.cardImage}>
                  <Image src={copy.image ?? project.image!} alt={copy.alt} fill unoptimized sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectFit: "cover", objectPosition: projectMedia[project.slug]?.coverPosition ?? "center" }} />
                </div>
              </div>
              <span className={styles.cardImageNote} aria-hidden={!copy.imageNote}>{copy.imageNote ? <T {...copy.imageNote} /> : "\u00a0"}</span>
              <h3><T {...copy.title} /></h3>
              <p className={styles.cardDescription}><T {...copy.description} /></p>
              <p className={styles.cardResult}>{project.homeEvidence?.map((evidence, evidenceIndex) => <span key={evidence.value}>{evidenceIndex > 0 && " · "}{evidence.value} <T {...evidence.label} /></span>)}</p>
              <TechList items={copy.tech} />
              <span className={styles.cardExplore}><T zh="查看项目" en="Explore" /><span aria-hidden="true">→</span></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
