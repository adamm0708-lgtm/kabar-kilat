"use client";

import { useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/lib/feed";
import { CATEGORY_LABEL } from "@/lib/feed";
import { timeAgo, fullDate } from "@/lib/format";

const CATEGORY_BADGE: Record<NewsItem["category"], string> = {
  islami: "bg-emerald-600 text-white",
  umum: "bg-sky-600 text-white",
  viral: "bg-rose-600 text-white",
};

// Gambar HANYA og:image dari halaman artikel sumber. Bila gambar gagal
// dimuat (CDN memblokir hotlink / URL mati), area gambar DAN kredit "Foto:"
// disembunyikan — kartu tetap tampil lengkap tanpa kotak abu-abu rusak.
function CardFooter({ item, imgOk }: { item: NewsItem; imgOk: boolean }) {
  return (
    <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
      {imgOk && item.imageUrl ? (
        <span className="whitespace-nowrap text-xs text-slate-400">
          Foto: {item.source}
          {item.aggregator ? ` · via ${item.aggregator}` : ""}
        </span>
      ) : (
        <span className="text-xs text-slate-400">
          {item.aggregator ? `via ${item.aggregator}` : ""}
        </span>
      )}
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
      >
        Baca selengkapnya di {item.source} →
      </a>
    </div>
  );
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const [imgOk, setImgOk] = useState(!!item.imageUrl);
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {imgOk && item.imageUrl ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[16/9] w-full overflow-hidden bg-slate-100"
          aria-label={`Baca selengkapnya di ${item.source}: ${item.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
          />
        </a>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2.5 py-0.5 font-semibold ${CATEGORY_BADGE[item.category]}`}
          >
            {CATEGORY_LABEL[item.category]}
          </span>
          <span className="font-semibold text-slate-700">{item.source}</span>
          <span className="text-slate-400">·</span>
          <time dateTime={item.publishedAt} title={fullDate(item.publishedAt)} className="text-slate-500">
            {timeAgo(item.publishedAt)}
          </time>
        </div>
        <h3 className="mt-2.5 text-base font-bold leading-snug text-slate-900">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 hover:underline"
          >
            {item.title}
          </a>
        </h3>
        {item.summary ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-500">Ringkasan: </span>
            {item.summary}
          </p>
        ) : null}
        <CardFooter item={item} imgOk={imgOk} />
      </div>
    </article>
  );
}

// Kartu hero (item pertama): lebih besar, dipakai di beranda.
export function NewsCardHero({ item }: { item: NewsItem }) {
  const [imgOk, setImgOk] = useState(!!item.imageUrl);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {imgOk && item.imageUrl ? (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[16/8] w-full overflow-hidden bg-slate-100"
          aria-label={`Baca selengkapnya di ${item.source}: ${item.title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt=""
            loading="eager"
            referrerPolicy="no-referrer"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
          />
        </a>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-rose-600 px-2.5 py-0.5 font-semibold text-white">
            Berita Utama
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 font-semibold ${CATEGORY_BADGE[item.category]}`}
          >
            {CATEGORY_LABEL[item.category]}
          </span>
          <span className="font-semibold text-slate-700">{item.source}</span>
          <span className="text-slate-400">·</span>
          <time dateTime={item.publishedAt} title={fullDate(item.publishedAt)} className="text-slate-500">
            {timeAgo(item.publishedAt)}
          </time>
        </div>
        <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 hover:underline"
          >
            {item.title}
          </a>
        </h2>
        {item.summary ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            <span className="font-semibold text-slate-500">Ringkasan: </span>
            {item.summary}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          {imgOk && item.imageUrl ? (
            <span className="whitespace-nowrap text-xs text-slate-400">
              Foto: {item.source}
              {item.aggregator ? ` · via ${item.aggregator}` : ""}
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              {item.aggregator ? `via ${item.aggregator}` : ""}
            </span>
          )}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Baca selengkapnya di {item.source} →
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-400">
          Artikel lengkap hanya tersedia di situs {item.source}. Kabar Kilat
          menampilkan judul dan ringkasan pendek ber-atribusi — bukan artikel
          utuh. Lihat{" "}
          <Link href="/disclaimer" className="underline hover:text-emerald-600">
            Disclaimer
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
