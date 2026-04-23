import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PinkLabs — Premium Software Development Agency",
  description: "We build enterprise-grade digital products that drive growth. Custom web apps, mobile solutions, and UI/UX design for ambitious companies.",
  openGraph: {
    title: "PinkLabs — Premium Software Development Agency",
    description: "We build enterprise-grade digital products that drive growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
