import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BetterDose — Software Development & Digital Services",
  description:
    "BetterDose is a software development and digital services studio operated by Nebiyu Muluadam and His Team of developers and testers, registered in the United Kingdom with operational office in Addis Ababa, Ethiopia.",
  keywords: [
    "BetterDose software",
    "software engineer Ethiopia",
    "custom web development",
    "API development",
    "automation solutions",
    "digital services",
    "Nebiyu Muluadam",
  ],
  authors: [{ name: "Nebiyu Muluadam" }],
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
      <body className="antialiased">
        <NextTopLoader color="#4f8ef7" showSpinner={false} height={3} />
        {children}
        
        {/* Tawk.to Live Chat Script */}
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6a3463b2af13711d4df030b9/1jreaasj7';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
