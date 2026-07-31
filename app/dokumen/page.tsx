import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { DocumentCard } from "@/components/DocumentCard";

export const metadata: Metadata = { title: "Dokumen Awam", description: "Belanjawan, strategi, undang-undang dan laporan awam Inderaloka." };

export default function DocumentsPage() {
  const content = getContent();
  return <><PageHero eyebrow="Kerajaan terbuka" title="Dokumen Awam" description="Akses kepada dasar, strategi, belanjawan dan rujukan rasmi negara."/><section className="section section--cream"><div className="container document-list">{content.documents.map((document) => <DocumentCard key={document.id} document={document}/>)}</div></section></>;
}
