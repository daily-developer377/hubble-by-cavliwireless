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
          className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700"
        >
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
            ✓
          </span>
          {feature.label}
        </li>
      ))}
    </ul>
  );
}
