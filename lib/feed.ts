// Kabar Kilat — agregator RSS server-side.
//
// MODEL KONTEN (anti-plagiat, aman AdSense):
// - Judul diambil apa adanya dari RSS sumber.
// - Ringkasan = maksimal 2 kalimat / ~220 karakter, dikutip dari deskripsi
//   RSS yang sudah dibersihkan dari tag HTML, dengan atribusi sumber yang
//   jelas. BUKAN artikel utuh, BUKAN tulis-ulang AI (tidak ada layanan AI
//   di aplikasi ini).
// - Setiap item WAJIB punya link "Baca selengkapnya di [Sumber]" ke artikel
//   asli (target _blank). Artikel lengkap hanya dibaca di situs sumber.
// - Gambar HANYA og:image dari halaman artikel sumber (dengan kredit +
//   link balik), atau tanpa gambar bila tidak ada. Tidak ada hotlink gambar
//   lain, tidak ada gambar stok tanpa lisensi.
//
// SUMBER (terverifikasi fetch langsung, Sab 21 Nov 2026 ~22:20-22:40 WIB):
//   Islami: NU Online, Republika
//   Umum: Antara, Detik, CNN Indonesia, CNN Indonesia Nasional
//   Viral: Google News Indonesia (link item = redirect news.google.com —
//          diikuti server-side sampai URL final artikel asli; bila Google
//          menolak fetch otomatis (HTTP 400, teruji 21 Nov 2026), link
//          Google News tetap dipakai — peramban pengguna tetap diarahkan
//          ke artikel asli — dan media asli ditampilkan dari <source> RSS)
// DICORET (jangan dipakai): Kompas (RSS 404), Tempo (403 anti-bot),
// Muslim.or.id (item terbaru >24 jam), Google Trends RSS (404),
// Reddit (404/HTML, butuh login/API).

export type Category = "islami" | "umum" | "viral";

export type NewsItem = {
  title: string;
  link: string; // URL final artikel asli (bila redirect Google News berhasil di-resolve)
  source: string; // nama media sumber (dari <source> RSS / domain link)
  category: Category;
  publishedAt: string; // ISO
  summary: string; // ringkasan pendek ber-atribusi (maks ~220 karakter)
  imageUrl?: string; // og:image dari halaman artikel sumber
  aggregator?: string; // mis. "Google News" bila item datang lewat agregator
};

export type NewsFeed = {
  items: NewsItem[];
  sources: string[]; // sumber yang berhasil di-fetch
  failedSources: string[]; // sumber yang gagal (item kosong, bukan berita palsu)
  fetchedAt: string; // ISO
};

type SourceDef = {
  name: string;
  category: Category;
  urls: string[];
  islamOnly?: boolean; // filter kata kunci Islam (feed Republika umum)
};

const SOURCES: SourceDef[] = [
  { name: "NU Online", category: "islami", urls: ["https://nu.or.id/rss.xml"] },
  {
    name: "Republika",
    category: "islami",
    urls: ["https://republika.co.id/rss"],
    islamOnly: true,
  },
  { name: "Antara", category: "umum", urls: ["https://www.antaranews.com/rss/terkini"] },
  { name: "Detik", category: "umum", urls: ["https://news.detik.com/rss"] },
  { name: "CNN Indonesia", category: "umum", urls: ["https://www.cnnindonesia.com/rss"] },
  {
    name: "CNN Indonesia",
    category: "umum",
    urls: ["https://www.cnnindonesia.com/nasional/rss"],
  },
  {
    name: "Google News",
    category: "viral",
    urls: ["https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id"],
  },
];

export const CATEGORY_LABEL: Record<Category, string> = {
  islami: "Islami",
  umum: "Umum",
  viral: "Viral",
};

export const CATEGORIES: Category[] = ["islami", "umum", "viral"];

// ---------------------------------------------------------------------------
// Util parsing RSS (regex ringan, tanpa dependensi — pola yang sama dengan
// ABEE Muslim /app/api/berita).
// ---------------------------------------------------------------------------

// Entitas bernama yang umum muncul di deskripsi RSS (Republika memakai
// &mdash; / &nbsp; di dateline, dsb.). Tanpa ini ringkasan menampilkan teks
// mentah seperti "&mdash;" di layar (teruji 21 Nov 2026).
const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  mdash: "—", ndash: "–", hellip: "…", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", copy: "©",
  reg: "®", trade: "™", deg: "°", plusmn: "±", times: "×",
  divide: "÷", frac12: "½", frac14: "¼", frac34: "¾", euro: "€",
  pound: "£", yen: "¥", cent: "¢", sect: "§", para: "¶",
  middot: "·", bull: "•", dagger: "†", Dagger: "‡", permil: "‰",
  prime: "′", Prime: "″", ensp: " ", emsp: " ", thinsp: " ",
  zwnj: "", zwj: "", sbquo: "‚", bdquo: "„", shy: "",
};

function decodeEntities(s: string): string {
  return s
    // &amp; dulu: entitas yang dikodekan ganda (mis. &amp;nbsp;) jadi
    // sekali-kode, lalu didekode oleh langkah bernama di bawah.
    .replace(/&amp;/g, "&")
    .replace(/&([a-zA-Z]+);/g, (_, name: string) =>
      name in NAMED_ENTITIES ? NAMED_ENTITIES[name] : `&${name};`
    )
    .replace(/&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
      String.fromCodePoint(parseInt(n, 16))
    );
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decodeEntities(stripCdata(m[1].trim())) : "";
}

function rawPick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? stripCdata(m[1].trim()) : "";
}

function cleanText(html: string): string {
  return decodeEntities(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImgSrc(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractMediaUrl(block: string): string | null {
  const m =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i) ||
    block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image\//i);
  return m ? decodeEntities(m[1].trim()) : null;
}

function extractOgImage(html: string): string | null {
  const m =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    ) ||
    html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
    );
  return m ? decodeEntities(m[1].trim()) : null;
}

// Ringkasan pendek ber-atribusi: maksimal 2 kalimat / ~220 karakter dari
// deskripsi RSS. Bukan artikel utuh, bukan tulis-ulang AI.
export function makeSummary(description: string, title: string): string {
  const clean = cleanText(description).replace(/^[^a-zA-Z0-9\u00C0-\u024F]+/, "");
  if (!clean || clean.toLowerCase() === title.toLowerCase()) return "";
  const sentences = clean.match(/[^.!?]+[.!?]+["')\]]*\s*/g) ?? [clean];
  let out = "";
  for (const s of sentences.slice(0, 2)) {
    if ((out + s).trim().length > 230) break;
    out += s;
  }
  out = out.trim();
  if (!out) out = clean.slice(0, 220);
  if (out.length > 220) {
    out = out.slice(0, 217).replace(/\s+\S*$/, "") + "…";
  }
  return out;
}

type RawItem = {
  title: string;
  link: string;
  publishedAt: string;
  description: string;
  imageUrl?: string;
  sourceName?: string; // isi <source> RSS (khusus Google News: media asli)
  sourceUrl?: string; // atribut url pada <source>
};

// Nama media asli dari elemen <source> Google News RSS. Isinya kadang nama
// ("detikNews"), kadang URL ("https://janalokajournal.id/") — normalisasi.
function cleanPublisherName(name: string, url: string): string {
  const known: Record<string, string> = {
    detiknews: "Detik",
    "cnn indonesia": "CNN Indonesia",
    "kompas.com": "Kompas",
    "liputan6.com": "Liputan6",
    "tribunnews.com": "Tribunnews",
    "tempo.co": "Tempo",
    "antaranews.com": "Antara",
    "republika.co.id": "Republika",
    "nu.or.id": "NU Online",
  };
  const key = name.trim().toLowerCase();
  if (known[key]) return known[key];
  if (/^https?:\/\//i.test(name.trim()) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(name.trim())) {
    try {
      return new URL(/^https?:\/\//i.test(name.trim()) ? name.trim() : `https://${name.trim()}`).hostname.replace(/^www\./, "");
    } catch {
      return name.trim();
    }
  }
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      // abaikan
    }
  }
  return name.trim();
}

function parseRss(xml: string): RawItem[] {
  const out: RawItem[] = [];
  const blocks = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  for (const block of blocks) {
    const title = pick(block, "title");
    const link = pick(block, "link");
    if (!title || !link) continue;
    const srcMatch = block.match(
      /<source[^>]*url=["']([^"']*)["'][^>]*>([\s\S]*?)<\/source>/i
    );
    out.push({
      title,
      link,
      publishedAt: pick(block, "pubDate"),
      description: cleanText(rawPick(block, "description")),
      imageUrl:
        extractMediaUrl(block) ??
        extractImgSrc(rawPick(block, "content:encoded")) ??
        extractImgSrc(rawPick(block, "description")) ??
        undefined,
      sourceName: srcMatch ? decodeEntities(srcMatch[2].trim()) : undefined,
      sourceUrl: srcMatch ? decodeEntities(srcMatch[1].trim()) : undefined,
    });
  }
  return out;
}

// Filter Republika (feed umum): hanya judul/deskripsi bertema Islam.
const ISLAM_KEYWORDS = [
  "islam", "syariah", "masjid", "haji", "umrah", "umroh", "qur'an", "quran",
  "al-quran", "ulama", "pesantren", "wakaf", "ramadhan", "ramadan", "shalat",
  "sholat", "zakat", "kyai", "ustaz", "ustadz", "mui", "kemenag", "wamenag",
  "madrasah", "santri", "dakwah", "fiqih", "fikih", "fatwa", "halal", "hijrah",
  "imam", "khatib", "tarawih", "idul", "lebaran", "kurban", "aqiqah", "tauhid",
  "akidah", "sunnah", "hadits", "hadis", "nabi", "rasul", "muslim", "mukmin",
  "ibadah", "dzikir", "zikir", "tasbih", "tahajud", "dhuha", "puasa", "sedekah",
  "infak", "infaq", "yatim", "pondok", "tafsir", "mushaf", "tilawah", "murottal",
  "khutbah", "jumat", "jum'at", "buka puasa", "sahur", "shahih", "shohih",
];

// Istilah olahraga — artikel olahraga dikecualikan walau mengandung kata
// kunci Islam (mis. nama orang "Imam"/"Muslim", atau hari "Jumat" di tanggal).
const SPORTS_KEYWORDS = [
  "suporter", "laga", "skor", "semifinal", "perempat final", "badminton",
  "sepak bola", "timnas", "pssi", "pertandingan", "liga",
];
// Kata pendek — hanya cocok bila berdiri sendiri ("golongan" bukan "gol").
const SPORTS_WORDS = [/\bgol\b/];

function isIslamic(title: string, description: string): boolean {
  // Hapus "Jumat" yang diikuti tanggal ("Jumat (20/11/2026)",
  // "Jumat, 20 November 2026") — itu nama hari, bukan topik Islam.
  // "Shalat Jumat" / "Jumat Berkah" (tanpa tanggal) tetap dihitung.
  const hay = ` ${title} ${description} `
    .toLowerCase()
    .replace(/\bjum['’]?at\b\s*[,(\[]?\s*\d/g, " ");
  if (SPORTS_KEYWORDS.some((k) => hay.includes(k))) return false;
  if (SPORTS_WORDS.some((re) => re.test(hay))) return false;
  return ISLAM_KEYWORDS.some((k) => hay.includes(k));
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
// PENTING: JANGAN pakai UA Android Mobile — Republika mengembalikan 404
// untuk UA "Linux; Android 10; K ... Chrome/124.0 Mobile" (teruji 21 Nov
// 2026), sementara UA desktop Chrome di atas diterima semua 7 sumber.

async function fetchText(
  url: string,
  timeoutMs: number,
  lang = false
): Promise<{ text: string; finalUrl: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": UA,
        ...(lang ? { "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8" } : {}),
      },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { text: await res.text(), finalUrl: res.url };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRss(url: string): Promise<RawItem[]> {
  const { text: xml } = await fetchText(url, 12000);
  if (!xml.includes("<rss") && !xml.includes("<feed")) {
    throw new Error("Bukan RSS");
  }
  return parseRss(xml);
}

// Nama sumber dari domain link final (mis. item Republika yang mengarah ke
// skor.id ditampilkan sebagai "skor.id"). Dipakai untuk atribusi yang jujur.
export function sourceFromUrl(link: string, fallback: string): string {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    const map: Record<string, string> = {
      "republika.co.id": "Republika",
      "skor.id": "skor.id",
      "nu.or.id": "NU Online",
      "antaranews.com": "Antara",
      "detik.com": "Detik",
      "cnnindonesia.com": "CNN Indonesia",
    };
    return map[host] ?? fallback;
  } catch {
    return fallback;
  }
}

async function fetchSource(src: SourceDef): Promise<NewsItem[]> {
  // Coba sekali, lalu ulangi sekali (retry) — pola yang sama dengan ABEE:
  // Republika sempat gagal sesaat pada 21 Nov 2026 padahal feed-nya hidup.
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const items = await fetchRss(src.urls[0]);
      const kept = src.islamOnly
        ? items.filter((it) => isIslamic(it.title, it.description))
        : items;
      return kept.map((it) => {
        // Google News: media asli dari elemen <source> RSS; agregator
        // dicatat terpisah supaya label "via Google News" tetap jujur.
        const isGoogleNews = src.name === "Google News";
        const publisher =
          isGoogleNews && it.sourceName
            ? cleanPublisherName(it.sourceName, it.sourceUrl ?? "")
            : null;
        return {
          title: it.title,
          link: it.link,
          source: publisher ?? sourceFromUrl(it.link, src.name),
          category: src.category,
          publishedAt: it.publishedAt
            ? new Date(it.publishedAt).toISOString()
            : new Date(0).toISOString(),
          summary: makeSummary(it.description, it.title),
          imageUrl: it.imageUrl,
          ...(isGoogleNews ? { aggregator: "Google News" } : {}),
        };
      });
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Gagal memuat feed");
}

// Google News: link item = redirect news.google.com/rss/articles/... —
// ikuti redirect server-side sampai URL final artikel asli, sekaligus ambil
// og:image dari halaman artikel. Hanya untuk N item teratas (hemat waktu).
// CATATAN (diuji 21 Nov 2026): endpoint redirect Google mengembalikan
// HTTP 400 untuk fetch otomatis dari server (curl/undici), baik dengan
// maupun tanpa Accept-Language id-ID — redirect ke penerbit hanya jalan di
// peramban sungguhan. Karena itu resolve bersifat best-effort: bila gagal,
// link Google News tetap dipakai (bisa diklik — peramban pengguna akan
// diarahkan Google ke artikel asli), dan nama media asli tetap tampil dari
// elemen <source> RSS (lihat fetchSource).
async function resolveGoogleNews(items: NewsItem[], limit = 12): Promise<void> {
  await Promise.all(
    items.slice(0, limit).map(async (it) => {
      try {
        const { text: html, finalUrl } = await fetchText(it.link, 9000, true);
        if (finalUrl && !finalUrl.includes("news.google.com")) {
          it.link = finalUrl;
          it.source = sourceFromUrl(finalUrl, it.source);
        }
        if (!it.imageUrl) {
          const og = extractOgImage(html);
          if (og) it.imageUrl = og;
        }
      } catch {
        // Gagal resolve: biarkan link Google News apa adanya (tetap bisa
        // diklik; atribusi tetap dari <source> RSS). Jangan sembunyikan item.
      }
    })
  );
}

// og:image untuk item teratas non-Viral yang belum punya gambar.
async function enrichOgImages(items: NewsItem[], limit = 12): Promise<void> {
  await Promise.all(
    items.slice(0, limit).map(async (it) => {
      if (it.imageUrl) return;
      try {
        const { text: html } = await fetchText(it.link, 8000);
        const og = extractOgImage(html);
        if (og) it.imageUrl = og;
      } catch {
        // tanpa gambar — kartu tetap tampil tanpa thumbnail
      }
    })
  );
}

// ---------------------------------------------------------------------------
// Cache in-memory 10 menit (revalidate 600 — pola yang sama dengan ABEE).
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 10 * 60 * 1000;
let cache: { at: number; feed: NewsFeed } | null = null;
let inflight: Promise<NewsFeed> | null = null;

export async function getNews(): Promise<NewsFeed> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.feed;
  if (inflight) return inflight;
  inflight = (async () => {
    const settled = await Promise.allSettled(SOURCES.map((s) => fetchSource(s)));
    const items: NewsItem[] = [];
    const failedSources: string[] = [];
    settled.forEach((r, i) => {
      if (r.status === "fulfilled") items.push(...r.value);
      else failedSources.push(SOURCES[i].name);
    });
    items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

    const viral = items.filter((i) => i.category === "viral");
    const rest = items.filter((i) => i.category !== "viral");
    await Promise.all([
      resolveGoogleNews(viral),
      enrichOgImages(rest),
    ]);

    // Dedup berdasarkan link final (CNN utama + CNN Nasional bisa tumpang
    // tindih; Google News bisa memuat ulang item yang sama).
    const seen = new Set<string>();
    const deduped = items.filter((it) => {
      const key = it.link.replace(/[#?].*$/, "").toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const feed: NewsFeed = {
      items: deduped,
      sources: SOURCES.filter((s) => !failedSources.includes(s.name)).map(
        (s) => s.name
      ),
      failedSources,
      fetchedAt: new Date().toISOString(),
    };
    cache = { at: Date.now(), feed };
    inflight = null;
    return feed;
  })();
  return inflight;
}
