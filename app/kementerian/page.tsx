import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { MinistryCard } from "@/components/MinistryCard";

export const metadata: Metadata = { title: "Kementerian", description: "Direktori kementerian Kerajaan Inderaloka." };

export default function MinistriesPage() {
  const content = getContent();
  return <><PageHero eyebrow="Pentadbiran eksekutif" title="Kementerian" description="Kenali kementerian, portfolio dan pemimpin yang bertanggungjawab terhadap dasar negara."/><section className="section section--cream"><div className="container ministries-grid">{content.ministries.map((ministry) => <MinistryCard key={ministry.slug} ministry={ministry}/>)}</div></section></>;
}
