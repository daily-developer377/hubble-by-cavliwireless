import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ModelViewer } from "@/components/product/ModelViewer";
import { ProductSpecs } from "@/components/product/ProductSpecs";
import { ProductCard } from "@/components/landing/ProductCard";
import { LuArrowLeft, LuArrowRight, LuChevronRight } from "react-icons/lu";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { features: { orderBy: { sortOrder: "asc" } } },
  });
}

async function getOtherProducts(currentSlug: string) {
  return prisma.product.findMany({
    where: { slug: { not: currentSlug } },
    take: 4,
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      category: true,
      heroImageUrl: true,
    },
  });
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found — Hubble" };
  return {
    title: `${product.name} — Hubble by Cavliwireless`,
    description: product.tagline,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const otherProducts = await getOtherProducts(slug);

  return (
    <div className="w-full bg-[#FAF8F5]/50 pb-20 sm:pb-28">
      {/* Top Breadcrumb Bar */}
      <div className="w-full border-b border-stone-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-3.5">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#183B2B] transition-colors">
              Home
            </Link>
            <LuChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <Link href="/#products" className="hover:text-[#183B2B] transition-colors">
              Featured Hardware
            </Link>
            <LuChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <Link
            href="/#products"
            className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#183B2B]/40 hover:text-[#183B2B] shadow-2xs"
          >
            <LuArrowLeft className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to hardware catalog</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-8 sm:pt-12">
        {/* Main Product Showcase Hero (2 Columns) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: 3D Model Viewer (Static on mobile/tablet, sticky on desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 static lg:sticky lg:top-24">
            <ModelViewer
              src={product.modelUrl}
              alt={product.name}
            />

            {/* Quick Architecture Highlights underneath 3D viewer */}
            <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
                <span className="block font-bold text-slate-900">150+ Networks</span>
                <span className="text-[11px] text-slate-500">Pre-Certified</span>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
                <span className="block font-bold text-slate-900">Direct 3D</span>
                <span className="text-[11px] text-slate-500">Full CAD Orbit</span>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-2xs">
                <span className="block font-bold text-slate-900">Carrier Grade</span>
                <span className="text-[11px] text-slate-500">High Reliability</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hardware Details, Features & Actions */}
          <div className="flex flex-col lg:col-span-6 xl:col-span-6">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#183B2B]/20 bg-[#183B2B]/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#183B2B] self-start">
              <span className="h-1.5 w-1.5 rounded-full bg-[#183B2B]" />
              {product.category}
            </div>

            {/* Title & Tagline */}
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {product.name}
            </h1>
            <p className="mt-2.5 text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              {product.tagline}
            </p>

            {/* Detailed Description */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
              {product.description}
            </p>

            {/* Key Features Section */}
            <div className="mt-8 border-t border-stone-200/80 pt-6">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#183B2B]">
                  Certified Key Features
                </h2>
                <span className="text-xs text-slate-400">
                  {product.features.length} Field Specifications
                </span>
              </div>
              <ProductSpecs features={product.features} />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/#consult"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#183B2B] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#132F22] hover:shadow-md active:scale-[0.98]"
              >
                <span>Consult Now about {product.name}</span>
                <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:border-stone-400 hover:bg-stone-50 active:scale-[0.98]"
              >
                Explore All Hardware
              </Link>
            </div>

            {/* Direct Consultation Assurance */}
            <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white/80 p-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#183B2B] font-bold text-sm">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">
                    Direct Architecture Consultation Available
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Schedule a Google Meet session with our senior RF and IoT telemetry architects.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Products in the Hubble Suite */}
        {otherProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 border-t border-stone-200/80 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#183B2B]">
                  Hubble Ecosystem
                </span>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Explore Other Featured Hardware
                </h3>
              </div>
              <Link
                href="/#products"
                className="group mt-3 sm:mt-0 text-xs sm:text-sm font-semibold text-[#183B2B] hover:text-[#132F22] flex items-center gap-1.5"
              >
                <span>View all hardware</span>
                <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {otherProducts.map((other) => (
                <ProductCard key={other.slug} product={other} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
