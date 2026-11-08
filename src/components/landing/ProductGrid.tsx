import { ProductCard } from "@/components/landing/ProductCard";

type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  heroImageUrl: string;
};

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Products
      </h2>
      <p className="mt-2 max-w-xl text-sm text-slate-500">
        Every product includes an interactive 3D model you can rotate and zoom on its detail page.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
