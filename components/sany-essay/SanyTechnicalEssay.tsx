import Link from "next/link";
import type { EssayFigureId } from "../../lib/sany-essay-content";
import { sanyEssayChapters } from "../../lib/sany-essay-content";
import { sourceArticle } from "../../lib/sany-source-article";
import { T } from "../localized";
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
import { ReadingProgress } from "./ReadingProgress";
import { CaseChapter, CaseReading, CaseTakeaway } from "./CaseLayout";
import { CaseHero } from "./CaseHero";
import { ClockMappingDiagram } from "./SystemTimeline";
import { SourceArticleContent } from "./SourceArticleContent";

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

export function SanyTechnicalEssay() {
  return <main className="sany-technical-essay">
    <SiteHeader active="projects" />
    <ReadingProgress />
    <article className="case-container">
      <CaseHero />

      <div className="essay-source-abstract"><SourceArticleContent id="abstract" zh={sourceArticle.zh.abstract} en={sourceArticle.en.abstract} figure={id => <EssayFigure id={id} />} /></div>

      <CaseReading className="essay-intro"><p><T zh="这篇文章沿着问题本源、运动先验、问题降维、思路转换、架构重构、双时间轴、误差与演进、系统设计方法论的顺序推导。交互图仅用于解释那些仅靠文字不容易看清的时间关系。" en="The essay follows the source article's argument: sampling mismatch, motion prior, problem reduction, temporal selection, ISP redesign, dual timelines, error and evolution, and systems method. Interactive figures explain temporal relationships that are hard to see in prose alone." /></p></CaseReading>

      {sanyEssayChapters.map((chapter, index) => <CaseChapter chapter={{ ...chapter, title: { zh: sourceArticle.zh.sections[index].title, en: sourceArticle.en.sections[index].title } }} key={chapter.id}>
        <SourceArticleContent id={chapter.id} zh={sourceArticle.zh.sections[index].tokens} en={sourceArticle.en.sections[index].tokens} figure={id => <EssayFigure id={id} />} />
        {chapter.id === "temporal-selection" && <CaseReading><CaseTakeaway><T zh="补充说明：约 40% 是从 4.17 ms 到 2.5 ms 的理想最近邻时间量化上界降幅，并非实测稳像提升率；200 Hz 为 RAW 设计目标。" en="Additional context: about 40% is the reduction in the ideal nearest-frame quantization bound from 4.17 ms to 2.5 ms, not a measured stabilization improvement. 200 Hz is the RAW design target." /></CaseTakeaway></CaseReading>}
        {chapter.id === "error-evolution" && <CaseReading><CaseTakeaway><T zh="补充说明：高频伺服状态、PTP 亚微秒同步与全帧率融合属于原文的未来演进条件，不是本项目已实现成果。具体同步精度仍需设备支持与实验验证。" en="Additional context: high-rate servo state, sub-microsecond PTP synchronization, and full-rate fusion are future conditions in the source article, not implemented results. Actual synchronization accuracy depends on device support and experimental verification." /></CaseTakeaway></CaseReading>}
      </CaseChapter>)}

      <section className="essay-source-conclusion" id="conclusion" aria-labelledby="source-conclusion-title">
        <CaseReading><h2 id="source-conclusion-title"><T zh={sourceArticle.zh.sections[8].title} en={sourceArticle.en.sections[8].title} /></h2></CaseReading>
        <SourceArticleContent id="conclusion" zh={sourceArticle.zh.sections[8].tokens} en={sourceArticle.en.sections[8].tokens} figure={id => <EssayFigure id={id} />} />
      </section>

      <footer className="essay-footer"><p><T zh="公开边界：文中不展示私有通信协议、客户信息、工艺参数、内部源码与未公开设备规格。交互中的示例事件、时钟漂移速率和波形均为概念模拟；120–200 Hz 相机范围、约 60 Hz 机器人状态、约 200–250 ms 历史窗口与约 64 帧容量按已提供材料表述。" en="Public boundary: proprietary protocols, client information, welding parameters, internal source, and unpublished device specifications are omitted. Interactive event times, clock drift rates, and waveforms are conceptual; the roughly 60 Hz robot state, 120–200 Hz camera range, 200–250 ms history, and about 64-frame capacity follow the supplied material." /></p><Link href="/projects/sany-welding-robotics"><T zh="返回 SANY 项目概览" en="Return to SANY project overview" /> →</Link></footer>
    </article>
    <SiteFooter />
  </main>;
}
