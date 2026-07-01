"use client";

import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-toffee-500/5 to-navy-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-toffee-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">
          Ready to stop{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-toffee-400 to-accent-violet">
            re-explaining
          </span>
          ?
        </h2>
        <p className="text-lg text-navy-400 max-w-2xl mx-auto mb-10">
          Install the Toffee extension and experience seamless AI context
          transfer in under 30 seconds. Free forever, no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-toffee-500/20"
          >
            <Download className="w-5 h-5" />
            Install Free Extension
          </Link>
          <Link href="/login" className="btn-secondary text-base py-3.5 px-8">
            Sign In to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
