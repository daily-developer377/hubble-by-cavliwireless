import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="w-full px-6 py-24 text-center sm:px-10">
      <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        We couldn&apos;t find a Hubble product at that URL.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-sm font-medium text-indigo-600 underline underline-offset-2"
      >
        Back to the landing page
      </Link>
    </div>
  );
}
