import type { WritingTopic } from "./portfolio";

export type CsdnArticle = {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  views: number;
  column: { zh: string; en: string };
};

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const CSDN_AUTHOR = "2301_80079642";

function decodeHtml(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
      if (code[0] === "#") {
        const radix = code[1]?.toLowerCase() === "x" ? 16 : 10;
        const numeric = Number.parseInt(code.slice(radix === 16 ? 2 : 1), radix);
        return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : entity;
      }
      return named[code.toLowerCase()] ?? entity;
    })
    .replace(/\s+/g, " ")
    .trim();
}

function parseViews(value: string) {
  const match = value.match(/([\d,.]+)\s*(万)?(?:&nbsp;|\s)*阅读/i);
  if (!match) return 0;
  const number = Number.parseFloat(match[1].replaceAll(",", ""));
  return Number.isFinite(number) ? Math.round(number * (match[2] ? 10_000 : 1)) : 0;
}

function cleanArticleUrl(value: string) {
  try {
    const url = new URL(value);
    if (!url.hostname.endsWith("csdn.net") || !/\/article\/details\/\d+/.test(url.pathname)) return null;
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

export function parseCsdnColumn(
  html: string,
  column: { zh: string; en: string },
): CsdnArticle[] {
  const list = html.match(/<ul\s+class=["']column_article_list["'][^>]*>([^]*?)<\/ul>/i)?.[1];
  if (!list) return [];

  const articles: CsdnArticle[] = [];
  const itemPattern = /<li[^>]*>\s*<a[^>]+href=["']([^"']+)["'][^>]*>([^]*?)<\/a>\s*<\/li>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemPattern.exec(list))) {
    const url = cleanArticleUrl(match[1]);
    if (!url) continue;

    const body = match[2];
    const title = decodeHtml(body.match(/<h2[^>]*class=["'][^"']*\btitle\b[^"']*["'][^>]*>([^]*?)<\/h2>/i)?.[1] ?? "");
    if (!title) continue;

    const summary = decodeHtml(body.match(/<div[^>]*class=["'][^"']*\bcolumn_article_desc\b[^"']*["'][^>]*>([^]*?)<\/div>/i)?.[1] ?? "");
    const meta = body.match(/<div[^>]*class=["'][^"']*\bcolumn_article_data\b[^"']*["'][^>]*>([^]*?)<\/div>/i)?.[1] ?? "";
    const publishedAt = meta.match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}:\d{2})?/)?.[0] ?? "";

    articles.push({
      title,
      url,
      summary: summary.length > 210 ? `${summary.slice(0, 207).trim()}…` : summary,
      publishedAt,
      views: parseViews(meta),
      column,
    });
  }

  return articles;
}

async function fetchColumn(
  source: WritingTopic["columns"][number],
): Promise<CsdnArticle[]> {
  const url = new URL(source.url);
  url.searchParams.set("orderBy", "3");

  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.7",
      "User-Agent": USER_AGENT,
    },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) throw new Error(`CSDN returned ${response.status}`);
  return parseCsdnColumn(await response.text(), source.title);
}

type CsdnSearchItem = {
  articleid?: string;
  title?: string;
  description?: string;
  created_at?: string;
  view?: string | number;
  url?: string;
};

async function fetchAuthorSearch(topic: WritingTopic): Promise<CsdnArticle[]> {
  const url = new URL("https://so.csdn.net/api/v3/search");
  const parameters = {
    q: topic.title.zh,
    t: "blog",
    p: "1",
    s: "0",
    tm: "0",
    lv: "-1",
    ft: "0",
    u: CSDN_AUTHOR,
    ct: "-1",
    pnt: "-1",
    ry: "-1",
    platform: "pc",
  };
  Object.entries(parameters).forEach(([key, value]) => url.searchParams.set(key, value));

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json", "Accept-Language": "zh-CN,zh;q=0.9", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`CSDN search returned ${response.status}`);

  const payload = await response.json() as { result_vos?: CsdnSearchItem[] };
  const articles = (payload.result_vos ?? []).flatMap((item) => {
    if (!item.url || !item.url.includes(`/${CSDN_AUTHOR}/article/details/`)) return [];
    const articleUrl = cleanArticleUrl(item.url);
    const title = decodeHtml(item.title ?? "");
    if (!articleUrl || !title) return [];

    const views = typeof item.view === "number" ? item.view : Number.parseInt(item.view ?? "0", 10);
    const summary = decodeHtml(item.description ?? "");
    return [{
      title,
      url: articleUrl,
      summary: summary.length > 210 ? `${summary.slice(0, 207).trim()}…` : summary,
      publishedAt: item.created_at ?? "",
      views: Number.isFinite(views) ? views : 0,
      column: topic.title,
    } satisfies CsdnArticle];
  });

  return rankForTopic(articles, topic.articleKeywords);
}

async function fetchAuthorRss(topic: WritingTopic): Promise<CsdnArticle[]> {
  const response = await fetch(`https://rss.csdn.net/${CSDN_AUTHOR}/rss/map?source=portfolio`, {
    cache: "no-store",
    headers: { Accept: "application/rss+xml,application/xml,text/xml", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`CSDN RSS returned ${response.status}`);

  const xml = await response.text();
  const articles: CsdnArticle[] = [];
  const itemPattern = /<item>([^]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  const loweredKeywords = topic.articleKeywords.map((keyword) => keyword.toLowerCase());

  while ((match = itemPattern.exec(xml))) {
    const item = match[1];
    const rawTitle = item.match(/<title>([^]*?)<\/title>/i)?.[1] ?? "";
    const rawSummary = item.match(/<description>([^]*?)<\/description>/i)?.[1] ?? "";
    const rawUrl = item.match(/<link>([^]*?)<\/link>/i)?.[1] ?? "";
    const rawDate = decodeHtml(item.match(/<pubDate>([^]*?)<\/pubDate>/i)?.[1] ?? "");
    const title = decodeHtml(rawTitle.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, ""));
    const summary = decodeHtml(rawSummary.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, ""));
    const url = cleanArticleUrl(decodeHtml(rawUrl));
    const searchable = `${title} ${summary}`.toLowerCase();
    if (!url || !title || !loweredKeywords.some((keyword) => searchable.includes(keyword))) continue;

    const parsedDate = Date.parse(rawDate);
    articles.push({
      title,
      url,
      summary: summary.length > 210 ? `${summary.slice(0, 207).trim()}…` : summary,
      publishedAt: Number.isFinite(parsedDate) ? new Date(parsedDate).toISOString().slice(0, 10) : "",
      views: 0,
      column: topic.title,
    });
  }

  return rankForTopic(articles, topic.articleKeywords);
}

function rankForTopic(articles: CsdnArticle[], keywords: string[]) {
  const lowered = keywords.map((keyword) => keyword.toLowerCase());
  return [...articles].sort((a, b) => {
    const aText = `${a.title} ${a.summary}`.toLowerCase();
    const bText = `${b.title} ${b.summary}`.toLowerCase();
    const aMatches = lowered.filter((keyword) => aText.includes(keyword)).length;
    const bMatches = lowered.filter((keyword) => bText.includes(keyword)).length;
    const aScore = Math.log10(a.views + 10) + Math.min(aMatches, 3) * 0.48;
    const bScore = Math.log10(b.views + 10) + Math.min(bMatches, 3) * 0.48;
    return bScore - aScore;
  });
}

export async function getCsdnArticles(topic: WritingTopic, limit = 5) {
  const onlineSources = await Promise.allSettled([fetchAuthorSearch(topic), fetchAuthorRss(topic)]);
  const onlineArticles = onlineSources.flatMap((result) => result.status === "fulfilled" ? result.value : []);
  const uniqueOnline = [...new Map(onlineArticles.map((article) => [article.url, article])).values()];

  if (uniqueOnline.length) {
    return {
      articles: rankForTopic(uniqueOnline, topic.articleKeywords).slice(0, limit),
      availableColumns: topic.columns.length,
      totalColumns: topic.columns.length,
    };
  }

  // CSDN occasionally rate-limits one public surface while another remains
  // available, so column HTML is intentionally retained as a final online fallback.
  const results = await Promise.allSettled(topic.columns.map(fetchColumn));
  const rankedColumns = results.map((result) =>
    result.status === "fulfilled" ? rankForTopic(result.value, topic.articleKeywords) : [],
  );

  const selected: CsdnArticle[] = [];
  const seen = new Set<string>();
  let cursor = 0;

  while (selected.length < limit && rankedColumns.some((articles) => cursor < articles.length)) {
    for (const articles of rankedColumns) {
      const article = articles[cursor];
      if (article && !seen.has(article.url)) {
        seen.add(article.url);
        selected.push(article);
        if (selected.length === limit) break;
      }
    }
    cursor += 1;
  }

  return {
    articles: selected,
    availableColumns: results.filter((result) => result.status === "fulfilled").length,
    totalColumns: results.length,
  };
}
