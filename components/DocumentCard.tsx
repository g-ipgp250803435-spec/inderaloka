import type { DocumentItem } from "@/lib/types";
import { Icon } from "@/components/Icon";

export function DocumentCard({ document }: { document: DocumentItem }) {
  return (
    <article className="document-card">
      <span className="document-card__icon"><Icon name="file" /></span>
      <div>
        <span className="document-card__category">{document.category}</span>
        <h3>{document.title}</h3>
        <p>{document.date} · {document.format} · {document.size}</p>
      </div>
      <a href={document.href} className="icon-button" aria-label={`Buka ${document.title}`}><Icon name={document.format === "Web" ? "external" : "download"} /></a>
    </article>
  );
}
