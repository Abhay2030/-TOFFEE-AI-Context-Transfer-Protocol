"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingDown, Zap, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { getUsageStats } from "@/lib/api";
import type { UsageStats } from "@/lib/api";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUsageStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const STATS_CONFIG = [
    {
      label: "Tokens Consumed",
      value: stats ? formatNumber(stats.totalTokensConsumed) : "—",
      icon: BarChart3,
      color: "text-toffee-400",
      bg: "bg-toffee-500/10",
    },
    {
      label: "Tokens Saved",
      value: stats ? formatNumber(stats.totalTokensSaved) : "—",
      icon: TrendingDown,
      color: "text-accent-emerald",
      bg: "bg-accent-emerald/10",
    },
    {
      label: "Total Injections",
      value: stats ? formatNumber(stats.injectionsPerformed) : "—",
      icon: Zap,
      color: "text-accent-violet",
      bg: "bg-accent-violet/10",
    },
    {
      label: "Est. Cost Savings",
      value: stats ? `$${stats.estimatedCostSavingsUsd.toFixed(2)}` : "—",
      icon: DollarSign,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-navy-400 mt-1">
          Track your token savings and usage patterns
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadStats} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-navy-400">{stat.label}</p>
              {loading && <Loader2 className="w-3 h-3 text-navy-600 animate-spin ml-auto" />}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-6">
          Usage Summary
        </h2>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-navy-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-navy-500">Loading analytics...</p>
          </div>
        ) : stats && (stats.bundlesCreated > 0 || stats.injectionsPerformed > 0) ? (
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-toffee-400">{stats.bundlesCreated}</p>
              <p className="text-xs text-navy-400 mt-1">Bundles Created</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-accent-emerald">{formatNumber(stats.totalTokensSaved)}</p>
              <p className="text-xs text-navy-400 mt-1">Total Tokens Saved</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-accent-amber">${stats.estimatedCostSavingsUsd.toFixed(4)}</p>
              <p className="text-xs text-navy-400 mt-1">Estimated Savings</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-navy-500">
              No data yet. Start using Toffee across AI platforms to see your analytics.
            </p>
          </div>
        )}
      </div>

      {/* Platform Breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-4">
          Platform Breakdown
        </h2>
        <div className="text-center py-8">
          <p className="text-sm text-navy-500">
            Platform-level analytics will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
