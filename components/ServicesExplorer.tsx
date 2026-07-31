"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/lib/types";
import { Icon } from "@/components/Icon";
import { ServiceCard } from "@/components/ServiceCard";

export function ServicesExplorer({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const categories = ["Semua", ...Array.from(new Set(services.map((service) => service.category)))];
  const filtered = useMemo(() => services.filter((service) => {
    const matchesCategory = category === "Semua" || service.category === category;
    const haystack = `${service.title} ${service.description} ${service.category}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [services, query, category]);

  return (
    <section className="section section--cream services-explorer">
      <div className="container">
        <div className="service-filter">
          <label><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari perkhidmatan…" /></label>
          <div className="filter-chips" aria-label="Kategori perkhidmatan">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>
        <div className="results-count"><strong>{filtered.length}</strong> perkhidmatan ditemui</div>
        {filtered.length ? <div className="services-grid services-grid--all">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div> : <div className="empty-state"><Icon name="search" size={38} /><h2>Tiada perkhidmatan ditemui</h2><p>Cuba kata kunci atau kategori lain.</p></div>}
      </div>
    </section>
  );
}
