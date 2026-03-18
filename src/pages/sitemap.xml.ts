import { getCollection } from "astro:content";

export async function GET(context: { site: URL }) {
  const site = context.site.origin;
  const articles = await getCollection("articles");

  const urls = [
    `<url><loc>${site}/</loc></url>`,
    ...articles.map((article) => {
      const date = article.data.date
        ? new Date(article.data.date).toISOString().split("T")[0]
        : null;
      return `<url><loc>${site}/${article.slug}.html</loc>${date ? `<lastmod>${date}</lastmod>` : ""}</url>`;
    }),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
