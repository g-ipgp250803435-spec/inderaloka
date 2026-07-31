import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { ServicesExplorer } from "@/components/ServicesExplorer";

export const metadata: Metadata = { title: "Perkhidmatan", description: "Direktori perkhidmatan Kerajaan Inderaloka." };

export default function ServicesPage() {
  const content = getContent();
  return (
    <>
      <PageHero eyebrow="Satu pintu digital" title="Perkhidmatan Kerajaan" description="Cari urusan kerajaan berdasarkan keperluan anda, bukan berdasarkan struktur organisasi." />
      <ServicesExplorer services={content.services} />
    </>
  );
}
