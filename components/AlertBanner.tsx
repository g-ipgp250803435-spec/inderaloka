import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { Icon } from "@/components/Icon";

export function AlertBanner({ emergency }: { emergency: SiteSettings["emergency"] }) {
  if (!emergency.enabled) return null;
  return (
    <div className={`alert-banner alert-banner--${emergency.level}`} role="status">
      <div className="container alert-banner__inner">
        <span className="alert-banner__badge">{emergency.level === "critical" ? "Kecemasan" : emergency.level === "warning" ? "Amaran" : "Makluman"}</span>
        <strong>{emergency.title}</strong>
        <span>{emergency.message}</span>
        <Link href={emergency.href}>Selanjutnya <Icon name="arrow" size={16} /></Link>
      </div>
    </div>
  );
}
