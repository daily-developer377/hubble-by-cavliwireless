import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ModelViewer } from "@/components/product/ModelViewer";
import { ProductSpecs } from "@/components/product/ProductSpecs";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { features: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found — Hubble" };
  return {
    title: `${product.name} — Hubble`,
    description: product.tagline,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-900"
      >
        ← Back to all products
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ModelViewer src={product.modelUrl} alt={product.name} />

        <div>
          <span className="text-xs font-medium tracking-wide text-indigo-600 uppercase">
            {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {product.name}
          </h1>
          <p className="mt-2 text-base text-slate-500">{product.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <h2 className="mt-8 text-sm font-semibold tracking-wide text-slate-500 uppercase">
            Key features
          </h2>
          <div className="mt-3">
            <ProductSpecs features={product.features} />
          </div>

          <Link
            href="/#consult"
            className="mt-8 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Consult Now about {product.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
