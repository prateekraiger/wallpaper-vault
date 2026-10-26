import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";
import MobileBottomNav from "@/components/MobileBottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fbfaf9",
};

export const metadata: Metadata = {
  metadataBase: new URL("http://127.0.0.1:3000"),
  title: {
    default: "LUMINA — Curated 4K Wallpapers for Desktop & Mobile",
    template: "%s · LUMINA",
  },
  description:
    "Explore 4,891 ultra-high definition 4K and AMOLED wallpapers curated for desktop monitors and mobile devices across 10 signature themes.",
  applicationName: "LUMINA",
  authors: [{ name: "LUMINA Curation Team" }],
  generator: "Next.js",
  keywords: [
    "4k wallpapers",
    "ultra hd wallpapers",
    "desktop wallpapers",
    "phone wallpapers",
    "amoled wallpapers",
    "anime wallpapers",
    "cyberpunk wallpapers",
    "nature wallpapers",
    "car wallpapers",
    "8k wallpapers",
    "aesthetic wallpapers",
  ],
  creator: "LUMINA",
  publisher: "LUMINA",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://127.0.0.1:3000",
    siteName: "LUMINA",
    title: "LUMINA — Curated 4K Wallpapers for Desktop & Mobile",
    description:
      "Explore 4,891 ultra-high definition 4K and AMOLED wallpapers curated for desktop monitors and mobile devices.",
    images: [
      {
        url: "/api/wallpaper/wp_04205",
        width: 3840,
        height: 2160,
        alt: "LUMINA 4K Wallpapers Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMINA — Curated 4K Wallpapers",
    description:
      "Explore 4,891 ultra-high definition 4K and AMOLED wallpapers curated for modern screens.",
    images: ["/api/wallpaper/wp_04205"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured JSON-LD Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "http://127.0.0.1:3000/#website",
        "url": "http://127.0.0.1:3000",
        "name": "LUMINA",
        "description": "Curated 4K & AMOLED Wallpapers for Desktop and Mobile",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "http://127.0.0.1:3000/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "http://127.0.0.1:3000/#organization",
        "name": "LUMINA",
        "url": "http://127.0.0.1:3000",
        "logo": "http://127.0.0.1:3000/icon.svg",
      },
      {
        "@type": "ImageGallery",
        "@id": "http://127.0.0.1:3000/#gallery",
        "name": "LUMINA 4K Wallpaper Collection",
        "description": "A catalog of 4,891 ultra-high definition wallpapers categorized into Desktop, Mobile, and 10 visual themes.",
        "url": "http://127.0.0.1:3000",
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} min-h-screen flex flex-col bg-[#fbfaf9] text-[#343433] antialiased selection:bg-[#ff3e00] selection:text-white pb-16 md:pb-0`}
      >
        <Header />
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
        <ToastContainer />
      </body>
    </html>
  );
}
