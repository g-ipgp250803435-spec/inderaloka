import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/types";
import { Icon } from "@/components/Icon";

export function Footer({ content }: { content: SiteContent }) {
  const customLinks = content.pages.filter((page) => page.showInNav).slice(0, 4);
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image src={content.site.logo} alt="Lambang Inderaloka" width={72} height={72} />
          <div>
            <strong>{content.site.portalTitle}</strong>
            <p>{content.site.tagline}</p>
          </div>
        </div>
        <div>
          <h2>Portal</h2>
          <Link href="/kerajaan">Struktur kerajaan</Link>
          <Link href="/perkhidmatan">Perkhidmatan rakyat</Link>
          <Link href="/berita">Berita rasmi</Link>
          <Link href="/dokumen">Dokumen awam</Link>
        </div>
        <div>
          <h2>Rujukan</h2>
          {customLinks.map((page) => <Link key={page.slug} href={`/halaman/${page.slug}`}>{page.navLabel}</Link>)}
          <Link href="/tentang">Tentang portal</Link>
          <Link href="/admin">Content Studio</Link>
        </div>
        <div className="footer-contact">
          <h2>Hubungi kerajaan</h2>
          <a href={`mailto:${content.site.contactEmail}`}>{content.site.contactEmail}</a>
          <a href={`tel:${content.site.contactPhone.replace(/\s/g, "")}`}>{content.site.contactPhone}</a>
          <p>{content.site.address}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {content.site.name}. Hak cipta terpelihara.</span>
        <span className="official-mark"><Icon name="shield" size={16} /> Laman kerajaan rasmi</span>
      </div>
    </footer>
  );
}
