import type { Ministry } from "@/lib/types";
import { Icon } from "@/components/Icon";

export function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <article className="ministry-card">
      <div className="ministry-card__top">
        <span className="ministry-card__icon"><Icon name={ministry.icon} /></span>
        <span className="ministry-card__short">{ministry.shortName}</span>
      </div>
      <h3>{ministry.name}</h3>
      <p>{ministry.description}</p>
      <div className="ministry-card__minister">
        <span>Menteri</span>
        <strong>{ministry.minister}</strong>
      </div>
    </article>
  );
}
