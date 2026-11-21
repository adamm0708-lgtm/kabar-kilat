# Kabar Kilat

Situs agregator berita — judul + ringkasan pendek ber-atribusi dari RSS resmi
media tepercaya, dengan tautan ke artikel asli. **Tidak menampilkan teks
artikel lengkap, tidak ada tulis-ulang AI.**

## Stack

- Next.js 14 (App Router) + React 18 + Tailwind CSS 3
- Tanpa database, tanpa layanan AI. Data diambil server-side dari RSS.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm start        # jalankan hasil build
```

## Struktur

```
app/
  layout.tsx            # layout global: header + footer
  page.tsx              # Beranda: hero, Berita Terbaru + pencarian, seksi kategori
  kategori/[slug]/page.tsx  # /kategori/islami | /kategori/umum | /kategori/viral
  tentang/page.tsx      # model konten & bukan plagiat
  kontak/page.tsx       # redaksi@kabarkilat.id + form mailto (tanpa backend)
  privasi/page.tsx      # Kebijakan Privasi (termasuk AdSense)
  disclaimer/page.tsx   # sumber, atribusi, hak cipta
  api/berita/route.ts   # GET /api/berita — JSON agregat (cache 10 mnt)
components/
  SiteHeader.tsx  SiteFooter.tsx  NewsCard.tsx  NewsList.tsx  PageShell.tsx
lib/
  feed.ts   # sumber RSS, parsing, ringkasan, resolve redirect Google News,
            # og:image, cache in-memory 10 menit
  format.ts # waktu relatif id-ID ("2 jam lalu")
```

## API

`GET /api/berita` — query opsional `?kategori=islami|umum|viral`
dan `&limit=N` (maks 100, default 60). Respons:

```json
{
  "items": [{ "title", "link", "source", "category", "publishedAt", "summary", "imageUrl?" }],
  "sources": ["NU Online", "Republika", ...],
  "failedSources": [],
  "fetchedAt": "2026-11-21T..."
}
```

Gagal total → HTTP 502 + `error` (pesan jujur, bukan berita palsu).

## Sumber RSS (terverifikasi 21 Nov 2026)

| Kategori | Sumber | Feed |
| --- | --- | --- |
| Islami | NU Online | https://nu.or.id/rss.xml |
| Islami | Republika | https://republika.co.id/rss (difilter kata kunci Islam) |
| Umum | Antara | https://www.antaranews.com/rss/terkini |
| Umum | Detik | https://news.detik.com/rss |
| Umum | CNN Indonesia | https://www.cnnindonesia.com/rss |
| Umum | CNN Indonesia | https://www.cnnindonesia.com/nasional/rss |
| Viral | Google News | https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id |

Catatan:

- Link Google News adalah redirect `news.google.com/rss/articles/...` —
  diikuti server-side sampai URL final artikel asli. **Temuan uji 21 Nov
  2026:** endpoint redirect Google mengembalikan HTTP 400 untuk fetch
  otomatis dari server, jadi resolve bersifat best-effort; bila gagal, link
  Google News tetap dipakai (peramban pengguna tetap diarahkan ke artikel
  asli) dan media asli ditampilkan dari elemen `<source>` RSS.
- Sebagian item Republika mengarah ke `skor.id` (satu grup) — nama sumber
  ditampilkan sesuai domain link.
- Gambar hanya `og:image` dari halaman artikel sumber, dengan kredit sumber.
- **Dicoret / jangan dipakai:** Kompas (RSS 404), Tempo (403 anti-bot),
  Muslim.or.id (tidak segar), Google Trends RSS (404), Reddit (butuh login/API).

## Model konten (anti-plagiat)

1. Judul apa adanya dari RSS.
2. Ringkasan maks. 2 kalimat / ~220 karakter dari deskripsi RSS yang
   dibersihkan dari HTML — berlabel “Ringkasan”, bukan artikel utuh.
3. Tiap item wajib punya tombol “Baca selengkapnya di [Sumber]” ke artikel asli.
4. Tidak ada layanan AI di runtime — tidak ada parafrase otomatis.
5. Penjelasan jujur di halaman `/tentang` dan `/disclaimer`.

## Yang masih manual / belum

- Belum ada artikel orisinal penuh hasil liputan redaksi (langkah editorial
  manual berikutnya).
- Belum ada iklan AdSense terpasang (hanya kebijakan di `/privasi`).
- Belum deploy dan belum ada repo GitHub — lokal saja.
