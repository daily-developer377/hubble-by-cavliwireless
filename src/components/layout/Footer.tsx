import { ExhibitorTicker } from "@/components/layout/ExhibitorTicker";

type ExhibitorRow = {
  companyName: string;
  country: string;
};

export function Footer({ exhibitors }: { exhibitors: ExhibitorRow[] }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-sky-500 text-[11px] font-bold text-white">
            H
          </span>
          <span className="text-sm font-semibold text-slate-900">Hubble</span>
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-slate-500 uppercase">
          Exhibitors at Electronica &amp; Productronica India — Bangalore 2026
        </p>
        <div className="mt-3">
          <ExhibitorTicker exhibitors={exhibitors} />
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Cavliwireless. Hubble product data shown here is
            seed/demo content.
          </p>
          <p>Exhibitor data refreshed via POST /api/scrape/exhibitors</p>
        </div>
      </div>
    </footer>
  );
}
