import { repositoryArchitectures } from "../lib/repository-architecture";
import { Localized, T } from "./localized";

export function ArchitecturePreview({ slug }: { slug: string }) {
  const architecture = repositoryArchitectures[slug];
  if (!architecture) return null;
  return <div className="architecture-preview" aria-label={architecture.title.zh + " / " + architecture.title.en}>
    <span className="architecture-label">SYSTEM / {slug.toUpperCase()}</span>
    <div className="architecture-preview-input">{architecture.entries.map(node => <span key={node.name}>{node.name}</span>)}</div>
    <div className="architecture-preview-connector" aria-hidden="true"><i /><i /></div>
    <div className="architecture-preview-core"><span>CORE</span><strong>{architecture.core.name}</strong><p><Localized text={architecture.core.detail} /></p></div>
    <div className="architecture-preview-connector architecture-preview-connector-down" aria-hidden="true"><i /><i /><i /></div>
    <div className="architecture-preview-output">{architecture.modules.map(name => <span key={name}>{name}</span>)}</div>
    <a className="architecture-preview-source" href={architecture.source} target="_blank" rel="noreferrer"><T zh="仓库架构" en="Repository architecture" /> <code>{architecture.revision}</code> ↗</a>
  </div>;
}

export function RepositoryArchitectureFigure({ slug }: { slug: string }) {
  const architecture = repositoryArchitectures[slug];
  if (!architecture) return null;
  return <figure className="repository-architecture">
    <div className="repository-architecture-grid">
      <div className="architecture-node-group"><span className="architecture-label"><Localized text={architecture.entryLabel} /></span>{architecture.entries.map(node => <div className="architecture-node" key={node.name}><strong>{node.name}</strong><p><Localized text={node.detail} /></p></div>)}</div>
      <span className="architecture-direction" aria-hidden="true">→</span>
      <div className="architecture-node-group architecture-core-group"><span className="architecture-label">CORE</span><div className="architecture-node architecture-core-node"><strong>{architecture.core.name}</strong><p><Localized text={architecture.core.detail} /></p><ul>{architecture.modules.map(name => <li key={name}>{name}</li>)}</ul></div></div>
      <span className="architecture-direction" aria-hidden="true">→</span>
      <div className="architecture-node-group"><span className="architecture-label"><Localized text={architecture.outputLabel} /></span>{architecture.outputs.map(node => <div className="architecture-node" key={node.name}><strong>{node.name}</strong><p><Localized text={node.detail} /></p></div>)}</div>
    </div>
    <figcaption><T zh="根据公开仓库架构文档整理。" en="Adapted from the public repository architecture documentation." /> <a href={architecture.source} target="_blank" rel="noreferrer"><T zh="查看架构来源" en="Architecture source" /> <code>{architecture.revision}</code> ↗</a></figcaption>
  </figure>;
}
