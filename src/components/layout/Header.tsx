import Link from "next/link";

export function Header({ exhibitorCount }: { exhibitorCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 text-sm font-bold text-white shadow-sm shadow-indigo-200">
            H
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight text-slate-900">Hubble</span>
            <span className="hidden text-xs text-slate-400 sm:inline">by Cavliwireless</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#products" className="transition hover:text-slate-900">
            Products
          </Link>
          <Link href="/#consult" className="transition hover:text-slate-900">
            Consult
          </Link>
        </nav>

        <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {exhibitorCount.toLocaleString()} exhibitors live from EP BLR 2026
        </span>
      </div>
    </header>
  );
}
