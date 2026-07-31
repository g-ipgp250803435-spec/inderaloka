import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export function GET() {
  const content = getContent();
  const base = getSiteUrl();
  const items = content.news.map((item) => `<item><title><![CDATA[${item.title}]]></title><link>${base}/berita/${item.slug}</link><guid>${base}/berita/${item.slug}</guid><pubDate>${new Date(item.date).toUTCString()}</pubDate><description><![CDATA[${item.excerpt}]]></description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${content.site.portalTitle}</title><link>${base}</link><description>${content.site.description}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
