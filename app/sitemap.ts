import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const content = getContent();
  const base = getSiteUrl();
  const fixed = ["", "/kerajaan", "/perkhidmatan", "/berita", "/kementerian", "/dokumen", "/tentang"];
  return [
    ...fixed.map((url) => ({ url: `${base}${url}`, lastModified: new Date() })),
    ...content.news.map((item) => ({ url: `${base}/berita/${item.slug}`, lastModified: new Date(item.date) })),
    ...content.pages.map((item) => ({ url: `${base}/halaman/${item.slug}`, lastModified: new Date() }))
  ];
}
