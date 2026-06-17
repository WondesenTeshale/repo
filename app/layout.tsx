import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BetterDose — Software Development & Digital Services",
  description:
    "BetterDose is a software development and digital services studio operated by Nebiyu Muluadam and Eyob Mulugeta, registered in the United Kingdom with operational office in Addis Ababa, Ethiopia.",
  keywords: [
    "BetterDose software",
    "software engineer Ethiopia",
    "custom web development",
    "API development",
    "automation solutions",
    "digital services",
    "Nebiyu Muluadam",
    "Eyob Mulugeta",
  ],
  authors: [{ name: "Nebiyu Muluadam" }, { name: "Eyob Mulugeta" }],
  creator: "BetterDose",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "BetterDose — Software Development & Digital Services",
    description:
      "Custom software development, automation systems, and API integrations by BetterDose.",
    siteName: "BetterDose",
  },
  twitter: {
    card: "summary",
    title: "BetterDose — Software Development & Digital Services",
    description:
      "Custom software development, API design, and automation services.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
