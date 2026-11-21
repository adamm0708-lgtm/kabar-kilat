import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNews, CATEGORIES, CATEGORY_LABEL, type Category } from "@/lib/feed";
import NewsList from "@/components/NewsList";

export const revalidate = 600;

const CAT_DESC: Record<Category, string> = {
  islami: "Berita Islam dari NU Online dan Republika — hanya judul dan ringkasan pendek ber-atribusi, artikel lengkap dibaca di situs sumbernya.",
  umum: "Berita nasional dari Antara, Detik, dan CNN Indonesia — hanya judul dan ringkasan pendek ber-atribusi, artikel lengkap dibaca di situs sumbernya.",
  viral: "Yang sedang ramai diperbincangkan. Sumber: Google News — tautan mengikuti redirect ke artikel asli di media penerbitnya.",
};

export function generateStaticParams() {
  return CATEGORIES.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (!CATEGORIES.includes(params.slug as Category)) return {};
  return {
    title: `Berita ${CATEGORY_LABEL[params.slug as Category]}`,
    description: CAT_DESC[params.slug as Category],
  };
}

export default async function KategoriPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!CATEGORIES.includes(params.slug as Category)) notFound();
  const category = params.slug as Category;
  const feed = await getNews();
  const items = feed.items.filter((i) => i.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4">
      <header className="mt-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Berita {CATEGORY_LABEL[category]}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
          {CAT_DESC[category]}
        </p>
      </header>
      {feed.failedSources.length > 0 ? (
        <p
          className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs leading-relaxed text-amber-900 sm:text-sm"
          role="alert"
        >
          Sebagian sumber sedang tidak bisa dimuat ({feed.failedSources.join(", ")}
          ).
        </p>
      ) : null}
      <div className="mt-6">
        {items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-bold text-slate-900">
              Berita {CATEGORY_LABEL[category]} tidak bisa dimuat saat ini
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Sumber kategori ini sedang tidak merespons. Kami tidak
              menampilkan berita palsu — silakan coba lagi beberapa saat lagi.
            </p>
          </div>
        ) : (
          <NewsList
            items={items}
            emptyText="Tidak ada berita yang cocok dengan pencarian Anda."
          />
        )}
      </div>
    </div>
  );
}
