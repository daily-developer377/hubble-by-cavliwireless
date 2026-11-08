import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getExhibitorSummary, getFooterExhibitors } from "@/lib/exhibitors";

// Exhibitor counts/ticker reflect the live DB (populated by the scraper),
// so this layout is always rendered dynamically rather than cached.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hubble by Cavliwireless",
  description:
    "Hubble connectivity hardware — GPS/IoT trackers, cellular modules, and fleet telemetry from Cavliwireless.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [exhibitorCount, exhibitors] = await Promise.all([
    getExhibitorSummary(),
    getFooterExhibitors(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <Header exhibitorCount={exhibitorCount} />
        <main className="flex-1">{children}</main>
        <Footer exhibitors={exhibitors} />
      </body>
    </html>
  );
}
