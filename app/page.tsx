import Image from "next/image";
import Link from "next/link";
import { getContent, getSearchIndex } from "@/lib/content";
import { HeroSearch } from "@/components/HeroSearch";
import { Icon } from "@/components/Icon";
import { ServiceCard } from "@/components/ServiceCard";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeading } from "@/components/SectionHeading";

export default function HomePage() {
  const content = getContent();
  const featuredNews = content.news.find((item) => item.featured) ?? content.news[0];
  const otherNews = content.news.filter((item) => item.slug !== featuredNews.slug).slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="hero__pattern" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--light">{content.home.eyebrow}</span>
            <h1>{content.home.heroTitle}</h1>
            <p>{content.home.heroText}</p>
            <HeroSearch items={getSearchIndex(content)} />
            <div className="hero__actions">
              <Link className="button button--accent" href={content.home.primaryCta.href}>{content.home.primaryCta.label}<Icon name="arrow" size={18} /></Link>
              <Link className="button button--ghost" href={content.home.secondaryCta.href}>{content.home.secondaryCta.label}</Link>
            </div>
          </div>
          <div className="hero__emblem" aria-hidden="true">
            <div className="hero__orbit hero__orbit--one" />
            <div className="hero__orbit hero__orbit--two" />
            <Image src={content.site.logo} alt="" width={300} height={300} priority />
            <span className="hero__motto">{content.site.tagline}</span>
          </div>
        </div>
        <div className="container stats-strip">
          {content.home.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <SectionHeading eyebrow="Urusan harian" title="Perkhidmatan popular" description="Selesaikan urusan utama anda dengan panduan yang jelas dan akses pantas." />
          <div className="services-grid">
            {content.services.filter((service) => service.popular).map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
          <div className="section-action"><Link href="/perkhidmatan" className="button button--outline">Lihat semua perkhidmatan <Icon name="arrow" size={18} /></Link></div>
        </div>
      </section>

      <section className="section priorities-section">
        <div className="container priorities-grid">
          <div>
            <SectionHeading eyebrow="Keutamaan negara" title="Kemajuan yang bermakna untuk semua" description="Dasar kerajaan disusun berdasarkan hasil yang boleh dirasai dan dinilai oleh rakyat." />
            <div className="priority-list">
              {content.home.priorities.map((priority, index) => (
                <article key={priority.title}>
                  <span><Icon name={priority.icon} /></span>
                  <div><small>0{index + 1}</small><h3>{priority.title}</h3><p>{priority.description}</p></div>
                </article>
              ))}
            </div>
          </div>
          <aside className="message-panel">
            <span className="message-panel__crest"><Image src={content.site.logo} alt="" width={82} height={82} /></span>
            <span className="eyebrow eyebrow--light">Amanat pentadbiran</span>
            <h2>{content.home.messageTitle}</h2>
            <p>{content.home.messageBody}</p>
            <Link href="/kerajaan" className="text-link text-link--light">Struktur pentadbiran <Icon name="arrow" size={18} /></Link>
          </aside>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="section-heading-row">
            <SectionHeading eyebrow="Terkini" title="Berita dan pengumuman rasmi" description="Maklumat yang disahkan terus daripada kementerian dan agensi kerajaan." />
            <Link href="/berita" className="text-link">Semua berita <Icon name="arrow" size={17} /></Link>
          </div>
          <div className="news-layout">
            <NewsCard item={featuredNews} featured />
            <div className="news-list">{otherNews.map((item) => <NewsCard key={item.slug} item={item} />)}</div>
          </div>
        </div>
      </section>

      <section className="section transparency-section">
        <div className="container transparency-grid">
          <div>
            <span className="eyebrow eyebrow--light">Kerajaan terbuka</span>
            <h2>Ketelusan bukan pilihan tambahan. Ia ialah cara kita mentadbir.</h2>
          </div>
          <div className="transparency-links">
            <Link href="/dokumen"><span><Icon name="file" /></span><div><strong>Dokumen awam</strong><small>Belanjawan, strategi dan laporan</small></div><Icon name="chevron" /></Link>
            <Link href="/halaman/pelan-pembangunan-2035"><span><Icon name="growth" /></span><div><strong>Prestasi negara</strong><small>Sasaran dan kemajuan Wawasan 2035</small></div><Icon name="chevron" /></Link>
            <Link href="/halaman/aduan-dan-maklum-balas"><span><Icon name="message" /></span><div><strong>Suara rakyat</strong><small>Aduan, pertanyaan dan cadangan</small></div><Icon name="chevron" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
