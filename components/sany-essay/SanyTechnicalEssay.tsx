import Link from "next/link";
import type { EssayBlock, EssayFigureId } from "../../lib/sany-essay-content";
import { sanyEssayChapters } from "../../lib/sany-essay-content";
import { Localized, T } from "../localized";
import { SiteFooter, SiteHeader } from "../site-shell";
import { SamplingMismatch } from "./SamplingMismatch";
import { MotionDecomposition } from "./MotionDecomposition";
import { PhaseRawMatcher } from "./PhaseRawMatcher";
import { IspPipelineToggle } from "./IspPipelineToggle";
import { RawHistoryBuffer } from "./RawHistoryBuffer";
import { DualClockPlayground } from "./DualClockPlayground";
import { SystemTimeline } from "./SystemTimeline";
import { ErrorBudget } from "./ErrorBudget";
import { EvolutionTimeline, MethodologyEnding, ReductionDiagram, TemporalTransition } from "./EssayDiagrams";
import { SanyHeroVisual, SanyMedia } from "./SanyMedia";
import { ReadingProgress } from "./ReadingProgress";

function EssayFigure({ id }: { id: EssayFigureId }) {
  switch (id) {
    case "sampling": return <SamplingMismatch />;
    case "motion": return <MotionDecomposition />;
    case "reduction": return <ReductionDiagram />;
    case "matching": return <PhaseRawMatcher />;
    case "transition": return <TemporalTransition />;
    case "isp": return <IspPipelineToggle />;
    case "buffer": return <RawHistoryBuffer />;
    case "clock": return <DualClockPlayground />;
    case "system": return <SystemTimeline />;
    case "error": return <ErrorBudget />;
    case "evolution": return <EvolutionTimeline />;
    case "method": return <MethodologyEnding />;
  }
}

function EssayContentBlock({ block }: { block: EssayBlock }) {
  switch (block.kind) {
    case "p": return <p className="essay-paragraph"><Localized text={block.text} /></p>;
    case "subhead": return <h3 className="essay-subhead"><Localized text={block.text} /></h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag className="essay-body-list">{block.items.map((item) => <li key={item.en}><Localized text={item} /></li>)}</Tag>;
    }
    case "formula": return <div className="essay-formula"><code>{block.expression}</code>{block.caption && <span><Localized text={block.caption} /></span>}</div>;
    case "note": return <aside className="essay-note"><Localized text={block.text} /></aside>;
    case "figure": return <div className={`essay-breakout essay-breakout-${block.id}`}><EssayFigure id={block.id} /></div>;
    case "media": return <div className="essay-media-breakout"><SanyMedia name={block.name} caption={block.caption} /></div>;
  }
}

export function SanyTechnicalEssay() {
  return <main className="sany-technical-essay">
    <SiteHeader active="projects" />
    <ReadingProgress />
    <article>
      <header className="essay-hero">
        <div className="essay-hero-copy"><Link className="essay-back" href="/projects/sany-welding-robotics">← <T zh="SANY 项目概览" en="SANY project overview" /></Link><p className="essay-overline">SANY INTERNSHIP · ROBOTICS SOFTWARE</p><h1><T zh="基于运动相位的时间域稳像设计" en="Phase-aware Temporal Stabilization" /></h1><p className="essay-hero-english">Phase-aware Temporal Stabilization for Robotic Welding Vision</p><p className="essay-hero-summary"><T zh="面对约 60 Hz FANUC TCP 状态与最高约 200 Hz RAW 相机之间的采样失配，通过运动先验将全轨迹重建降维为关键相位时间估计，再从高频 RAW 历史中选取同相位真实帧，并通过 ISP 后处理完成稳定熔池观测。" en="Faced with roughly 60 Hz FANUC TCP state and RAW camera capability up to about 200 Hz, this design uses motion priors to reduce full-trajectory reconstruction to key-phase timing, selects real same-phase frames from high-rate RAW history, and processes only those frames through ISP for stable weld-pool observation." /></p><div className="essay-hero-meta"><span><T zh="8 章技术推导" en="8 technical chapters" /></span><span><T zh="4 个核心交互" en="4 core interactions" /></span><span><T zh="公开版 · 设备细节脱敏" en="Public edition · device details sanitized" /></span></div></div>
        <SanyHeroVisual />
      </header>

      <div className="essay-intro"><p><T zh="这篇文章沿着问题本源、运动先验、问题降维、思路转换、架构重构、双时间轴、误差与演进、系统设计方法论的顺序推导。交互图仅用于解释那些仅靠文字不容易看清的时间关系。" en="The essay follows the source article's argument: sampling mismatch, motion prior, problem reduction, temporal selection, ISP redesign, dual timelines, error and evolution, and systems method. Interactive figures explain temporal relationships that are hard to see in prose alone." /></p></div>

      {sanyEssayChapters.map((chapter) => <section className="essay-chapter" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-title`}><header className="essay-chapter-head"><span>{chapter.number} / 08</span><h2 id={`${chapter.id}-title`}><Localized text={chapter.title} /></h2><p><Localized text={chapter.deck} /></p></header><div className="essay-chapter-content">{chapter.blocks.map((block, index) => <EssayContentBlock block={block} key={`${chapter.id}-${index}`} />)}</div></section>)}

      <footer className="essay-footer"><p><T zh="公开边界：文中不展示私有通信协议、客户信息、工艺参数、内部源码与未公开设备规格。交互中的示例事件、时钟漂移速率和波形均为概念模拟；120–200 Hz 相机范围、约 60 Hz 机器人状态、约 200–250 ms 历史窗口与约 64 帧容量按已提供材料表述。" en="Public boundary: proprietary protocols, client information, welding parameters, internal source, and unpublished device specifications are omitted. Interactive event times, clock drift rates, and waveforms are conceptual; the roughly 60 Hz robot state, 120–200 Hz camera range, 200–250 ms history, and about 64-frame capacity follow the supplied material." /></p><Link href="/projects/sany-welding-robotics"><T zh="返回 SANY 项目概览" en="Return to SANY project overview" /> →</Link></footer>
    </article>
    <SiteFooter />
  </main>;
}
