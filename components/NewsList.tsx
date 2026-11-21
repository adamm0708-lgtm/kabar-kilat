"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/feed";
import NewsCard from "./NewsCard";

export default function NewsList({
  items,
  emptyText = "Tidak ada berita yang cocok.",
}: {
  items: NewsItem[];
  emptyText?: string;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.source.toLowerCase().includes(q) ||
        it.summary.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div>
      <div className="relative">
        <label htmlFor="cari-berita" className="sr-only">
          Cari berita
        </label>
        <input
          id="cari-berita"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari berita berdasarkan judul atau sumber…"
          className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
        />
      </div>
      {query.trim() ? (
        <p className="mt-3 text-sm text-slate-500" role="status">
          {filtered.length} hasil untuk “{query.trim()}”
        </p>
      ) : null}
      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => (
            <NewsCard key={it.link} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
