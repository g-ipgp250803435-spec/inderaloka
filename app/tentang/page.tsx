import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "Tentang Portal", description: "Maklumat tentang Portal Rasmi Kerajaan Inderaloka." };

export default function AboutPage() {
  const content = getContent();
  return <><PageHero eyebrow="Mengenai platform" title="Tentang Portal" description={content.site.description}/><section className="section section--cream"><div className="container about-grid"><article><h2>Satu sumber rasmi</h2><p>Portal ini menggabungkan maklumat kerajaan, perkhidmatan, berita dan dokumen dalam pengalaman yang konsisten. Setiap halaman direka supaya mudah dicari, dibaca dan dikemas kini.</p><h2>Pengurusan kandungan mudah</h2><p>Content Studio membolehkan pentadbir mengubah identiti portal, halaman, perkhidmatan, berita dan kementerian. Apabila integrasi GitHub diaktifkan, perubahan diterbitkan sebagai commit dan Vercel menjalankan deployment baharu secara automatik.</p></article><aside><h2>Maklumat rasmi</h2><div><Icon name="globe"/><span><small>Domain</small><strong>{content.site.officialDomain}</strong></span></div><div><Icon name="message"/><span><small>E-mel</small><strong>{content.site.contactEmail}</strong></span></div><div><Icon name="building"/><span><small>Alamat</small><strong>{content.site.address}</strong></span></div></aside></div></section></>;
}
