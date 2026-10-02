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
import { SanyMedia } from "./SanyMedia";
import { ReadingProgress } from "./ReadingProgress";
import { CaseChapter, CaseEquation, CaseReading, CaseTakeaway } from "./CaseLayout";
import { CaseHero } from "./CaseHero";
import { ClockMappingDiagram } from "./SystemTimeline";

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
    case "clock-mapping": return <ClockMappingDiagram />;
    case "system": return <SystemTimeline />;
    case "error": return <ErrorBudget />;
    case "evolution": return <EvolutionTimeline />;
    case "method": return <MethodologyEnding />;
  }
}

function ReadingBlock({ block }: { block: Exclude<EssayBlock, { kind: "figure" } | { kind: "media" }> }) {
  switch (block.kind) {
    case "p": return <p className="essay-paragraph"><Localized text={block.text} /></p>;
    case "subhead": return <h3 className="essay-subhead"><Localized text={block.text} /></h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag className="essay-body-list">{block.items.map((item) => <li key={item.en}><Localized text={item} /></li>)}</Tag>;
    }
    case "formula": return <CaseEquation expression={block.expression} caption={block.caption} />;
    case "note": return <CaseTakeaway><Localized text={block.text} /></CaseTakeaway>;
  }
}

// Group prose into one reading column. Figures remain siblings in the shared grid,
// so they expand to the right without a centering transform or nested breakout.
function ChapterContent({ blocks }: { blocks: EssayBlock[] }) {
  const groups: EssayBlock[][] = [];
  for (const block of blocks) {
    const previous = groups[groups.length - 1];
    if (block.kind === "figure" || block.kind === "media" || !previous || previous[0].kind === "figure" || previous[0].kind === "media") groups.push([block]);
    else previous.push(block);
  }
  return groups.map((group, index) => {
    const first = group[0];
    if (first.kind === "media") return <SanyMedia name={first.name} caption={first.caption} key={index} />;
    if (first.kind === "figure") {
      const figure = <EssayFigure id={first.id} />;
      return first.id === "transition" || first.id === "method" ? <CaseReading key={index}>{figure}</CaseReading> : <div className="case-figure-slot" key={index}>{figure}</div>;
    }
    return <CaseReading key={index}>{group.map((block, blockIndex) => block.kind !== "figure" && block.kind !== "media" && <ReadingBlock block={block} key={blockIndex} />)}</CaseReading>;
  });
}

export function SanyTechnicalEssay() {
  return <main className="sany-technical-essay">
    <SiteHeader active="projects" />
    <ReadingProgress />
    <article className="case-container">
      <CaseHero />

      <CaseReading className="essay-intro"><p><T zh="这篇文章沿着问题本源、运动先验、问题降维、思路转换、架构重构、双时间轴、误差与演进、系统设计方法论的顺序推导。交互图仅用于解释那些仅靠文字不容易看清的时间关系。" en="The essay follows the source article's argument: sampling mismatch, motion prior, problem reduction, temporal selection, ISP redesign, dual timelines, error and evolution, and systems method. Interactive figures explain temporal relationships that are hard to see in prose alone." /></p></CaseReading>

      {sanyEssayChapters.map((chapter) => <CaseChapter chapter={chapter} key={chapter.id}><ChapterContent blocks={chapter.blocks} /></CaseChapter>)}

      <footer className="essay-footer"><p><T zh="公开边界：文中不展示私有通信协议、客户信息、工艺参数、内部源码与未公开设备规格。交互中的示例事件、时钟漂移速率和波形均为概念模拟；120–200 Hz 相机范围、约 60 Hz 机器人状态、约 200–250 ms 历史窗口与约 64 帧容量按已提供材料表述。" en="Public boundary: proprietary protocols, client information, welding parameters, internal source, and unpublished device specifications are omitted. Interactive event times, clock drift rates, and waveforms are conceptual; the roughly 60 Hz robot state, 120–200 Hz camera range, 200–250 ms history, and about 64-frame capacity follow the supplied material." /></p><Link href="/projects/sany-welding-robotics"><T zh="返回 SANY 项目概览" en="Return to SANY project overview" /> →</Link></footer>
    </article>
    <SiteFooter />
  </main>;
}
