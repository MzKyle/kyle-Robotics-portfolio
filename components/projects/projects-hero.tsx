import { T } from "../localized";
import styles from "./projects.module.css";

export function ProjectsHero() {
  return (
    <section className={styles.hero} aria-labelledby="projects-title">
      <div className={styles.heroLabel}><span>PROJECTS</span><span>01 / WORK</span></div>
      <h1 id="projects-title"><span className="lang-zh"><span className={styles.heroLine}>在机器人、视觉</span><span className={styles.heroLine}>与工业软件之间，</span><span className={styles.heroLine}>构建工程系统。</span></span><span className="lang-en">Engineering systems built across robotics, vision and industrial software.</span></h1>
      <div className={styles.heroBottom}>
        <p><T zh="我主要关注机器人软件、工业视觉、三维感知与复杂系统集成。" en="My work focuses on robotics software, industrial vision, 3D perception and complex system integration." /></p>
        <ul aria-label="技术领域 / Areas of practice"><li>Robotics</li><li>Industrial Vision</li><li>C++ / ROS 2</li><li>3D Vision</li></ul>
      </div>
      <a className={styles.heroIndex} href="#sany"><T zh="精选工程经历与项目" en="Selected experience & projects" /><span aria-hidden="true">↓</span></a>
    </section>
  );
}
