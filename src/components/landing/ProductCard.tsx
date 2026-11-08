import Link from "next/link";

type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  heroImageUrl: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-950">
        {/* Hero images are generated SVG placeholders (no product photography
            was supplied), so a plain <img> avoids Next's raster-focused
            image optimizer and renders them crisply at any size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.heroImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-semibold tracking-wider text-[#183B2B] uppercase">
          {product.category}
        </span>
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-[#183B2B] transition-colors">{product.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{product.tagline}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-[#183B2B]">
          View details
          <span className="transition duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
