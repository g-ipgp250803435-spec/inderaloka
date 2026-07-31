import content from "@/data/site-content.json";
import type { SiteContent } from "@/lib/types";

export function getContent(): SiteContent {
  return content as SiteContent;
}

export function getSearchIndex(siteContent: SiteContent) {
  return [
    ...siteContent.services.map((item) => ({
      type: "Perkhidmatan",
      title: item.title,
      description: item.description,
      href: item.href
    })),
    ...siteContent.news.map((item) => ({
      type: "Berita",
      title: item.title,
      description: item.excerpt,
      href: `/berita/${item.slug}`
    })),
    ...siteContent.ministries.map((item) => ({
      type: "Kementerian",
      title: item.name,
      description: item.description,
      href: "/kementerian"
    })),
    ...siteContent.documents.map((item) => ({
      type: "Dokumen",
      title: item.title,
      description: `${item.category} · ${item.format}`,
      href: item.href
    })),
    ...siteContent.pages.map((item) => ({
      type: "Halaman",
      title: item.title,
      description: item.summary,
      href: `/halaman/${item.slug}`
    }))
  ];
}
