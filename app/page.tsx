import Link from "next/link";
import { getNews, CATEGORIES, CATEGORY_LABEL, type Category } from "@/lib/feed";
import { NewsCardHero } from "@/components/NewsCard";
import NewsCard from "@/components/NewsCard";
import NewsList from "@/components/NewsList";

export const revalidate = 600;

function SectionHead({
  title,
  href,
  desc,
}: {
  title: string;
  href: string;
  desc: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-emerald-700 hover:underline"
      >
        Lihat semua →
      </Link>
    </div>
  );
}

export default async function Home() {
  const feed = await getNews();
  const items = feed.items;
  const hero = items[0];
  const rest = items.slice(1);
  const byCat = (c: Category) => items.filter((i) => i.category === c);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4">
      {/* Pita info model konten */}
      <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs leading-relaxed text-emerald-900 sm:text-sm">
        Kabar Kilat menampilkan <strong>judul + ringkasan pendek</strong>{" "}
        dari media tepercaya, lengkap dengan atribusi dan tautan ke artikel
        asli. Artikel lengkap hanya dibaca di situs sumbernya.{" "}
        <Link href="/disclaimer" className="font-semibold underline">
          Pelajari model konten kami
        </Link>
      </p>

      {feed.failedSources.length > 0 ? (
        <p
          className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-900 sm:text-sm"
          role="alert"
        >
          Sebagian sumber sedang tidak bisa dimuat ({feed.failedSources.join(", ")}
          ). Berita di bawah ini berasal dari sumber lain yang masih aktif.
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-bold text-slate-900">
            Berita tidak bisa dimuat saat ini
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
            Semua sumber berita sedang tidak merespons. Kami tidak menampilkan
            berita palsu — silakan muat ulang halaman beberapa saat lagi.
          </p>
        </div>
      ) : (
        <>
          {/* Berita utama + daftar terbaru + pencarian */}
          <section className="mt-5">
            {hero ? <NewsCardHero item={hero} /> : null}
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              Berita Terbaru
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Gabungan semua sumber, diurutkan dari yang terbaru.
            </p>
            <div className="mt-4">
              <NewsList items={rest} emptyText="Tidak ada berita terbaru saat ini." />
            </div>
          </section>

          {/* Seksi per kategori */}
          {CATEGORIES.map((c) => {
            const list = byCat(c).slice(0, 3);
            if (list.length === 0) return null;
            return (
              <section key={c} className="mt-12">
                <SectionHead
                  title={CATEGORY_LABEL[c]}
                  href={`/kategori/${c}`}
                  desc={
                    c === "islami"
                      ? "Berita Islam dari NU Online dan Republika."
                      : c === "umum"
                        ? "Berita nasional dari Antara, Detik, dan CNN Indonesia."
                        : "Yang sedang ramai diperbincangkan — sumber: Google News."
                  }
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((it) => (
                    <NewsCard key={it.link} item={it} />
                  ))}
                </div>
              </section>
            );
          })}

          <p className="mt-10 text-center text-xs text-slate-400">
            Sumber: {feed.sources.join(" · ")} · Diperbarui{" "}
            {new Date(feed.fetchedAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB · Data diperbarui tiap 10 menit.
          </p>
        </>
      )}
    </div>
  );
}
