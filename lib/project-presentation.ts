import type { LocalizedText, ProjectDetail } from "./portfolio";

// Display names shared by cards, case headings, résumé and presentation routes.
// The authored narrative and recorded results remain in portfolio.ts.
export const projectNames: Record<string, LocalizedText> = {
  "sany-welding-robotics": { zh: "焊接机器人系统化的设计开发", en: "Welding robotics: system design & development" },
  "waterbag-inspection": { zh: "工业水样袋视觉质检", en: "Industrial waterbag inspection" },
  "auto-aim": { zh: "RoboMaster 视觉自瞄", en: "RoboMaster vision auto-aim" },
  "3d-volume-measurement": { zh: "深度相机视觉测算物体体积", en: "Depth-camera object volume measurement" },
};

export function projectName(project: Pick<ProjectDetail, "slug" | "title">): LocalizedText {
  return projectNames[project.slug] ?? { zh: project.title, en: project.title };
}
