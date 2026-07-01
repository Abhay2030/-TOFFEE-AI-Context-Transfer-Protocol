"use client";

import { BarChart3, TrendingDown, Zap, DollarSign } from "lucide-react";

const STATS = [
  { label: "Tokens Consumed", value: "0", icon: BarChart3, color: "text-toffee-400", bg: "bg-toffee-500/10" },
  { label: "Tokens Saved", value: "0", icon: TrendingDown, color: "text-accent-emerald", bg: "bg-accent-emerald/10" },
  { label: "Total Injections", value: "0", icon: Zap, color: "text-accent-violet", bg: "bg-accent-violet/10" },
  { label: "Est. Cost Savings", value: "$0.00", icon: DollarSign, color: "text-accent-amber", bg: "bg-accent-amber/10" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-navy-400 mt-1">
          Track your token savings and usage patterns
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-navy-400">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-6">
          Monthly Token Usage
        </h2>
        <div className="h-64 flex items-end justify-between gap-3 px-4">
          {MONTHS.map((month, i) => {
            // Use deterministic height based on index for placeholder
            const height = Math.max(8, 30 + (i * 15) % 70);
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex gap-1 items-end justify-center" style={{ height: "200px" }}>
                  <div
                    className="flex-1 max-w-8 rounded-t-lg bg-toffee-500/20 border border-toffee-500/10 transition-all hover:bg-toffee-500/30"
                    style={{ height: `${height}%` }}
                  />
                  <div
                    className="flex-1 max-w-8 rounded-t-lg bg-accent-emerald/20 border border-accent-emerald/10 transition-all hover:bg-accent-emerald/30"
                    style={{ height: `${Math.max(8, height * 0.7)}%` }}
                  />
                </div>
                <span className="text-xs text-navy-500">{month}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-toffee-500/30" />
            <span className="text-xs text-navy-400">Consumed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-accent-emerald/30" />
            <span className="text-xs text-navy-400">Saved</span>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-4">
          Platform Breakdown
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-navy-500">
            No data yet. Start using Toffee across AI platforms to see your breakdown.
          </p>
        </div>
      </div>
    </div>
  );
}
