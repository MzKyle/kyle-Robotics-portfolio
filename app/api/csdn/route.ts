import { getCsdnArticles } from "../../../lib/csdn";
import { writingTopics } from "../../../lib/portfolio";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("topic");
  const topic = writingTopics.find((item) => item.slug === slug);

  if (!topic) {
    return Response.json({ error: "Unknown writing topic." }, { status: 404 });
  }

  try {
    const result = await getCsdnArticles(topic);
    const status = result.articles.length > 0 ? 200 : 503;

    return Response.json(
      {
        topic: topic.slug,
        articles: result.articles,
        availableColumns: result.availableColumns,
        totalColumns: result.totalColumns,
        fetchedAt: new Date().toISOString(),
      },
      {
        status,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=1800, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "CSDN articles are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
