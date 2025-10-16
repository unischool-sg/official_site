import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
  weight: ["400"],
});

const url = "https://uni.sandagakuen.ed.jp/";
const icon = "/favicon.ico";
const ogpIcon = "/ogp.webp";
const siteName = "Uni School";
const description = "We are team of Creaters. We are studens. But we are pro.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${siteName}`,
    template: `%s / ${siteName}`,
  },
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja-JP",
    type: "website",
    images: ogpIcon,
  },
  icons: icon,
  verification: {
    google: "",
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ogpIcon,
  },
  keywords: [
    "Uni School",
    "Sanda Gakuen",
    "三田学園",
    "三田学園中学校",
    "学校",
    "クリエイター",
    "学生",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${robotoSlab.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
