import Link from "next/link";
import { CATEGORIES, CATEGORY_LABEL } from "@/lib/feed";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              Kabar<span className="text-emerald-400">Kilat</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Ringkasan berita terbaru dari media tepercaya Indonesia — Islami,
              umum, dan viral. Artikel lengkap selalu dibaca di situs sumbernya.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Kategori</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href={`/kategori/${c}`} className="hover:text-emerald-300">
                    {CATEGORY_LABEL[c]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Tautan</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li>
                <Link href="/tentang" className="hover:text-emerald-300">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-emerald-300">
                  Kontak Redaksi
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="hover:text-emerald-300">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-300">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-800 pt-5 text-xs leading-relaxed text-slate-400">
          <p>
            Kabar Kilat menampilkan judul dan ringkasan pendek dari RSS resmi
            media sumber, lengkap dengan atribusi dan tautan ke artikel asli.
            Kami tidak menampilkan teks artikel lengkap. Hak cipta atas isi
            berita sepenuhnya milik media penerbit masing-masing.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Kabar Kilat · redaksi@kabarkilat.id
          </p>
        </div>
      </div>
    </footer>
  );
}
