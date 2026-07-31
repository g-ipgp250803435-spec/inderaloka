import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { NewsCard } from "@/components/NewsCard";

export const metadata: Metadata = { title: "Berita Rasmi", description: "Berita, pengumuman dan kenyataan rasmi Kerajaan Inderaloka." };

export default function NewsPage() {
  const content = getContent();
  return (
    <>
      <PageHero eyebrow="Sumber disahkan" title="Berita dan Pengumuman" description="Kenyataan rasmi, perkembangan dasar dan pengumuman daripada Kerajaan Inderaloka." />
      <section className="section section--cream"><div className="container news-archive">{content.news.map((item, index) => <NewsCard key={item.slug} item={item} featured={index === 0} />)}</div></section>
    </>
  );
}
