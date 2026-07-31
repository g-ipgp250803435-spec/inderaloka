"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { SearchOverlay } from "@/components/SearchOverlay";
import { ThemeControls } from "@/components/ThemeControls";

export function Header({ content, searchItems }: { content: SiteContent; searchItems: Array<{ type: string; title: string; description: string; href: string }> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const links = [...content.navigation, ...content.pages.filter((page) => page.showInNav).map((page) => ({ label: page.navLabel, href: `/halaman/${page.slug}` }))];

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Langkau ke kandungan utama</a>
      <div className="official-bar">
        <div className="container official-bar__inner">
          <span><Icon name="shield" size={15} /> Portal rasmi Kerajaan Inderaloka</span>
          <div><span>BM</span><span className="official-bar__divider" /><ThemeControls /></div>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__main">
          <Link href="/" className="brand" aria-label="Portal Rasmi Kerajaan Inderaloka">
            <Image src={content.site.logo} alt="Lambang Inderaloka" width={62} height={62} priority />
            <span><strong>{content.site.shortName}</strong><small>{content.site.portalTitle}</small></span>
          </Link>
          <div className="header-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)}><Icon name="search" size={19} /><span>Cari portal</span><kbd>Ctrl K</kbd></button>
            <Link href="/perkhidmatan" className="button button--small">Perkhidmatan</Link>
            <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Buka menu"><Icon name={menuOpen ? "close" : "menu"} /></button>
          </div>
        </div>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Navigasi utama">
          <div className="container main-nav__inner">
            {links.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return <Link key={`${link.href}-${link.label}`} href={link.href} className={active ? "active" : ""}>{link.label}</Link>;
            })}
          </div>
        </nav>
      </header>
      <SearchOverlay items={searchItems} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
