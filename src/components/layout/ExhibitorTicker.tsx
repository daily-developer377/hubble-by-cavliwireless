type ExhibitorRow = {
  companyName: string;
  country: string;
};

export function ExhibitorTicker({ exhibitors }: { exhibitors: ExhibitorRow[] }) {
  if (exhibitors.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Exhibitor data will appear here once the scraper runs (
        <code className="rounded bg-slate-200 px-1 py-0.5 text-slate-600">
          POST /api/scrape/exhibitors
        </code>
        ).
      </p>
    );
  }

  // Duplicate the list so the CSS marquee can loop seamlessly at -50%.
  const loop = [...exhibitors, ...exhibitors];

  return (
    <div className="relative overflow-hidden marquee-fade">
      <div className="flex w-max animate-marquee gap-3 py-1">
        {loop.map((exhibitor, index) => (
          <span
            key={`${exhibitor.companyName}-${index}`}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-xs"
          >
            <span className="font-medium text-slate-900">{exhibitor.companyName}</span>
            <span className="text-slate-300">·</span>
            {exhibitor.country}
          </span>
        ))}
      </div>
    </div>
  );
}
