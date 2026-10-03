import styles from "./engineering-visuals.module.css";

type PointCloudSketchProps = {
  showTcp?: boolean;
  showAxes?: boolean;
  variant?: "registration" | "scan";
};

// A deterministic abstract distribution, unrelated to any workpiece or scan.
const cloud = Array.from({ length: 9 }, (_, row) => Array.from({ length: 15 }, (_, col) => {
  const x = 98 + col * 12 + row * 3;
  const y = 74 + row * 9 - Math.sin(col * .42) * 17;
  return { x, y, row, col };
})).flat().filter(({ row, col }) => ((col - 7) / 7.7) ** 2 + ((row - 4) / 4.9) ** 2 < 1);

export function PointCloudSketch({ showTcp = true, showAxes = true, variant = "registration" }: PointCloudSketchProps) {
  return <svg className={`${styles.diagram} ${styles.pointCloud}`} viewBox="0 0 480 214" role="img" aria-label={variant === "registration" ? "概念点云图：参考点云与实时观测的空间配准 / Conceptual point clouds: spatial registration of a reference and an observation" : "概念三维点云 / Conceptual 3D point cloud"}>
    <title>{`${variant === "registration" ? "Pre-weld spatial registration" : "Abstract 3D scan"} — conceptual diagram`}</title>
    <desc>{`Abstract point distributions ${variant === "registration" ? "represent a reference cloud and an observation" : "represent a 3D scan"}. ${showAxes ? "Robot coordinate axes are shown. " : ""}${showTcp ? "A TCP marker shows the spatial handoff. " : ""}This does not depict a real workpiece, calibration, or measured result.`}</desc>
    {variant === "registration" && <>
      <circle cx="24" cy="21" r="3" className={styles.referenceFill} /><text x="36" y="25" className={styles.diagramNote}>REFERENCE</text>
      <circle cx="170" cy="21" r="3" className={styles.primaryFill} /><text x="182" y="25" className={styles.diagramNote}>OBSERVATION</text>
      {cloud.map(({ x, y, row, col }) => <circle key={`reference-${row}-${col}`} cx={x - 18} cy={y + 13} r="2" className={styles.referenceFill} />)}
    </>}
    {cloud.map(({ x, y, row, col }) => <circle key={`${row}-${col}`} cx={x} cy={y} r="2" className={styles.cloudFill} />)}
    {variant === "registration" && <g className={styles.correspondences}>
      {[cloud[18], cloud[42], cloud[67]].map(({ x, y }, index) => <g key={index}>
        <path d={`M${x - 18} ${y + 13}L${x} ${y}`} className={styles.eventLine} />
        <circle cx={x} cy={y} r="3" className={styles.eventFill} />
      </g>)}
    </g>}
    {showAxes && <g>
      <path d="M37 177H298M37 177V49M37 177L65 149M293 173l5 4-5 4M33 54l4-5 4 5" className={styles.axis} />
      <text x="306" y="182">x</text><text x="33" y="41">z</text><text x="69" y="148">y</text>
      <text x="22" y="207" className={styles.diagramNote}>ROBOT FRAME</text>
    </g>}
    {showTcp && <g>
      <path d="M280 88C316 77 336 111 377 122M371 116l6 6-8 2" className={styles.transformLine} />
      <text x="308" y="55" className={styles.diagramNote}>transform</text>
      <path d="M393 128H451M393 128V83M393 128L420 101M446 124l5 4-5 4M389 88l4-5 4 5" className={styles.tcpAxis} />
      <circle cx="393" cy="128" r="4" className={styles.primaryFill} />
      <text x="458" y="133">x</text><text x="389" y="75">z</text><text x="424" y="99">y</text>
      <text x="380" y="156" className={styles.diagramLabel}>TCP</text>
      <text x="347" y="207" className={styles.diagramNote}>POSE / Δheight</text>
    </g>}
  </svg>;
}
