"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { MagneticButton } from "../ui/MagneticButton";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 mx-auto max-w-5xl rounded-2xl border ${
        scrolled
          ? "bg-navy-950/70 backdrop-blur-2xl border-navy-800/50 py-3 px-6 shadow-2xl"
          : "bg-transparent border-transparent py-4 px-6"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg border border-navy-700/50">
              <Image src="/logo.png" alt="Toffee Logo" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold text-white group-hover:text-toffee-400 transition-colors">
              Toffee
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-navy-200 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <MagneticButton>
              <Link
                href="/register"
                className="btn-primary text-sm py-2 px-4"
              >
                Get Started
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-navy-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-navy-900/95 backdrop-blur-xl border border-navy-800/50 rounded-2xl p-4">
          <div className="space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-sm font-medium text-navy-300 hover:text-white py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-navy-800 flex flex-col gap-2">
              <Link href="/login" className="text-sm text-navy-300 py-2">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
