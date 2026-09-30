import Link from "next/link";
import type { LocalizedText } from "../lib/portfolio";
import { Localized, T } from "./localized";
import { PreferenceControl } from "./preferences";
import { MobileNavigation } from "./site-navigation";

const nav = [
  { href: "/projects", label: { zh: "项目", en: "Projects" }, key: "projects" },
  { href: "/experience", label: { zh: "工作经历", en: "Experience" }, key: "experience" },
  { href: "/writing", label: { zh: "技术文章", en: "Writing" }, key: "writing" },
  { href: "/about", label: { zh: "关于我", en: "About" }, key: "about" },
];

export function SiteHeader({ active }: { active: string }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" href="/" aria-label="返回首页 / Back home">
          <span className="brand-mark" aria-hidden="true">KW</span>
          <span><T zh="王凯豪" en="Kyle Wang" /></span>
        </Link>
        <nav className="primary-nav" aria-label="主导航 / Main navigation">
          {nav.map((item) => (
            <Link aria-current={active === item.key ? "page" : undefined} href={item.href} key={item.key}><Localized text={item.label} /></Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link aria-current={active === "interview" ? "page" : undefined} href="/interview"><T zh="面试模式" en="Interview" /></Link>
          <Link className="header-resume" aria-current={active === "resume" ? "page" : undefined} href="/resume"><T zh="简历" en="Resume" /> <span aria-hidden="true">↗</span></Link>
          <PreferenceControl />
        </div>
        <MobileNavigation>
          <nav aria-label="移动端导航 / Mobile navigation">
            {nav.map((item) => <Link aria-current={active === item.key ? "page" : undefined} href={item.href} key={item.key}><Localized text={item.label} /><span aria-hidden="true">→</span></Link>)}
            <Link aria-current={active === "interview" ? "page" : undefined} href="/interview"><T zh="面试模式" en="Interview" /><span aria-hidden="true">→</span></Link>
            <Link aria-current={active === "resume" ? "page" : undefined} href="/resume"><T zh="简历" en="Resume" /><span aria-hidden="true">↗</span></Link>
          </nav>
          <PreferenceControl />
        </MobileNavigation>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-intro">
        <span className="brand-mark" aria-hidden="true">KW</span>
        <div><strong><T zh="王凯豪" en="Kyle Wang" /></strong><p><T zh="机器人软件开发工程师" en="Robotics Software Engineer" /></p></div>
      </div>
      <div className="footer-links">
        <div><span><T zh="页面导航" en="NAVIGATION" /></span><Link href="/projects"><T zh="项目案例" en="Projects" /></Link><Link href="/interview"><T zh="面试模式" en="Interview mode" /></Link><Link href="/experience"><T zh="工作经历" en="Experience" /></Link><Link href="/writing"><T zh="技术文章" en="Writing" /></Link></div>
        <div><span><T zh="联系方式" en="CONNECT" /></span><a href="https://github.com/MzKyle" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://mzkyle.blog.csdn.net" target="_blank" rel="noreferrer">CSDN ↗</a><a href="mailto:2972689924@qq.com"><T zh="邮箱" en="Email" /> ↗</a></div>
        <div><span><T zh="简历" en="DOCUMENT" /></span><Link href="/resume"><T zh="在线简历" en="Online resume" /></Link><a href="/resume.pdf" target="_blank" rel="noreferrer"><T zh="PDF 简历" en="PDF resume" /> ↗</a></div>
      </div>
      <div className="footer-base"><span>© 2026 <T zh="王凯豪" en="Kyle Wang" /></span><span><T zh="围绕真实机器人软件工程实践构建" en="Built around real robotics engineering work." /></span><Link href="/"><T zh="返回首页" en="BACK HOME" /> ↑</Link></div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, description, meta }: { eyebrow: LocalizedText; title: LocalizedText; description: LocalizedText; meta?: LocalizedText }) {
  return (
    <section className="page-intro">
      <div className="hero-grid" aria-hidden="true" />
      <div className="page-intro-heading"><h1><Localized text={eyebrow} /></h1><p><Localized text={title} /></p></div>
      <div className="page-intro-copy"><p><Localized text={description} /></p>{meta && <span><Localized text={meta} /></span>}</div>
    </section>
  );
}

export function ContactBand() {
  return (
    <section className="contact-band">
      <h2><T zh="联系合作" en="Let&apos;s Work Together" /></h2>
      <p className="contact-band-subtitle"><T zh="期待参与真正落地的机器人系统" en="Ready to build robotics systems that work in the real world" /></p>
      <div><a href="mailto:2972689924@qq.com"><T zh="发送邮件" en="Email me" /> ↗</a><Link href="/resume"><T zh="查看简历" en="View resume" /> →</Link></div>
    </section>
  );
}
