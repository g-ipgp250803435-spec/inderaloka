import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = { title: "Kerajaan", description: "Struktur pentadbiran dan kepimpinan Kerajaan Inderaloka." };

export default function GovernmentPage() {
  const content = getContent();
  const institutions = [
    { title: "Ketua Negara", text: "Presiden menjaga kesinambungan perlembagaan dan melaksanakan fungsi ketua negara.", icon: "shield" },
    { title: "Kabinet", text: "Perdana Menteri dan para menteri menentukan dasar serta bertanggungjawab kepada Parlimen.", icon: "people" },
    { title: "Parlimen", text: "Dewan Rakyat dan Dewan Wilayah menggubal undang-undang, belanjawan dan mengawasi kerajaan.", icon: "building" },
    { title: "Kehakiman", text: "Mahkamah bebas mentafsir undang-undang, melindungi hak dan menyemak tindakan kerajaan.", icon: "book" }
  ];

  return (
    <>
      <PageHero eyebrow="Pentadbiran negara" title="Kerajaan Inderaloka" description="Sebuah pentadbiran demokratik, profesional dan bertanggungjawab yang berkhidmat untuk kepentingan rakyat." />
      <section className="section section--cream">
        <div className="container">
          <SectionHeading eyebrow="Institusi utama" title="Kuasa yang seimbang, tanggungjawab yang jelas" description="Setiap institusi mempunyai mandat tersendiri serta tertakluk kepada semak dan imbang." />
          <div className="institution-grid">
            {institutions.map((item) => <article key={item.title}><span><Icon name={item.icon} /></span><h2>{item.title}</h2><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Kepimpinan eksekutif" title="Kabinet Kerajaan" description="Kabinet kolektif yang mengurus keutamaan nasional dan penyampaian perkhidmatan awam." />
          <div className="cabinet-grid">
            {content.cabinet.map((member, index) => (
              <article key={member.name}>
                <div className="cabinet-card__portrait"><span>{member.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><small>0{index + 1}</small></div>
                <div><span>{member.role}</span><h3>{member.name}</h3><p>{member.portfolio}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section government-principles">
        <div className="container government-principles__grid">
          <div><span className="eyebrow eyebrow--light">Prinsip pentadbiran</span><h2>Rakyat mesti dapat melihat bagaimana keputusan dibuat dan siapa yang bertanggungjawab.</h2></div>
          <div>
            {[
              ["01", "Kedaulatan undang-undang", "Semua institusi dan pegawai awam tertakluk kepada undang-undang."],
              ["02", "Profesionalisme", "Perkhidmatan awam dipilih berdasarkan merit, keupayaan dan integriti."],
              ["03", "Ketelusan", "Maklumat, perbelanjaan dan prestasi diterbitkan secara terbuka."],
              ["04", "Subsidiariti", "Keputusan dibuat sedekat mungkin dengan komuniti yang terjejas."]
            ].map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
      </section>
    </>
  );
}
