import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/paths";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "500", "800"],
  variable: "--font-outfit",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const title = `${siteConfig.name} | Healthy meal plans at ${siteConfig.location.area}, ${siteConfig.location.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    images: [{ url: withBasePath("/og.jpg"), width: 1200, height: 630, alt: siteConfig.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: [withBasePath("/og.jpg")],
  },
  icons: { icon: withBasePath("/logo.svg") },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ECEBE8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isProd = process.env.NODE_ENV === "production";
  return (
    <html lang="en-IN" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        {/* GitHub Pages cannot send headers, so the CSP lives in a meta tag. Dev needs eval for HMR. */}
        {isProd && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script src={withBasePath("/frame-buster.js")} defer />
      </head>
      <body className="min-h-svh antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
