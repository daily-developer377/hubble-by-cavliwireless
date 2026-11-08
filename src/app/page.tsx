import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/landing/Hero";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { ConsultWizard } from "@/components/consult/ConsultWizard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      category: true,
      heroImageUrl: true,
    },
  });

  return (
    <>
      <Hero />
      <ProductGrid products={products} />
      <section id="consult" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Consult Now
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tell us about your project and pick a time that works — we&apos;ll send a Google Meet
            invite straight to your inbox.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ConsultWizard />
          </div>
        </div>
      </section>
    </>
  );
}
