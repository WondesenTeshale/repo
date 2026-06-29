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
              <span className="font-semibold text-[#e8eaf2] text-sm font-mono">
                {config.businessName}
              </span>
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
          <p>
            Registered in the United Kingdom · Operations in {config.address}.
          </p>
        </div>
      </div>
    </footer>
  );
}
