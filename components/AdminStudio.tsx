"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/types";
import { Icon } from "@/components/Icon";

type Tab = "site" | "home" | "services" | "news" | "ministries" | "pages" | "json";
type Notice = { type: "success" | "error" | "info"; message: string; url?: string } | null;

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Field({ label, value, onChange, textarea = false, hint }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; hint?: string }) {
  return <label className="admin-field"><span>{label}</span>{textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}/> : <input value={value} onChange={(e) => onChange(e.target.value)}/>} {hint && <small>{hint}</small>}</label>;
}

function ArrayHeader({ title, description, onAdd }: { title: string; description: string; onAdd: () => void }) {
  return <div className="admin-section-heading"><div><h2>{title}</h2><p>{description}</p></div><button className="admin-button admin-button--secondary" onClick={onAdd}><Icon name="plus" size={17}/> Tambah</button></div>;
}

export function AdminStudio({ initialContent }: { initialContent: SiteContent }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [jsonText, setJsonText] = useState(() => JSON.stringify(initialContent, null, 2));
  const [tab, setTab] = useState<Tab>("site");
  const [notice, setNotice] = useState<Notice>(null);
  const [publishing, setPublishing] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/auth/status").then((res) => res.json()).then((data: { authenticated: boolean; githubConfigured: boolean }) => {
      setAuthenticated(data.authenticated);
      setGithubConfigured(data.githubConfigured);
      const draft = localStorage.getItem("inderaloka-content-draft");
      if (draft) {
        try { setContent(JSON.parse(draft) as SiteContent); } catch { /* Ignore invalid local draft. */ }
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) localStorage.setItem("inderaloka-content-draft", JSON.stringify(content));
  }, [content, loading]);

  useEffect(() => {
    setJsonText(JSON.stringify(content, null, 2));
  }, [content]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setNotice(null);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json() as { ok: boolean; message?: string };
    if (result.ok) { setAuthenticated(true); setPassword(""); } else setNotice({ type: "error", message: result.message || "Log masuk gagal." });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthenticated(false);
  }

  function saveDraft() {
    localStorage.setItem("inderaloka-content-draft", JSON.stringify(content));
    setNotice({ type: "success", message: "Draf disimpan dalam pelayar ini." });
  }

  async function publish() {
    setPublishing(true); setNotice(null);
    try {
      const response = await fetch("/api/admin/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content }) });
      const result = await response.json() as { ok: boolean; message?: string; commitUrl?: string };
      setNotice({ type: result.ok ? "success" : "error", message: result.message || (result.ok ? "Diterbitkan." : "Penerbitan gagal."), url: result.commitUrl });
    } catch { setNotice({ type: "error", message: "Tidak dapat menghubungi pelayan." }); }
    finally { setPublishing(false); }
  }

  async function uploadAsset(file: File, target: "logo" | "favicon") {
    const reader = new FileReader();
    reader.onload = async () => {
      const response = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, dataUrl: reader.result }) });
      const result = await response.json() as { ok: boolean; path?: string; message?: string };
      if (result.ok && result.path) {
        setContent((current) => ({ ...current, site: { ...current.site, [target]: result.path } }));
        setNotice({ type: "success", message: `Fail dimuat naik. Klik “Terbit ke GitHub” untuk menyimpan laluan ${target}.` });
      } else setNotice({ type: "error", message: result.message || "Muat naik gagal." });
    };
    reader.readAsDataURL(file);
  }

  function importJson(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { setContent(JSON.parse(String(reader.result)) as SiteContent); setNotice({ type: "success", message: "Kandungan JSON berjaya diimport." }); }
      catch { setNotice({ type: "error", message: "Fail JSON tidak sah." }); }
    };
    reader.readAsText(file);
  }

  if (loading) return <div className="admin-loading"><span/><p>Memuatkan Content Studio…</p></div>;

  if (!authenticated) {
    return <div className="admin-login"><div className="admin-login__brand"><span><Icon name="shield" size={32}/></span><div><strong>Inderaloka</strong><small>Content Studio</small></div></div><h1>Log masuk pentadbir</h1><p>Ubah kandungan portal dan terbitkan perubahan dengan selamat melalui GitHub.</p>{notice && <div className={`admin-notice admin-notice--${notice.type}`}>{notice.message}</div>}<form onSubmit={login}><label><span>Kata laluan</span><div><Icon name="lock"/><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus/></div></label><button className="admin-button" type="submit">Log masuk <Icon name="arrow" size={18}/></button></form><small className="admin-login__hint">Tetapkan <code>ADMIN_PASSWORD</code> dan <code>ADMIN_SESSION_SECRET</code> dalam Vercel.</small></div>;
  }

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: "site", label: "Identiti portal", icon: "shield" }, { id: "home", label: "Halaman utama", icon: "home" }, { id: "services", label: "Perkhidmatan", icon: "spark" }, { id: "news", label: "Berita", icon: "calendar" }, { id: "ministries", label: "Kementerian", icon: "building" }, { id: "pages", label: "Halaman", icon: "file" }, { id: "json", label: "JSON lanjutan", icon: "code" }
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand"><span><Icon name="shield"/></span><div><strong>Inderaloka</strong><small>Content Studio</small></div></div>
        <nav>{tabs.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}><Icon name={item.icon} size={19}/>{item.label}</button>)}</nav>
        <div className="admin-sidebar__status"><span className={githubConfigured ? "online" : "offline"}/><div><strong>{githubConfigured ? "GitHub aktif" : "Mod eksport"}</strong><small>{githubConfigured ? "Penerbitan automatik" : "Env belum lengkap"}</small></div></div>
        <button className="admin-sidebar__logout" onClick={logout}>Log keluar</button>
      </aside>
      <div className="admin-workspace">
        <header className="admin-toolbar"><div><span>Pengurusan kandungan</span><strong>{tabs.find((item) => item.id === tab)?.label}</strong></div><div><a href="/" target="_blank" rel="noreferrer" className="admin-button admin-button--ghost">Lihat portal <Icon name="external" size={17}/></a><button onClick={saveDraft} className="admin-button admin-button--secondary"><Icon name="save" size={17}/> Simpan draf</button><button onClick={publish} disabled={publishing} className="admin-button">{publishing ? "Menerbitkan…" : "Terbit ke GitHub"}<Icon name="upload" size={17}/></button></div></header>
        {notice && <div className={`admin-notice admin-notice--${notice.type}`}>{notice.message}{notice.url && <a href={notice.url} target="_blank" rel="noreferrer">Lihat commit</a>}<button onClick={() => setNotice(null)}><Icon name="close" size={16}/></button></div>}
        <main className="admin-main">
          {tab === "site" && <div className="admin-panel"><div className="admin-section-heading"><div><h2>Identiti dan tetapan portal</h2><p>Maklumat ini digunakan di seluruh laman, metadata dan footer.</p></div></div><div className="admin-form-grid"><Field label="Nama kerajaan" value={content.site.name} onChange={(value) => setContent({ ...content, site: { ...content.site, name: value } })}/><Field label="Nama pendek" value={content.site.shortName} onChange={(value) => setContent({ ...content, site: { ...content.site, shortName: value } })}/><Field label="Tajuk portal" value={content.site.portalTitle} onChange={(value) => setContent({ ...content, site: { ...content.site, portalTitle: value } })}/><Field label="Cogan kata" value={content.site.tagline} onChange={(value) => setContent({ ...content, site: { ...content.site, tagline: value } })}/><Field label="Penerangan portal" value={content.site.description} textarea onChange={(value) => setContent({ ...content, site: { ...content.site, description: value } })}/><Field label="Domain rasmi" value={content.site.officialDomain} onChange={(value) => setContent({ ...content, site: { ...content.site, officialDomain: value } })}/><Field label="E-mel" value={content.site.contactEmail} onChange={(value) => setContent({ ...content, site: { ...content.site, contactEmail: value } })}/><Field label="Telefon" value={content.site.contactPhone} onChange={(value) => setContent({ ...content, site: { ...content.site, contactPhone: value } })}/><Field label="Alamat" value={content.site.address} textarea onChange={(value) => setContent({ ...content, site: { ...content.site, address: value } })}/><Field label="Warna utama" value={content.site.primaryColor} onChange={(value) => setContent({ ...content, site: { ...content.site, primaryColor: value } })}/><Field label="Warna aksen" value={content.site.accentColor} onChange={(value) => setContent({ ...content, site: { ...content.site, accentColor: value } })}/></div><div className="admin-assets"><div><h3>Logo / lambang</h3><p>{content.site.logo}</p><label className="admin-upload"><Icon name="upload"/> Muat naik imej<input type="file" accept=".png,.jpg,.jpeg,.webp,.ico" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], "logo")}/></label></div><div><h3>Favicon</h3><p>{content.site.favicon}</p><label className="admin-upload"><Icon name="upload"/> Muat naik favicon<input type="file" accept=".png,.jpg,.jpeg,.webp,.ico" onChange={(e) => e.target.files?.[0] && uploadAsset(e.target.files[0], "favicon")}/></label></div></div><div className="admin-subpanel"><label className="admin-toggle"><input type="checkbox" checked={content.site.emergency.enabled} onChange={(e) => setContent({ ...content, site: { ...content.site, emergency: { ...content.site.emergency, enabled: e.target.checked } } })}/><span/><div><strong>Banner makluman</strong><small>Paparkan pengumuman di semua halaman.</small></div></label><div className="admin-form-grid"><Field label="Tajuk makluman" value={content.site.emergency.title} onChange={(value) => setContent({ ...content, site: { ...content.site, emergency: { ...content.site.emergency, title: value } } })}/><Field label="Mesej makluman" value={content.site.emergency.message} onChange={(value) => setContent({ ...content, site: { ...content.site, emergency: { ...content.site.emergency, message: value } } })}/></div></div></div>}

          {tab === "home" && <div className="admin-panel"><div className="admin-section-heading"><div><h2>Kandungan halaman utama</h2><p>Ubah mesej utama, butang dan statistik negara.</p></div></div><div className="admin-form-grid"><Field label="Eyebrow" value={content.home.eyebrow} onChange={(value) => setContent({ ...content, home: { ...content.home, eyebrow: value } })}/><Field label="Tajuk hero" value={content.home.heroTitle} textarea onChange={(value) => setContent({ ...content, home: { ...content.home, heroTitle: value } })}/><Field label="Penerangan hero" value={content.home.heroText} textarea onChange={(value) => setContent({ ...content, home: { ...content.home, heroText: value } })}/><Field label="Tajuk amanat" value={content.home.messageTitle} onChange={(value) => setContent({ ...content, home: { ...content.home, messageTitle: value } })}/><Field label="Isi amanat" value={content.home.messageBody} textarea onChange={(value) => setContent({ ...content, home: { ...content.home, messageBody: value } })}/></div><h3 className="admin-minor-title">Statistik utama</h3><div className="admin-repeat-grid">{content.home.stats.map((stat, index) => <div className="admin-repeat" key={`${stat.label}-${index}`}><Field label="Nilai" value={stat.value} onChange={(value) => { const stats = [...content.home.stats]; stats[index] = { ...stats[index], value }; setContent({ ...content, home: { ...content.home, stats } }); }}/><Field label="Label" value={stat.label} onChange={(value) => { const stats = [...content.home.stats]; stats[index] = { ...stats[index], label: value }; setContent({ ...content, home: { ...content.home, stats } }); }}/></div>)}</div></div>}

          {tab === "services" && <div className="admin-panel"><ArrayHeader title="Perkhidmatan" description="Tambah dan susun pintasan kepada urusan kerajaan." onAdd={() => setContent({ ...content, services: [...content.services, { id: `service-${Date.now()}`, title: "Perkhidmatan baharu", description: "Penerangan ringkas.", category: "Kerajaan", icon: "spark", href: "/", popular: false }] })}/><div className="admin-list">{content.services.map((service, index) => <article className="admin-item" key={service.id}><div className="admin-item__heading"><span><Icon name={service.icon}/></span><div><strong>{service.title}</strong><small>{service.category}</small></div><button onClick={() => setContent({ ...content, services: content.services.filter((_, i) => i !== index) })}><Icon name="trash" size={18}/></button></div><div className="admin-form-grid"><Field label="Tajuk" value={service.title} onChange={(value) => { const list = [...content.services]; list[index] = { ...service, title: value }; setContent({ ...content, services: list }); }}/><Field label="Kategori" value={service.category} onChange={(value) => { const list = [...content.services]; list[index] = { ...service, category: value }; setContent({ ...content, services: list }); }}/><Field label="Penerangan" value={service.description} textarea onChange={(value) => { const list = [...content.services]; list[index] = { ...service, description: value }; setContent({ ...content, services: list }); }}/><Field label="Pautan" value={service.href} onChange={(value) => { const list = [...content.services]; list[index] = { ...service, href: value }; setContent({ ...content, services: list }); }}/><Field label="Nama ikon" value={service.icon} onChange={(value) => { const list = [...content.services]; list[index] = { ...service, icon: value }; setContent({ ...content, services: list }); }}/><label className="admin-check"><input type="checkbox" checked={Boolean(service.popular)} onChange={(e) => { const list = [...content.services]; list[index] = { ...service, popular: e.target.checked }; setContent({ ...content, services: list }); }}/><span>Popular di halaman utama</span></label></div></article>)}</div></div>}

          {tab === "news" && <div className="admin-panel"><ArrayHeader title="Berita dan pengumuman" description="Penerbitan rasmi akan mendapat halaman sendiri secara automatik." onAdd={() => setContent({ ...content, news: [{ slug: `berita-${Date.now()}`, title: "Tajuk berita baharu", excerpt: "Ringkasan berita.", date: new Date().toISOString().slice(0, 10), category: "Pengumuman", ministry: "Kerajaan Inderaloka", body: ["Tulis isi berita di sini."], featured: false }, ...content.news] })}/><div className="admin-list">{content.news.map((item, index) => <article className="admin-item" key={`${item.slug}-${index}`}><div className="admin-item__heading"><span><Icon name="calendar"/></span><div><strong>{item.title}</strong><small>{item.date} · {item.category}</small></div><button onClick={() => setContent({ ...content, news: content.news.filter((_, i) => i !== index) })}><Icon name="trash" size={18}/></button></div><div className="admin-form-grid"><Field label="Tajuk" value={item.title} onChange={(value) => { const list = [...content.news]; list[index] = { ...item, title: value, slug: item.slug.startsWith("berita-") ? slugify(value) : item.slug }; setContent({ ...content, news: list }); }}/><Field label="Slug URL" value={item.slug} onChange={(value) => { const list = [...content.news]; list[index] = { ...item, slug: slugify(value) }; setContent({ ...content, news: list }); }}/><Field label="Tarikh" value={item.date} onChange={(value) => { const list = [...content.news]; list[index] = { ...item, date: value }; setContent({ ...content, news: list }); }}/><Field label="Kategori" value={item.category} onChange={(value) => { const list = [...content.news]; list[index] = { ...item, category: value }; setContent({ ...content, news: list }); }}/><Field label="Kementerian" value={item.ministry} onChange={(value) => { const list = [...content.news]; list[index] = { ...item, ministry: value }; setContent({ ...content, news: list }); }}/><Field label="Ringkasan" value={item.excerpt} textarea onChange={(value) => { const list = [...content.news]; list[index] = { ...item, excerpt: value }; setContent({ ...content, news: list }); }}/><Field label="Isi berita (asingkan perenggan dengan baris kosong)" value={item.body.join("\n\n")} textarea onChange={(value) => { const list = [...content.news]; list[index] = { ...item, body: value.split(/\n\s*\n/).filter(Boolean) }; setContent({ ...content, news: list }); }}/><label className="admin-check"><input type="checkbox" checked={Boolean(item.featured)} onChange={(e) => { const list = content.news.map((news, i) => ({ ...news, featured: i === index ? e.target.checked : false })); setContent({ ...content, news: list }); }}/><span>Berita utama</span></label></div></article>)}</div></div>}

          {tab === "ministries" && <div className="admin-panel"><ArrayHeader title="Kementerian" description="Urus direktori institusi dan pemimpin portfolio." onAdd={() => setContent({ ...content, ministries: [...content.ministries, { slug: `kementerian-${Date.now()}`, name: "Kementerian Baharu", shortName: "KB", minister: "Nama Menteri", portfolio: "Portfolio", description: "Penerangan kementerian.", icon: "building" }] })}/><div className="admin-list">{content.ministries.map((ministry, index) => <article className="admin-item" key={`${ministry.slug}-${index}`}><div className="admin-item__heading"><span><Icon name={ministry.icon}/></span><div><strong>{ministry.name}</strong><small>{ministry.minister}</small></div><button onClick={() => setContent({ ...content, ministries: content.ministries.filter((_, i) => i !== index) })}><Icon name="trash" size={18}/></button></div><div className="admin-form-grid"><Field label="Nama kementerian" value={ministry.name} onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, name: value }; setContent({ ...content, ministries: list }); }}/><Field label="Singkatan" value={ministry.shortName} onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, shortName: value }; setContent({ ...content, ministries: list }); }}/><Field label="Menteri" value={ministry.minister} onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, minister: value }; setContent({ ...content, ministries: list }); }}/><Field label="Portfolio" value={ministry.portfolio} onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, portfolio: value }; setContent({ ...content, ministries: list }); }}/><Field label="Penerangan" value={ministry.description} textarea onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, description: value }; setContent({ ...content, ministries: list }); }}/><Field label="Ikon" value={ministry.icon} onChange={(value) => { const list = [...content.ministries]; list[index] = { ...ministry, icon: value }; setContent({ ...content, ministries: list }); }}/></div></article>)}</div></div>}

          {tab === "pages" && <div className="admin-panel"><ArrayHeader title="Halaman tersuai" description="Tambah halaman baharu tanpa mencipta fail kod atau route secara manual." onAdd={() => setContent({ ...content, pages: [...content.pages, { slug: `halaman-${Date.now()}`, title: "Halaman baharu", eyebrow: "Maklumat rasmi", summary: "Ringkasan halaman.", showInNav: false, navLabel: "Halaman", sections: [{ heading: "Bahagian pertama", body: ["Tulis kandungan di sini."], bullets: [] }] }] })}/><div className="admin-list">{content.pages.map((page, index) => <article className="admin-item" key={`${page.slug}-${index}`}><div className="admin-item__heading"><span><Icon name="file"/></span><div><strong>{page.title}</strong><small>/halaman/{page.slug}</small></div><button onClick={() => setContent({ ...content, pages: content.pages.filter((_, i) => i !== index) })}><Icon name="trash" size={18}/></button></div><div className="admin-form-grid"><Field label="Tajuk" value={page.title} onChange={(value) => { const list = [...content.pages]; list[index] = { ...page, title: value }; setContent({ ...content, pages: list }); }}/><Field label="Slug URL" value={page.slug} onChange={(value) => { const list = [...content.pages]; list[index] = { ...page, slug: slugify(value) }; setContent({ ...content, pages: list }); }}/><Field label="Eyebrow" value={page.eyebrow} onChange={(value) => { const list = [...content.pages]; list[index] = { ...page, eyebrow: value }; setContent({ ...content, pages: list }); }}/><Field label="Ringkasan" value={page.summary} textarea onChange={(value) => { const list = [...content.pages]; list[index] = { ...page, summary: value }; setContent({ ...content, pages: list }); }}/><Field label="Label navigasi" value={page.navLabel} onChange={(value) => { const list = [...content.pages]; list[index] = { ...page, navLabel: value }; setContent({ ...content, pages: list }); }}/><label className="admin-check"><input type="checkbox" checked={page.showInNav} onChange={(e) => { const list = [...content.pages]; list[index] = { ...page, showInNav: e.target.checked }; setContent({ ...content, pages: list }); }}/><span>Paparkan dalam navigasi</span></label><Field label="Tajuk bahagian pertama" value={page.sections[0]?.heading || ""} onChange={(value) => { const list = [...content.pages]; const sections = page.sections.length ? [...page.sections] : [{ heading: "", body: [""], bullets: [] }]; sections[0] = { ...sections[0], heading: value }; list[index] = { ...page, sections }; setContent({ ...content, pages: list }); }}/><Field label="Isi bahagian pertama" value={page.sections[0]?.body.join("\n\n") || ""} textarea onChange={(value) => { const list = [...content.pages]; const sections = page.sections.length ? [...page.sections] : [{ heading: "", body: [""], bullets: [] }]; sections[0] = { ...sections[0], body: value.split(/\n\s*\n/).filter(Boolean) }; list[index] = { ...page, sections }; setContent({ ...content, pages: list }); }}/></div></article>)}</div></div>}

          {tab === "json" && <div className="admin-panel"><div className="admin-section-heading"><div><h2>JSON lanjutan</h2><p>Edit keseluruhan model kandungan atau pindahkan data antara deployment.</p></div><div><button className="admin-button admin-button--secondary" onClick={() => importRef.current?.click()}><Icon name="upload" size={17}/> Import</button><button className="admin-button admin-button--secondary" onClick={() => download("site-content.json", `${JSON.stringify(content, null, 2)}\n`)}><Icon name="download" size={17}/> Eksport</button></div></div><textarea className="json-editor" spellCheck={false} value={jsonText} onChange={(e) => { const value = e.target.value; setJsonText(value); try { setContent(JSON.parse(value) as SiteContent); } catch { /* Keep the text while it is temporarily invalid. */ } }}/><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files?.[0])}/><div className="admin-json-note"><Icon name="code"/><p>Untuk perubahan struktur yang kompleks, edit <code>data/site-content.json</code> melalui Jules AI atau IDE. Fail <code>AGENTS.md</code> menerangkan seni bina projek kepada Jules.</p></div></div>}
        </main>
      </div>
    </div>
  );
}
