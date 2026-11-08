import Link from "next/link";

export function Header({ exhibitorCount }: { exhibitorCount: number }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="flex w-full items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#183B2B] text-white shadow-sm transition group-hover:bg-[#132F22]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <rect x="2" y="2" width="20" height="8" rx="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" />
              <line x1="6" y1="6" x2="6.01" y2="6" />
              <line x1="6" y1="18" x2="6.01" y2="18" />
            </svg>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-[#183B2B] transition-colors">
              Hubble
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              by Cavliwireless
            </span>
          </div>
        </Link>

        {/* B2B Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
          <Link
            href="/"
            className="relative py-1 font-semibold text-[#183B2B] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#183B2B] after:rounded-full"
          >
            Home
          </Link>

          <Link
            href="/#products"
            className="transition hover:text-[#183B2B]"
          >
            Products
          </Link>

          <Link
            href="/#consult"
            className="transition hover:text-[#183B2B]"
          >
            Consult
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Live exhibitor count pill */}
          <span className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>{exhibitorCount.toLocaleString()} EP BLR 2026 Exhibitors</span>
          </span>

          {/* Primary Action Button */}
          <Link
            href="/#consult"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#183B2B] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#132F22]"
          >
            Consult Now
          </Link>
        </div>
      </div>
    </header>
  );
}
