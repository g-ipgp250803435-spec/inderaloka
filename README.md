# Portal Rasmi Kerajaan Inderaloka

Portal kerajaan rekaan yang dibina dengan **Next.js 16 App Router**, TypeScript dan CSS asli. Projek ini sengaja menggunakan sedikit dependency supaya mudah difahami, diubah oleh Jules AI, disimpan di GitHub dan dideploy ke Vercel.

## Ciri utama

- Reka bentuk responsif bertaraf portal kerajaan premium.
- Halaman utama, struktur kerajaan, kabinet, kementerian, perkhidmatan, berita, dokumen dan halaman tersuai.
- Carian global dengan pintasan `Ctrl/Cmd + K`.
- Tema gelap, pilihan teks besar, navigasi papan kekunci dan gaya cetakan.
- Banner makluman atau kecemasan.
- SEO metadata, Open Graph, JSON-LD, sitemap, robots, RSS dan manifest PWA.
- Content Studio di `/admin`.
- Edit teks, identiti, warna, logo, favicon, perkhidmatan, berita, kementerian dan halaman.
- Simpan draf dalam pelayar serta import/eksport JSON.
- Penerbitan ke GitHub melalui API pelayan; push tersebut mencetuskan deployment Vercel baharu.
- `AGENTS.md` untuk memberi konteks projek kepada Jules AI.

## 1. Jalankan secara tempatan

Keperluan: Node.js 20.9 atau lebih baharu.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Dalam mod development sahaja, kata laluan Content Studio menjadi `admin` sekiranya `ADMIN_PASSWORD` belum ditetapkan. Production tidak membenarkan kata laluan lalai.

## 2. Upload ke GitHub

1. Cipta repository GitHub kosong.
2. Extract fail ZIP ini.
3. Upload semua kandungan folder projek ke root repository, bukan folder luarnya.
4. Commit ke branch `main`.

Atau gunakan Git:

```bash
git init
git add .
git commit -m "Initial Inderaloka portal"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## 3. Deploy ke Vercel

1. Dalam Vercel, pilih **Add New → Project**.
2. Import repository GitHub tersebut.
3. Framework akan dikesan sebagai Next.js.
4. Tambah environment variables di bawah.
5. Tekan **Deploy**.

Vercel akan membuat deployment baharu bagi setiap push atau merge ke branch production.

## 4. Environment variables

Tetapkan melalui **Vercel → Project Settings → Environment Variables**:

| Nama | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL production bagi metadata, sitemap dan RSS. |
| `ADMIN_PASSWORD` | Kata laluan Content Studio. |
| `ADMIN_SESSION_SECRET` | Rahsia rawak panjang untuk menandatangani cookie sesi. |
| `GITHUB_TOKEN` | Fine-grained GitHub token dengan `Contents: Read and write`. |
| `GITHUB_OWNER` | Nama pengguna atau organisasi pemilik repository. |
| `GITHUB_REPO` | Nama repository. |
| `GITHUB_BRANCH` | Lazimnya `main`. |

Jana nilai `ADMIN_SESSION_SECRET` dengan:

```bash
openssl rand -hex 32
```

### Token GitHub yang selamat

Gunakan **fine-grained personal access token**, hadkan kepada satu repository ini sahaja dan beri kebenaran minimum `Contents: Read and write`. Jangan letakkan token dalam fail atau commit Git. Token hanya digunakan dalam route pelayan dan tidak dihantar kepada browser.

## 5. Cara Content Studio menerbitkan kandungan

1. Pentadbir log masuk di `/admin`.
2. Kandungan diedit dalam antaramuka.
3. Draf disimpan dalam `localStorage` browser.
4. Apabila **Terbit ke GitHub** ditekan, route pelayan mengemas kini `data/site-content.json` melalui GitHub Contents API.
5. GitHub menerima commit baharu.
6. Vercel mengesan commit dan melakukan deployment.

Muat naik logo atau favicon juga disimpan ke `public/uploads/` melalui commit GitHub. Selepas aset dimuat naik, tekan **Terbit ke GitHub** untuk menyimpan laluan aset dalam kandungan.

Sekiranya GitHub variables belum disediakan, gunakan fungsi **Eksport** di tab JSON dan gantikan `data/site-content.json` secara manual.

## 6. Integrasi Jules AI

1. Upload projek ini ke GitHub.
2. Buka Jules dan sambungkan akaun GitHub.
3. Berikan Jules akses kepada repository ini.
4. Jules akan membaca `AGENTS.md` secara automatik.
5. Pilih repository dan branch, kemudian beri tugasan khusus.

Contoh prompt:

```text
Tambah halaman “Pelaburan di Inderaloka” menggunakan gaya sedia ada. Letakkan pautan dalam navigasi, tambah tiga sektor utama dan jangan tambah dependency baharu. Jalankan npm run build sebelum membuka pull request.
```

```text
Naik taraf Content Studio supaya setiap halaman boleh mempunyai lebih daripada satu bahagian kandungan. Kekalkan keserasian dengan data sedia ada dan kemas kini AGENTS.md.
```

## 7. Fail penting

- `data/site-content.json` — semua kandungan portal.
- `lib/types.ts` — kontrak TypeScript bagi kandungan.
- `app/globals.css` — keseluruhan design system.
- `components/AdminStudio.tsx` — editor kandungan.
- `app/api/admin/publish/route.ts` — penerbitan kandungan ke GitHub.
- `app/api/admin/upload/route.ts` — muat naik imej melalui GitHub.
- `AGENTS.md` — panduan untuk Jules dan coding agents.

## 8. Sebelum penggunaan sebenar

Projek ini sesuai sebagai portal demonstrasi, prototaip atau asas production. Sebelum mengendalikan data kerajaan atau transaksi sebenar:

- gunakan identity provider organisasi dan MFA, bukan kata laluan tunggal;
- gunakan pangkalan data/CMS dengan workflow kelulusan dan audit log;
- tambah WAF, pemantauan, backup dan ujian pemulihan;
- lakukan audit WCAG, keselamatan dan penetration testing;
- asingkan portal maklumat daripada sistem transaksi sensitif;
- gantikan kandungan, domain dan maklumat rekaan.

## Lesen

Boleh digunakan dan diubah untuk projek Inderaloka. Aset lambang dalam projek ini ialah rekaan asal generik bagi prototaip ini.
