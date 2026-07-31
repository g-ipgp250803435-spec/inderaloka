import Link from "next/link";
import type { Service } from "@/lib/types";
import { Icon } from "@/components/Icon";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link href={service.href} className="service-card">
      <span className="service-card__icon"><Icon name={service.icon} /></span>
      <span className="service-card__category">{service.category}</span>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <span className="service-card__link">Buka perkhidmatan <Icon name="arrow" size={17} /></span>
    </Link>
  );
}
