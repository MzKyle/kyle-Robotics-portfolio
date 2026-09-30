import type { ProjectDetail } from "../../lib/portfolio";
import { Localized, T } from "../localized";
import { Pipeline, ProjectLink, SectionLabel, TechList } from "./project-elements";
import styles from "./projects.module.css";

function GeometryVisual() {
  // A geometric diagram, explicitly schematic rather than measured project output.
  const points = Array.from({ length: 13 * 8 }, (_, index) => {
    const u = index % 13;
    const v = Math.floor(index / 13);
    return { x: 185 + u * 18 + v * 11, y: 210 + u * 5 - v * 9 };
  });
  return (
    <figure className={styles.figure}>
      <div className={styles.geometryVisual}>
        <div className={styles.geometryHeader}><span>DEPTH → GEOMETRY</span><span>SCHEMATIC</span></div>
        <svg viewBox="0 0 640 430" role="img" aria-label="Point-cloud geometry schematic with an object above a reference plane / 点云、物体几何与参考平面示意">
          <g fill="none" stroke="currentColor" strokeWidth="1" className={styles.referencePlane}>
            <path d="M80 295 350 150 575 290 306 420Z" />
            <path d="M147 331 416 191M215 375 488 239M148 259 374 386M215 222 444 352M282 187 508 322" />
          </g>
          <g stroke="currentColor" strokeWidth="1.5" fill="none" className={styles.objectGeometry}>
            <path d="M185 210 262 147 478 207 401 273Z M185 210V307L401 370V273 M401 370 478 304V207" />
            <path d="M262 147V244L185 307M262 244 478 304" strokeDasharray="4 6" opacity=".4" />
          </g>
          <g fill="currentColor" className={styles.pointCloud}>{points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="1.7" />)}</g>
          <g fill="none" stroke="currentColor" className={styles.dimensionLines}>
            <path d="M510 218V315M503 218H517M503 315H517M164 207 122 147H73M297 392 236 412H146" />
          </g>
          <g fill="currentColor" className={styles.geometryText} fontSize="13"><text x="521" y="272">h</text><text x="73" y="135">Object geometry</text><text x="73" y="417">Reference plane</text><text x="430" y="126">Point cloud</text></g>
          <path d="M443 138 407 192" stroke="currentColor" className={styles.dimensionLines} />
        </svg>
        <p><T zh="深度数据 / 平面估计 / 物体几何" en="Depth data / plane estimation / object geometry" /></p>
      </div>
      <figcaption><span>FIG. 04</span><T zh="点云与几何示意 · 非测量结果" en="Point-cloud and geometry schematic · not measured output" /></figcaption>
    </figure>
  );
}

export function VolumeMeasurementSection({ project }: { project: ProjectDetail }) {
  return (
    <section className={styles.section} id="volume" aria-labelledby="volume-title">
      <SectionLabel number="04" year={project.year}>3D VISION</SectionLabel>
      <h2 className={styles.projectTitle} id="volume-title">{project.title}</h2>
      <p className={styles.subtitle}><Localized text={project.subtitle} /></p>
      <div className={styles.volumeLayout}>
        <div className={styles.volumeCopy}><Pipeline steps={["Depth Image", "Depth Filtering", "Point Cloud", "Plane Estimation", "Object Geometry", "Volume"]} vertical /><TechList items={["OpenCV", "Orbbec", "Point Cloud", "Geometry"]} /><ProjectLink slug={project.slug} /></div>
        <GeometryVisual />
      </div>
    </section>
  );
}
