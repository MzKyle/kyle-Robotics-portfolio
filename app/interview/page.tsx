import type { Metadata } from "next";
import Link from "next/link";
import { InterviewPresentation } from "../../components/interview-presentation";
import { Localized, T } from "../../components/localized";
import { SiteFooter, SiteHeader } from "../../components/site-shell";
import { flagshipProjects, interviewTracks, type InterviewTrackKey } from "../../lib/portfolio";

export const metadata: Metadata = {
  title: "Interview Mode | 王凯豪工程作品集",
  description: "按机器人软件、工业视觉、计算机视觉或综合技术面选择工程案例讲解顺序。",
};

function isTrack(value: string | undefined): value is InterviewTrackKey {
  return value !== undefined && value in interviewTracks;
}

export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ track?: string }> }) {
  const { track: requestedTrack } = await searchParams;
  const trackKey = isTrack(requestedTrack) ? requestedTrack : undefined;

  if (trackKey) {
    const track = interviewTracks[trackKey];
    const orderedProjects = track.slugs.map((slug) => flagshipProjects.find((project) => project.slug === slug)).filter((project): project is (typeof flagshipProjects)[number] => Boolean(project));
    return <main className="interview-mode"><SiteHeader active="interview" /><InterviewPresentation trackKey={trackKey} track={track} projects={orderedProjects} /><SiteFooter /></main>;
  }

  return (
    <main className="interview-mode">
      <SiteHeader active="interview" />
      <section className="interview-selector">
        <header><p>INTERVIEW MODE</p><h1><T zh="选择讲解重点" en="Choose a focus" /></h1><span><T zh="同一组工程案例，按岗位调整讲解顺序。进入路线后可用方向键切换案例。" en="The same engineering cases, reordered for the role. Use arrow keys to move between cases." /></span></header>
        <div className="interview-track-grid">
          {(Object.entries(interviewTracks) as Array<[InterviewTrackKey, (typeof interviewTracks)[InterviewTrackKey]]>).map(([key, track], index) => <Link href={`/interview?track=${key}`} key={key}><span>{String(index + 1).padStart(2, "0")}</span><div><small><Localized text={track.subtitle} /></small><h2><Localized text={track.title} /></h2><ol>{track.slugs.map((slug, itemIndex) => <li key={slug}><b>{String(itemIndex + 1).padStart(2, "0")}</b>{flagshipProjects.find((project) => project.slug === slug)?.title}</li>)}</ol></div><strong><T zh="开始路线" en="Start route" /> →</strong></Link>)}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
