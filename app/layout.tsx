import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Kabar Kilat — Ringkasan Berita Terbaru dari Media Tepercaya",
    template: "%s · Kabar Kilat",
  },
  description:
    "Kabar Kilat menampilkan judul dan ringkasan pendek berita terbaru dari NU Online, Republika, Antara, Detik, dan CNN Indonesia — lengkap dengan atribusi dan tautan ke artikel asli.",
  openGraph: {
    title: "Kabar Kilat",
    description:
      "Ringkasan berita terbaru dari media tepercaya — artikel lengkap dibaca di situs sumbernya.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
