"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Deliverables", href: "/deliverables" },
  { label: "Activity", href: "/activity" },
  { label: "About", href: "/about" },
  { label: "Work With Us", href: "/work-with-us" },
  { label: "Business Info", href: "/business-info" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f1117]/90 border-b border-[#252d3d] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Home"
        >
          <div className="w-7 h-7 rounded-lg border border-[#252d3d] flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="BetterDose Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[#e8eaf2] text-sm tracking-tight leading-tight">
              BetterDose
            </span>
            <span className="text-[9px] text-[#556080] leading-none">
              (formerly Heducate)
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                  active
                    ? "text-[#e8eaf2] bg-[#1f2433]"
                    : "text-[#8b92a9] hover:text-[#e8eaf2] hover:bg-[#181c25]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Social icons */}
          <a href="https://www.instagram.com/betterdoseltd" target="_blank" rel="noopener noreferrer" aria-label="BetterDose Instagram"
            className="w-7 h-7 rounded-lg border border-[#e1306c]/40 bg-[#e1306c]/10 flex items-center justify-center text-[#e1306c] hover:scale-110 hover:bg-[#e1306c]/20 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="https://t.me/betterdose" target="_blank" rel="noopener noreferrer" aria-label="BetterDose Telegram"
            className="w-7 h-7 rounded-lg border border-[#229ED9]/40 bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9] hover:scale-110 hover:bg-[#229ED9]/20 transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 13.667l-2.95-.924c-.64-.203-.653-.64.136-.954l11.566-4.458c.537-.194 1.006.131.054.89z"/>
            </svg>
          </a>
          <div className="w-px h-4 bg-[#252d3d] mx-1" />
          <Link href="/admin" className="btn btn-ghost text-xs py-1.5 px-3.5 border-transparent">
            Access Portal
          </Link>
          <Link href="/contact" className="btn btn-primary text-xs py-1.5 px-3.5">
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg text-[#8b92a9] hover:text-[#e8eaf2] hover:bg-[#1f2433] transition-colors"
          aria-label="Toggle navigation menu"
          id="mobile-menu-btn"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden bg-[#0f1117]/95 border-b border-[#252d3d] backdrop-blur-md px-6 py-4"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-[#e8eaf2] bg-[#1f2433]"
                        : "text-[#8b92a9] hover:text-[#e8eaf2] hover:bg-[#181c25]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-3 mt-2 border-t border-[#252d3d] flex flex-col gap-2">
                <Link href="/admin" className="btn btn-ghost w-full justify-center text-sm">
                  Access Portal
                </Link>
                <Link href="/contact" className="btn btn-primary w-full justify-center text-sm">
                  Contact
                </Link>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a href="https://www.instagram.com/betterdoseltd" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#556080] hover:text-[#e1306c] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    @betterdoseltd
                  </a>
                  <span className="text-[#252d3d]">·</span>
                  <a href="https://t.me/betterdose" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#556080] hover:text-[#229ED9] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 13.667l-2.95-.924c-.64-.203-.653-.64.136-.954l11.566-4.458c.537-.194 1.006.131.054.89z"/>
                    </svg>
                    @betterdose
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
