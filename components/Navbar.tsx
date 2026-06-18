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
          <div className="w-7 h-7 rounded-lg bg-[#4f8ef7]/15 border border-[#4f8ef7]/30 flex items-center justify-center">
            <Code2 size={14} className="text-[#4f8ef7]" />
          </div>
          <span className="font-semibold text-[#e8eaf2] text-sm tracking-tight">
            BetterDose
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
        <div className="hidden lg:block shrink-0">
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
              <div className="pt-3 mt-2 border-t border-[#252d3d]">
                <Link
                  href="/contact"
                  className="btn btn-primary w-full justify-center text-sm"
                >
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
