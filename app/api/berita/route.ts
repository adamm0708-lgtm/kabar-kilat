import { NextResponse } from "next/server";
import { getNews } from "@/lib/feed";

// GET /api/berita — agregator RSS server-side, cache 10 menit (lihat lib/feed.ts).
// Satu sumber mati tidak menjatuhkan yang lain (Promise.allSettled di getNews).
// Gagal total = 502 + pesan jujur, bukan berita palsu.
export const revalidate = 600;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const feed = await getNews();
    const url = new URL(req.url);
    const kategori = url.searchParams.get("kategori");
    const limit = Math.min(
      Math.max(parseInt(url.searchParams.get("limit") ?? "60", 10) || 60, 1),
      100
    );
    const items = kategori
      ? feed.items.filter((i) => i.category === kategori)
      : feed.items;
    const body = { ...feed, items: items.slice(0, limit) };
    if (feed.items.length === 0) {
      return NextResponse.json(
        { ...body, error: "Berita tidak bisa dimuat saat ini. Silakan coba lagi nanti." },
        { status: 502 }
      );
    }
    return NextResponse.json(body);
  } catch {
    return NextResponse.json(
      {
        items: [],
        sources: [],
        failedSources: [],
        fetchedAt: new Date().toISOString(),
        error: "Berita tidak bisa dimuat saat ini. Silakan coba lagi nanti.",
      },
      { status: 502 }
    );
  }
}
