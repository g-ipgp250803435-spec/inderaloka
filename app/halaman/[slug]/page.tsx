import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";

export function generateStaticParams() { return getContent().pages.map((page) => ({ slug: page.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getContent().pages.find((item) => item.slug === slug);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function CustomPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getContent().pages.find((item) => item.slug === slug);
  if (!page) notFound();
  return <><PageHero eyebrow={page.eyebrow} title={page.title} description={page.summary}/><section className="section section--cream"><div className="container content-page-layout"><article>{page.sections.map((section, index) => <section key={`${section.heading}-${index}`}><span className="content-section-number">{String(index + 1).padStart(2, "0")}</span><h2>{section.heading}</h2>{section.body.map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}{section.bullets?.length ? <ul>{section.bullets.map((bullet) => <li key={bullet}><Icon name="check" size={18}/><span>{bullet}</span></li>)}</ul> : null}</section>)}</article><aside><div className="official-card"><Icon name="shield"/><h2>Maklumat rasmi</h2><p>Halaman ini diselenggara oleh Kerajaan Inderaloka.</p><span>Dikemas kini melalui Content Studio</span></div><Link href="/perkhidmatan" className="text-link">Lihat perkhidmatan lain <Icon name="arrow" size={17}/></Link></aside></div></section></>;
}
