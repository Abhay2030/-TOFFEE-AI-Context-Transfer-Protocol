"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Zap,
  TrendingDown,
  BarChart3,
  ArrowRight,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getUsageStats, getBundles, setupSSESync } from "@/lib/api";
import type { UsageStats, BundleItem } from "@/lib/api";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [recentBundles, setRecentBundles] = useState<BundleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [usageData, bundlesData] = await Promise.all([
        getUsageStats(),
        getBundles({ page: 1, pageSize: 5 }),
      ]);
      setStats(usageData);
      setRecentBundles(bundlesData.bundles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    let eventSource: EventSource | null = null;
    let mounted = true;

    // Set up real-time sync for new bundles
    setupSSESync((newBundleData) => {
      if (mounted) {
        console.log("Real-time sync: Received new bundle", newBundleData);
        // Refresh data when a new bundle is received
        loadData();
      }
    }).then(es => {
      eventSource = es;
    });

    return () => {
      mounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [loadData]);

  const STATS_CONFIG = [
    {
      label: "Total Bundles",
      value: stats ? formatNumber(stats.bundlesCreated) : "—",
      icon: FolderOpen,
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
      label: "Injections",
      value: stats ? formatNumber(stats.injectionsPerformed) : "—",
      icon: Zap,
      color: "text-accent-violet",
      bg: "bg-accent-violet/10",
    },
    {
      label: "Cost Saved",
      value: stats ? `$${stats.estimatedCostSavingsUsd.toFixed(2)}` : "—",
      icon: BarChart3,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-navy-400 mt-1">
          Welcome back! Here&apos;s your AI context transfer overview.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadData} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 hover:border-toffee-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {loading && <Loader2 className="w-4 h-4 text-navy-600 animate-spin" />}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-navy-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-navy-200 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/bundles"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-800/30 hover:bg-navy-800/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-toffee-500/10 flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-toffee-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-200">View Bundles</p>
                <p className="text-xs text-navy-500">Manage your .toffee library</p>
              </div>
              <ArrowRight className="w-4 h-4 text-navy-600 group-hover:text-navy-400 transition-colors" />
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-800/30 hover:bg-navy-800/50 transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-violet/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-accent-violet" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-200">View Analytics</p>
                <p className="text-xs text-navy-500">Token savings &amp; usage stats</p>
              </div>
              <ArrowRight className="w-4 h-4 text-navy-600 group-hover:text-navy-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Bundles */}
        <div className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-200">Recent Bundles</h2>
            <Link
              href="/dashboard/bundles"
              className="text-xs text-toffee-400 hover:text-toffee-300"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-navy-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-navy-500">Loading bundles...</p>
            </div>
          ) : recentBundles.length > 0 ? (
            <div className="space-y-2">
              {recentBundles.map((bundle) => (
                <Link
                  key={bundle.id}
                  href={`/dashboard/bundles`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-navy-800/20 hover:bg-navy-800/40 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-toffee-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-toffee-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-200 truncate">
                      {bundle.display_name || `${bundle.source_platform} Conversation`}
                    </p>
                    <p className="text-xs text-navy-500">
                      {bundle.source_platform} • {bundle.token_count_bundle.toLocaleString()} tokens
                    </p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-accent-emerald/10 text-accent-emerald font-mono flex-shrink-0">
                    {new Date(bundle.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-navy-800/50 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-navy-600" />
              </div>
              <p className="text-sm font-medium text-navy-400 mb-1">No bundles yet</p>
              <p className="text-xs text-navy-500 mb-4">
                Install the Toffee extension to start capturing AI conversations
              </p>
              <Link href="/install" className="btn-primary text-xs py-2 px-4 inline-block">
                Install Extension
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
