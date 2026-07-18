"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingDown, Zap, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
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
      value: stats ? formatNumber(stats.overview.totalTokensConsumed) : "—",
      icon: BarChart3,
      color: "text-toffee-400",
      bg: "bg-toffee-500/10",
    },
    {
      label: "Tokens Saved",
      value: stats ? formatNumber(stats.overview.totalTokensSaved) : "—",
      icon: TrendingDown,
      color: "text-accent-emerald",
      bg: "bg-accent-emerald/10",
    },
    {
      label: "Total Injections",
      value: stats ? formatNumber(stats.overview.injectionsPerformed) : "—",
      icon: Zap,
      color: "text-accent-violet",
      bg: "bg-accent-violet/10",
    },
    {
      label: "Est. Cost Savings",
      value: stats ? `$${stats.overview.estimatedCostSavingsUsd.toFixed(2)}` : "—",
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
        ) : stats && (stats.overview.bundlesCreated > 0 || stats.overview.injectionsPerformed > 0) ? (
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-toffee-400">{stats.overview.bundlesCreated}</p>
              <p className="text-xs text-navy-400 mt-1">Bundles Created</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-accent-emerald">{formatNumber(stats.overview.totalTokensSaved)}</p>
              <p className="text-xs text-navy-400 mt-1">Total Tokens Saved</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-navy-800/30">
              <p className="text-3xl font-bold text-accent-amber">${stats.overview.estimatedCostSavingsUsd.toFixed(4)}</p>
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

      {/* Usage Over Time */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-6">Usage Over Time (Last 30 Days)</h2>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-navy-600 animate-spin" />
            </div>
          ) : stats && stats.timeseries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A87B44" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A87B44" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => formatNumber(val)} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #1E293B', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Area type="monotone" dataKey="tokensSaved" name="Tokens Saved" stroke="#10B981" fillOpacity={1} fill="url(#colorSaved)" />
                <Area type="monotone" dataKey="tokensConsumed" name="Tokens Consumed" stroke="#A87B44" fillOpacity={1} fill="url(#colorConsumed)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-navy-500">No data available</div>
          )}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-6">Platform Breakdown</h2>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-navy-600 animate-spin" />
            </div>
          ) : stats && stats.platforms.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.platforms}
                  dataKey="tokens"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {stats.platforms.map((entry, index) => {
                    const colors = ['#A87B44', '#10B981', '#8B5CF6', '#F59E0B', '#3B82F6'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #1E293B', borderRadius: '8px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                  formatter={(value: number) => [formatNumber(value), 'Tokens']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-navy-500">No platform data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
