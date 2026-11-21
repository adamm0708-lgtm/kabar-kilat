export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-4">
      <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {intro ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
          {intro}
        </p>
      ) : null}
      <div className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm sm:p-8">
        {children}
      </div>
    </div>
  );
}
