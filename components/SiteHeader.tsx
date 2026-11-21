import Link from "next/link";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/feed";

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Beranda" },
  ...CATEGORIES.map((c) => ({ href: `/kategori/${c}`, label: CATEGORY_LABEL[c] })),
  { href: "/tentang", label: "Tentang" },
  { href: "/kontak", label: "Kontak" },
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded bg-emerald-500 text-lg leading-none">
              K
            </span>
            <span className="text-lg">
              Kabar<span className="text-emerald-400">Kilat</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active === n.href ? "page" : undefined}
                className={`rounded px-3 py-2 font-medium transition hover:bg-slate-800 hover:text-emerald-300 ${
                  active === n.href ? "bg-slate-800 text-emerald-300" : "text-slate-200"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <span className="hidden rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 sm:block">
            Berita hari ini
          </span>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto pb-2 text-sm md:hidden"
          aria-label="Navigasi utama seluler"
        >
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 font-medium ${
                active === n.href
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-200"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
