import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Apa itu Kabar Kilat: agregator ringkasan berita dari media tepercaya, dengan atribusi dan tautan ke artikel asli — bukan plagiat.",
};

export default function TentangPage() {
  return (
    <PageShell
      title="Tentang Kabar Kilat"
      intro="Situs agregator berita yang jujur soal apa yang ditampilkan — dan apa yang tidak."
    >
      <section>
        <h2 className="text-base font-bold text-slate-900">Apa itu Kabar Kilat?</h2>
        <p className="mt-1.5">
          Kabar Kilat adalah situs agregator berita. Kami mengumpulkan judul
          dan ringkasan pendek berita terbaru dari RSS resmi media tepercaya
          Indonesia — NU Online, Republika, Antara, Detik, dan CNN Indonesia —
          serta topik yang sedang ramai dari Google News, lalu menampilkannya
          dalam satu tempat agar mudah dibaca sekilas.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">Model konten kami</h2>
        <ul className="mt-1.5 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Judul</strong> ditampilkan apa adanya dari RSS sumber.
          </li>
          <li>
            <strong>Ringkasan pendek</strong> — maksimal dua kalimat (sekitar
            220 karakter) — dikutip dari deskripsi RSS yang sudah dibersihkan
            dari tag HTML, dengan label “Ringkasan” dan nama sumber yang jelas.
          </li>
          <li>
            <strong>Artikel lengkap tidak pernah ditampilkan.</strong> Untuk
            membaca isi berita, pembaca mengklik “Baca selengkapnya di [Nama
            Sumber]” dan dibawa ke situs media aslinya.
          </li>
          <li>
            <strong>Tidak ada tulis-ulang otomatis dengan AI.</strong> Tidak
            ada layanan AI di aplikasi ini; ringkasan adalah kutipan pendek
            ber-atribusi dari deskripsi resmi sumber, bukan parafrase mesin.
          </li>
          <li>
            <strong>Gambar</strong> hanya thumbnail og:image dari halaman
            artikel sumber, dengan kredit sumber dan tautan balik. Bila tidak
            ada, kartu tampil tanpa gambar.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">Bukan plagiat</h2>
        <p className="mt-1.5">
          Kami tidak menyalin artikel, tidak mengklaim karya orang lain, dan
          tidak menyembunyikan sumber. Setiap item mencantumkan nama media,
          tanggal terbit, dan tautan langsung ke artikel asli — sehingga
          trafik dan pembaca kembali ke media penerbitnya. Penjelasan lengkap
          ada di halaman{" "}
          <Link href="/disclaimer" className="font-semibold text-emerald-700 underline">
            Disclaimer
          </Link>
          .
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">Kategori</h2>
        <ul className="mt-1.5 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Islami</strong> — berita Islam dari NU Online dan Republika.
          </li>
          <li>
            <strong>Umum</strong> — berita nasional dari Antara, Detik, dan CNN
            Indonesia.
          </li>
          <li>
            <strong>Viral</strong> — topik yang sedang ramai, sumber Google News;
            tautan mengikuti redirect ke artikel asli di media penerbitnya.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">Yang masih manual</h2>
        <p className="mt-1.5">
          Saat ini Kabar Kilat belum memuat artikel orisinal hasil liputan
          redaksi sendiri. Artikel orisinal penuh adalah langkah editorial
          manual berikutnya — setelah itu, artikel tersebut akan ditulis,
          disunting, dan diterbitkan oleh redaksi dengan nama penulis yang
          jelas.
        </p>
      </section>
    </PageShell>
  );
}
