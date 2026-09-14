import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* Self-hosted variable faces: no third-party request, no FOUT from an
   external host, and the width axis stays available for the display type. */
const geist = localFont({
  src: "../fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const archivo = localFont({
  src: "../fonts/Archivo-Variable.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "Helvetica Neue", "Arial", "sans-serif"],
});

const SITE = "https://consciouschoice.co";
const TITLE = "Conscious Choice — Cold-Pressed Juice Bangkok";
const DESCRIPTION =
  "Cold-pressed juice made with real ingredients in Bangkok. Discover Conscious Choice Original Kick-Start.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Conscious Choice",
  keywords: [
    "cold-pressed juice",
    "Bangkok",
    "Conscious Choice",
    "Original Kick-Start",
    "pineapple apple carrot ginger",
    "no added sugar",
    "plant-based",
  ],
  authors: [{ name: "Conscious Choice" }],
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Conscious Choice",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F5F2EA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${archivo.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
