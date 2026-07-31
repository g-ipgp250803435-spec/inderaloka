import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { Icon } from "@/components/Icon";

export function generateStaticParams() {
  return getContent().news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getContent().news.find((news) => news.slug === slug);
  return item ? { title: item.title, description: item.excerpt } : {};
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getContent().news.find((news) => news.slug === slug);
  if (!item) notFound();
  const date = new Intl.DateTimeFormat("ms-MY", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${item.date}T12:00:00`));
  return (
    <article className="article-page">
      <header className="article-header"><div className="container container--narrow"><nav className="breadcrumbs"><Link href="/">Utama</Link><Icon name="chevron" size={14} /><Link href="/berita">Berita</Link></nav><span className="eyebrow eyebrow--light">{item.category}</span><h1>{item.title}</h1><p>{item.excerpt}</p><div className="article-meta"><span><Icon name="calendar" size={17} /> {date}</span><span><Icon name="building" size={17} /> {item.ministry}</span></div></div></header>
      <div className="container container--narrow article-body"><div className="article-notice"><Icon name="shield" /><span><strong>Kenyataan rasmi</strong> Kandungan ini diterbitkan dan disahkan oleh {item.ministry}.</span></div>{item.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<hr/><Link href="/berita" className="text-link">← Kembali ke semua berita</Link></div>
    </article>
  );
}
