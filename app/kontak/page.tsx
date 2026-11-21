import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Kontak Redaksi",
  description:
    "Hubungi redaksi Kabar Kilat — koreksi berita, permintaan hapus tautan, atau kerja sama.",
};

export default function KontakPage() {
  return (
    <PageShell
      title="Kontak Redaksi"
      intro="Koreksi berita, permintaan penghapusan tautan, atau kerja sama — silakan hubungi kami."
    >
      <section>
        <h2 className="text-base font-bold text-slate-900">Email redaksi</h2>
        <p className="mt-1.5">
          <a
            href="mailto:redaksi@kabarkilat.id"
            className="font-semibold text-emerald-700 underline"
          >
            redaksi@kabarkilat.id
          </a>
        </p>
        <p className="mt-1.5">
          Kami membaca setiap pesan yang masuk dan membalas secepat mungkin
          pada jam kerja.
        </p>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">Kirim pesan</h2>
        <p className="mt-1.5">
          Formulir di bawah ini membuka aplikasi email Anda dengan alamat
          redaksi sudah terisi (mailto). Pesan tidak disimpan di server kami —
          tidak ada backend formulir pada situs ini.
        </p>
        <form
          action="mailto:redaksi@kabarkilat.id"
          method="post"
          encType="text/plain"
          className="mt-4 space-y-4"
        >
          <div>
            <label htmlFor="nama" className="mb-1 block font-semibold text-slate-900">
              Nama
            </label>
            <input
              id="nama"
              name="Nama"
              type="text"
              required
              placeholder="Nama Anda"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block font-semibold text-slate-900">
              Email
            </label>
            <input
              id="email"
              name="Email"
              type="email"
              required
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <div>
            <label htmlFor="pesan" className="mb-1 block font-semibold text-slate-900">
              Pesan
            </label>
            <textarea
              id="pesan"
              name="Pesan"
              required
              rows={5}
              placeholder="Tulis pesan Anda di sini…"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Kirim via Email
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-base font-bold text-slate-900">
          Permintaan penghapusan tautan
        </h2>
        <p className="mt-1.5">
          Pemilik media yang keberatan dengan tautan ke artikelnya dapat
          mengirim email ke alamat di atas dengan subjek “Permintaan Hapus
          Tautan” beserta URL artikelnya. Kami akan menindaklanjuti paling
          lambat 3 hari kerja.
        </p>
      </section>
    </PageShell>
  );
}
