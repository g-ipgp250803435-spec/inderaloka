import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="not-found container">
      <span>404</span>
      <h1>Halaman tidak ditemui</h1>
      <p>Alamat mungkin telah berubah atau halaman tersebut belum diterbitkan.</p>
      <Link href="/" className="button">Kembali ke halaman utama <Icon name="arrow" size={18} /></Link>
    </section>
  );
}
