import Link from "next/link";
import Image from "next/image";
import type { ProjectDetail } from "../lib/portfolio";
import { Localized, T } from "./localized";

function ProjectMeta({ project }: { project: ProjectDetail }) {
  return (
    <p className="engineering-card-meta">
      <span>{project.index}</span>
      <Localized text={project.category} />
    </p>
  );
}

function ProjectTech({ project }: { project: ProjectDetail }) {
  const tech = project.homeTech ?? project.tech.slice(0, 4);

  return (
    <ul className="engineering-card-tech" aria-label="Core technologies">
      {tech.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function ProjectEvidence({ project, featured = false }: { project: ProjectDetail; featured?: boolean }) {
  const evidence = project.homeEvidence ?? project.outcomes.slice(0, featured ? 3 : 2).map((item) => ({ value: item.value, label: item.label }));

  return (
    <dl className={`engineering-card-evidence${featured ? " engineering-card-evidence-featured" : ""}`}>
      {evidence.map((item) => (
        <div key={`${item.value}-${item.label.en}`}>
          <dt>{item.value}</dt>
          <dd><Localized text={item.label} /></dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectLinkLabel() {
  return (
    <footer className="engineering-card-link">
      <T zh="查看案例" en="View case" />
      <span aria-hidden="true">→</span>
    </footer>
  );
}

export function FeaturedCaseCard({ project }: { project: ProjectDetail }) {
  const image = project.homeImage ?? project.image;
  const title = project.title.replace(/^SANY\s+/, "");

  return (
    <Link className="engineering-featured-card" href={`/projects/${project.slug}`} aria-label={`${project.title} — ${project.subtitle.zh}`}>
      <article className="engineering-featured-copy">
        <ProjectMeta project={project} />
        <p className="engineering-featured-brand">SANY</p>
        <h3>{title}</h3>
        <h4><Localized text={project.subtitle} /></h4>
        <p className="engineering-card-description"><Localized text={project.homeDescription ?? project.summary} /></p>
        <ProjectTech project={project} />
        <ProjectEvidence project={project} featured />
        <ProjectLinkLabel />
      </article>
      <figure className="engineering-featured-visual">
        {image && (
          <Image
            src={image}
            alt={`${project.title} — ${project.imageNote.zh}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 760px) 100vw, 42vw"
            style={{ objectFit: project.homeImageMode ?? project.imageMode ?? "cover", objectPosition: project.homeImagePosition }}
          />
        )}
      </figure>
    </Link>
  );
}

function SecondaryVisual({ project }: { project: ProjectDetail }) {
  const image = project.homeImage ?? project.image;

  if (image) {
    return (
      <figure className={`engineering-secondary-visual engineering-secondary-visual-${project.homeImageMode ?? project.imageMode ?? "cover"}`}>
        <Image
          src={image}
          alt={`${project.title} — ${project.imageNote.zh}`}
          fill
          unoptimized
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{ objectPosition: project.homeImagePosition }}
        />
      </figure>
    );
  }

  const steps = project.homeVisualSteps ?? project.flow.slice(0, 3);

  return (
    <div className="engineering-secondary-visual engineering-secondary-schematic" role="img" aria-label={`${project.title} visual pipeline`}>
      <ol>
        {steps.map((step, index) => (
          <li key={step.en}>
            <span>0{index + 1}</span>
            <strong><Localized text={step} /></strong>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SecondaryCaseCard({ project }: { project: ProjectDetail }) {
  return (
    <Link className="engineering-secondary-card" href={`/projects/${project.slug}`} aria-label={`${project.title} — ${project.subtitle.zh}`}>
      <SecondaryVisual project={project} />
      <article className="engineering-secondary-copy">
        <ProjectMeta project={project} />
        <h3>{project.title}</h3>
        <h4><Localized text={project.subtitle} /></h4>
        <p className="engineering-card-description"><Localized text={project.homeDescription ?? project.summary} /></p>
        <ProjectTech project={project} />
        <ProjectEvidence project={project} />
        <ProjectLinkLabel />
      </article>
    </Link>
  );
}
