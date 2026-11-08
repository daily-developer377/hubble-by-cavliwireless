type ExhibitorRow = {
  companyName: string;
  country: string;
};

export function ExhibitorTicker({ exhibitors }: { exhibitors: ExhibitorRow[] }) {
  if (exhibitors.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-sm text-slate-400">
          Exhibitor data will appear here once the scraper pipeline runs (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-emerald-400 font-mono text-xs">
            POST /api/scrape/exhibitors
          </code>
          ).
        </p>
      </div>
    );
  }

  // Duplicate the list so the CSS marquee can loop seamlessly at -50%.
  const loop = [...exhibitors, ...exhibitors];

  return (
    <div className="group/ticker relative overflow-hidden marquee-fade py-2">
      <div className="flex w-max animate-marquee gap-3.5 py-1 group-hover/ticker:[animation-play-state:paused]">
        {loop.map((exhibitor, index) => (
          <div
            key={`${exhibitor.companyName}-${index}`}
            className="group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-2.5 transition-all duration-300 hover:border-emerald-500/40 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-emerald-950/20 cursor-default"
          >
            {/* Booth / Partner Icon Badge */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 transition-transform duration-200 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
              </svg>
            </span>

            {/* Company Name */}
            <span className="text-xs sm:text-sm font-semibold text-slate-200 transition-colors group-hover:text-white">
              {exhibitor.companyName}
            </span>

            {/* Country Pill */}
            <span className="rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-400 transition-colors group-hover:border-emerald-500/30 group-hover:text-emerald-300">
              {exhibitor.country}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
