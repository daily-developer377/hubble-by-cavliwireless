import { ProductCard, Product } from "@/components/landing/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="products" className="w-full px-6 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20 bg-white">
      <div className="flex flex-col items-start max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-[#183B2B]">
          Featured Hardware
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Complete Telemetry &amp; Connectivity Suite
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
          Every device is field-certified and features an interactive 3D model you can rotate and zoom on its detail page.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
