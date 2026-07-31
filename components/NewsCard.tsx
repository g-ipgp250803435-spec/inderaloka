import Link from "next/link";
import type { NewsItem } from "@/lib/types";
import { Icon } from "@/components/Icon";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ms-MY", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <article className={`news-card ${featured ? "news-card--featured" : ""}`}>
      <div className="news-card__visual" aria-hidden="true">
        <span>{item.category.slice(0, 1)}</span>
        <div className="news-card__seal"><Icon name="shield" size={32} /></div>
      </div>
      <div className="news-card__content">
        <div className="news-card__meta"><span>{item.category}</span><time dateTime={item.date}>{formatDate(item.date)}</time></div>
        <h3><Link href={`/berita/${item.slug}`}>{item.title}</Link></h3>
        <p>{item.excerpt}</p>
        <Link href={`/berita/${item.slug}`} className="text-link">Baca kenyataan <Icon name="arrow" size={17} /></Link>
      </div>
    </article>
  );
}
