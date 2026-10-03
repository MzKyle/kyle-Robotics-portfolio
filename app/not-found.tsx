import Link from "next/link";
import { T } from "../components/localized";
import { SiteFooter, SiteHeader } from "../components/site-shell";

export default function NotFound() {
  return <main><SiteHeader active="" /><section className="not-found-page section-shell"><p className="section-kicker">404 / PAGE NOT FOUND</p><h1><T zh="这条路径还没有作品。" en="No work at this address." /></h1><p><T zh="可以回到首页，或继续浏览工程项目。" en="Head home or keep exploring the engineering work." /></p><div className="case-actions"><Link className="button button-primary" href="/"><T zh="返回首页" en="Back home" /> →</Link><Link className="button button-secondary" href="/projects"><T zh="浏览项目" en="View projects" /> →</Link></div></section><SiteFooter /></main>;
}
