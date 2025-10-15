import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Slab } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlurFade } from "@/components/ui/blur-fade";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${robotoSlab.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pt-3 mx-auto flex font-sans flex-col">
          <BlurFade delay={0.4} inView>
            <Header />
          </BlurFade>
          <main>{children}</main>
          <BlurFade delay={0.4} inView>
            <Footer />
          </BlurFade>
        </div>
      </body>
    </html>
  );
}
