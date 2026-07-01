import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import Image from "next/image";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Extension", href: "/extension" },
    { label: "API Docs", href: "/api-docs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Legal Overview", href: "/legal" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-navy-800/50 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-lg border border-navy-700/50">
                <Image src="/logo.png" alt="Toffee Logo" fill className="object-cover" />
              </div>
              <span className="text-lg font-bold text-white">Toffee</span>
            </Link>
            <p className="text-sm text-navy-400 mb-4 max-w-xs">
              The AI Context Transfer Protocol. Never re-explain yourself to an AI again.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-navy-800/50 flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-700/50 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-navy-800/50 flex items-center justify-center text-navy-400 hover:text-white hover:bg-navy-700/50 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-navy-200 mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-navy-400 hover:text-toffee-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-navy-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-500">
            © {new Date().getFullYear()} Toffee. All rights reserved. Designed & Developed by Abhay.
          </p>
          <p className="text-xs text-navy-600">
            Built with ⚡ for AI power users
          </p>
        </div>
      </div>
    </footer>
  );
}
