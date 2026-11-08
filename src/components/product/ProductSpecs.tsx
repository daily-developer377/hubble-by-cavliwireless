type Feature = {
  id: string;
  label: string;
};

export function ProductSpecs({ features }: { features: Feature[] }) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {features.map((feature) => (
        <li
          key={feature.id}
          className="group flex items-start gap-3 rounded-2xl border border-stone-200/90 bg-white p-3.5 sm:p-4 shadow-2xs transition-all duration-200 hover:border-[#183B2B]/40 hover:bg-stone-50/50 hover:shadow-xs"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-[#183B2B] transition-colors group-hover:bg-[#183B2B] group-hover:text-white">
            ✓
          </span>
          <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
            {feature.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
