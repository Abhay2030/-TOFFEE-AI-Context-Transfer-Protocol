"use client";

import { useState } from "react";
import { Search, Grid3X3, List, FileText, Share2, Trash2, Download } from "lucide-react";
import Link from "next/link";

export default function BundlesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bundle Library</h1>
          <p className="text-sm text-navy-400 mt-1">
            Manage your captured AI conversation bundles
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search bundles by name, platform, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-navy-800/50 rounded-xl p-1 border border-navy-700/50">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${
              view === "grid" ? "bg-toffee-500/10 text-toffee-400" : "text-navy-500 hover:text-navy-300"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${
              view === "list" ? "bg-toffee-500/10 text-toffee-400" : "text-navy-500 hover:text-navy-300"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {["All", "ChatGPT", "Claude", "Gemini", "Copilot", "Grok", "Perplexity"].map(
          (platform) => (
            <button
              key={platform}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                platform === "All"
                  ? "bg-toffee-500/10 text-toffee-400 border border-toffee-500/20"
                  : "bg-navy-800/30 text-navy-400 border border-navy-700/30 hover:border-navy-600 hover:text-navy-300"
              }`}
            >
              {platform}
            </button>
          )
        )}
      </div>

      {/* Empty State */}
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-navy-800/30 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-navy-700" />
        </div>
        <h3 className="text-lg font-semibold text-navy-300 mb-2">
          No bundles found
        </h3>
        <p className="text-sm text-navy-500 max-w-sm mx-auto mb-6">
          Your captured AI conversation bundles will appear here. Install the
          Toffee browser extension to start capturing.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/install" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Install Extension
          </Link>
        </div>

        {/* Demo Cards (to show how it will look) */}
        <div className="mt-12 max-w-3xl mx-auto">
          <p className="text-xs text-navy-600 mb-4 uppercase tracking-wider">Preview — How your bundles will look</p>
          <div className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-3 opacity-50`}>
            {[
              { name: "React Architecture Discussion", platform: "ChatGPT", tokens: "2,847", ratio: "0.23" },
              { name: "API Design Review", platform: "Claude", tokens: "1,205", ratio: "0.18" },
            ].map((demo) => (
              <div
                key={demo.name}
                className="glass-card p-4 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-toffee-500/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-toffee-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-200">{demo.name}</p>
                      <p className="text-xs text-navy-500">{demo.platform} • {demo.tokens} tokens</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-accent-emerald/10 text-accent-emerald font-mono">
                    {demo.ratio} ratio
                  </span>
                  <div className="flex-1" />
                  <button className="p-1.5 rounded-lg text-navy-500 hover:text-navy-300 hover:bg-navy-800/50 transition-all">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 rounded-lg text-navy-500 hover:text-accent-rose hover:bg-accent-rose/5 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
