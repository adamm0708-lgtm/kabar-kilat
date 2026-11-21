import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Disclaimer Kabar Kilat: sumber berita, atribusi, hak cipta, dan batasan ringkasan yang ditampilkan.",
};

export default function DisclaimerPage() {
  return (
    <PageShell
      title="Disclaimer"
      intro="Penjelasan jujur tentang dari mana berita di situs ini berasal, apa yang kami tampilkan, dan apa yang bukan milik kami."
    >
      <section>
        <h2 className="text-base font-bold text-slate-900">1. Sumber berita</h2>
        <p className="mt-1.5">
          Kabar Kilat adalah agregator. Berita yang tampil berasal dari RSS
          resmi media berikut: NU Online, Republika, Antara, Detik, CNN
          Indonesia, serta Google News untuk kategori Viral. Judul dan
          ringkasan diambil dari feed resmi masing-masing media.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">
          2. Yang kami tampilkan — dan yang tidak
        </h2>
        <p className="mt-1.5">
          Yang kami tampilkan hanyalah <strong>judul</strong> dan{" "}
          <strong>ringkasan pendek</strong> (maksimal dua kalimat, sekitar 220
          karakter) yang dikutip dari deskripsi RSS sumber, lengkap dengan nama
          sumber, tanggal terbit, dan tautan ke artikel asli.{" "}
          <strong>Kami tidak menampilkan teks artikel lengkap</strong> dan
          tidak menulis ulang artikel dengan AI — tidak ada layanan AI di
          aplikasi ini. Ringkasan adalah kutipan pendek ber-atribusi, bukan
          artikel utuh dan bukan pengganti membaca artikel aslinya.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">3. Atribusi &amp; hak cipta</h2>
        <p className="mt-1.5">
          Hak cipta atas judul, ringkasan, dan gambar sepenuhnya milik media
          penerbit masing-masing. Gambar yang tampil adalah thumbnail og:image
          dari halaman artikel sumber, ditampilkan dengan kredit sumber dan
          tautan balik. Kami tidak mengklaim kepemilikan atas konten tersebut
          dan tidak menyembunyikan sumbernya — setiap item mengarahkan pembaca
          kembali ke situs sumber melalui tombol “Baca selengkapnya di [Nama
          Sumber]”.
        </p>
        <p className="mt-1.5">
          Bila ada pemegang hak yang keberatan, silakan hubungi{" "}
          <a
            href="mailto:redaksi@kabarkilat.id"
            className="font-semibold text-emerald-700 underline"
          >
            redaksi@kabarkilat.id
          </a>{" "}
          — tautan terkait akan kami tinjau dan hapus bila diperlukan.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">4. Akurasi</h2>
        <p className="mt-1.5">
          Isi berita sepenuhnya menjadi tanggung jawab media sumber. Kabar
          Kilat tidak mengubah fakta dalam ringkasan dan tidak bertanggung
          jawab atas kesalahan, perubahan, atau penghapusan artikel di situs
          sumber. Untuk informasi yang akurat dan lengkap, selalu baca artikel
          asli di situs sumbernya.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">5. Tautan keluar</h2>
        <p className="mt-1.5">
          Tautan ke situs eksternal disediakan untuk kenyamanan pembaca. Kami
          tidak mengendalikan isi atau kebijakan situs-situs tersebut. Baca
          juga{" "}
          <Link href="/tentang" className="font-semibold text-emerald-700 underline">
            Tentang Kami
          </Link>{" "}
          dan{" "}
          <Link href="/privasi" className="font-semibold text-emerald-700 underline">
            Kebijakan Privasi
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}
