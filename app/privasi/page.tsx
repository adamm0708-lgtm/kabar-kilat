import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan Privasi Kabar Kilat: data yang dikumpulkan, cookie, iklan pihak ketiga, dan kontak.",
};

export default function PrivasiPage() {
  return (
    <PageShell
      title="Kebijakan Privasi"
      intro="Terakhir diperbarui: 21 November 2026. Halaman ini menjelaskan data apa yang kami kumpulkan dan bagaimana data itu digunakan."
    >
      <section>
        <h2 className="text-base font-bold text-slate-900">1. Data yang kami kumpulkan</h2>
        <p className="mt-1.5">
          Kabar Kilat tidak meminta Anda membuat akun dan tidak mengumpulkan
          nama, alamat email, atau data pribadi lainnya secara langsung.
          Formulir kontak di situs ini bekerja lewat mailto — pesan Anda
          terkirim sebagai email biasa ke redaksi dan tidak disimpan di server
          situs ini.
        </p>
        <p className="mt-1.5">
          Server situs dapat mencatat data teknis standar (alamat IP, jenis
          peramban, dan halaman yang dikunjungi) untuk keamanan dan statistik
          kunjungan agregat. Data ini tidak digunakan untuk mengidentifikasi
          individu.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">2. Cookie</h2>
        <p className="mt-1.5">
          Situs ini sendiri tidak memasang cookie pelacak. Namun, layanan
          pihak ketiga yang tertanam atau tertaut (misalnya jaringan iklan)
          dapat menggunakan cookie untuk menampilkan iklan yang relevan.
          Anda dapat menghapus atau memblokir cookie melalui pengaturan
          peramban Anda.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">
          3. Iklan pihak ketiga (Google AdSense)
        </h2>
        <p className="mt-1.5">
          Situs ini dapat menampilkan iklan dari Google AdSense. Google dan
          mitra periklannya dapat menggunakan cookie (termasuk cookie iklan
          DoubleClick) untuk menayangkan iklan berdasarkan kunjungan Anda ke
          situs ini atau situs lain. Anda dapat memilih keluar dari iklan yang
          dipersonalisasi melalui Pengaturan Iklan Google (
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-700 underline"
          >
            adssettings.google.com
          </a>
          ) atau melalui{" "}
          <a
            href="https://www.aboutads.info/choices/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-700 underline"
          >
            aboutads.info/choices
          </a>
          .
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">4. Tautan ke situs lain</h2>
        <p className="mt-1.5">
          Setiap berita menautkan ke artikel asli di situs media sumber.
          Kebijakan privasi situs-situs tersebut berada di luar kendali kami;
          silakan baca kebijakan privasi masing-masing situs yang Anda kunjungi.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">5. Anak-anak</h2>
        <p className="mt-1.5">
          Situs ini tidak ditujukan untuk mengumpulkan data pribadi
          anak-anak di bawah 13 tahun.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">6. Perubahan kebijakan</h2>
        <p className="mt-1.5">
          Kebijakan ini dapat diperbarui sewaktu-waktu; tanggal pembaruan di
          atas akan diubah. Penggunaan situs setelah perubahan berarti Anda
          menyetujui kebijakan yang berlaku.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">7. Kontak</h2>
        <p className="mt-1.5">
          Pertanyaan tentang kebijakan ini dapat dikirim ke{" "}
          <a
            href="mailto:redaksi@kabarkilat.id"
            className="font-semibold text-emerald-700 underline"
          >
            redaksi@kabarkilat.id
          </a>
          .
        </p>
      </section>
    </PageShell>
  );
}
