"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Code2, Mail, MapPin } from "lucide-react";
import { fetchConfig, BusinessConfig, INITIAL_CONFIG } from "@/lib/db";

export default function Footer() {
  const [config, setConfig] = useState<BusinessConfig>(INITIAL_CONFIG);

  useEffect(() => {
    fetchConfig().then(setConfig);
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#252d3d] mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg border border-[#252d3d] flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.jpg" alt="BetterDose Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#e8eaf2] text-sm font-mono leading-tight">
                  {config.businessName}
                </span>
                <span className="text-[9px] text-[#556080] leading-none">
                  (formerly Heducate)
                </span>
              </div>
            </div>
            <p className="text-xs text-[#8b92a9] leading-relaxed max-w-sm mb-4">
              Software development and digital services studio operated by {config.ownerName} and His Team of developers and testers. Registered in the United Kingdom, operating from {config.address}.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-[#556080]">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} />
                {config.address} (Operating Team Location)
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={12} />
                {config.email}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/betterdoseltd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BetterDose on Instagram"
                className="group w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#556080] hover:border-[#e1306c]/40 hover:text-[#e1306c] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://t.me/betterdose"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BetterDose on Telegram"
                className="group w-8 h-8 rounded-lg bg-[#1f2433] border border-[#252d3d] flex items-center justify-center text-[#556080] hover:border-[#229ED9]/40 hover:text-[#229ED9] transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 13.667l-2.95-.924c-.64-.203-.653-.64.136-.954l11.566-4.458c.537-.194 1.006.131.054.89z"/>
                </svg>
              </a>
              <div className="flex flex-col ml-1">
                <span className="text-[9px] uppercase tracking-widest text-[#3a4454] font-semibold">Follow Us</span>
                <span className="text-[10px] text-[#556080]">@betterdoseltd · @betterdose</span>
              </div>
            </div>
          </div>

          {/* Column 2: Pages */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#556080] mb-3">
              Services &amp; Work
            </p>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/services" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Services Offered
                </Link>
              </li>
              <li>
                <Link href="/qa-testing" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  QA Testing
                </Link>
              </li>
              <li>
                <Link href="/technologies" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Technologies
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Project Portfolio
                </Link>
              </li>
              <li>
                <Link href="/expertise" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Technology Expertise
                </Link>
              </li>
              <li>
                <Link href="/work-with-us" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Work With Us
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Industries We Serve
                </Link>
              </li>
              <li>
                <Link href="/how-we-work" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  How We Work
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Business */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#556080] mb-3">
              Legal &amp; Business Info
            </p>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/business-info" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Business Details
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#8b92a9] hover:text-[#e8eaf2] transition-colors font-semibold">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#556080]">
          <p>
            © {year} {config.businessName}. Owner / Director: {config.ownerName}.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/betterdoseltd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#e1306c] transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              @betterdoseltd
            </a>
            <span className="opacity-30">·</span>
            <a href="https://t.me/betterdose" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#229ED9] transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 13.667l-2.95-.924c-.64-.203-.653-.64.136-.954l11.566-4.458c.537-.194 1.006.131.054.89z"/></svg>
              @betterdose
            </a>
          </div>
          <p>
            Registered in the United Kingdom · Operations in {config.address}.
          </p>
        </div>
      </div>
    </footer>
  );
}
