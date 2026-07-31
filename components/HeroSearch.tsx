"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SearchOverlay } from "@/components/SearchOverlay";

export function HeroSearch({ items }: { items: Array<{ type: string; title: string; description: string; href: string }> }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="hero-search" onClick={() => setOpen(true)}>
        <Icon name="search" />
        <span>Cari perkhidmatan atau maklumat kerajaan</span>
        <strong>Cari</strong>
      </button>
      <SearchOverlay items={items} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
