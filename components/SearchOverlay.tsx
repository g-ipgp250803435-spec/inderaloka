"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

type SearchItem = { type: string; title: string; description: string; href: string };

export function SearchOverlay({ items, open, onClose }: { items: SearchItem[]; open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ms");
    if (!normalized) return items.slice(0, 7);
    return items.filter((item) => `${item.title} ${item.description} ${item.type}`.toLocaleLowerCase("ms").includes(normalized)).slice(0, 12);
  }, [items, query]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Carian portal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-panel">
        <div className="search-panel__input">
          <Icon name="search" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari perkhidmatan, berita, kementerian atau dokumen…" />
          <button onClick={onClose} aria-label="Tutup carian"><Icon name="close" /></button>
        </div>
        <div className="search-panel__hint"><span>{query ? `${results.length} hasil ditemui` : "Cadangan carian"}</span><kbd>ESC</kbd></div>
        <div className="search-results">
          {results.length > 0 ? results.map((item, index) => (
            <Link href={item.href} key={`${item.type}-${item.title}-${index}`} onClick={onClose}>
              <span className="search-results__icon"><Icon name={item.type === "Dokumen" ? "file" : item.type === "Berita" ? "calendar" : item.type === "Kementerian" ? "building" : "search"} size={19} /></span>
              <span><small>{item.type}</small><strong>{item.title}</strong><em>{item.description}</em></span>
              <Icon name="chevron" size={17} />
            </Link>
          )) : <div className="empty-state"><Icon name="search" size={34} /><h3>Tiada hasil ditemui</h3><p>Cuba istilah yang lebih ringkas atau semak ejaan anda.</p></div>}
        </div>
      </div>
    </div>
  );
}
