import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export type Product = {
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl hover:shadow-stone-200/60"
    >
      {/* Top Media Showcase with Studio Photography */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-[#F8F9FA] p-5 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.heroImageUrl}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Card Content with Original Product Data */}
      <div className="flex flex-1 flex-col justify-between p-5 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#183B2B]">
            {product.category}
          </span>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#183B2B] transition-colors leading-snug line-clamp-2 min-h-[2.75rem] flex items-center">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {product.tagline}
          </p>
        </div>

        {/* Action Button styled like the reference, using Hubble Theme Color */}
        <span className="w-full mt-auto flex items-center justify-center gap-2 rounded-xl bg-[#183B2B] py-2.5 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all duration-200 group-hover:bg-[#132F22] group-hover:shadow-md active:scale-[0.98]">
          <span>View more</span>
          <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
