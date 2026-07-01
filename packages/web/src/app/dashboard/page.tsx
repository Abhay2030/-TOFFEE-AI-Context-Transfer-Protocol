"use client";

import {
  FolderOpen,
  Zap,
  TrendingDown,
  BarChart3,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

const STATS = [
  {
    label: "Total Bundles",
    value: "0",
    icon: FolderOpen,
    color: "text-toffee-400",
    bg: "bg-toffee-500/10",
  },
  {
    label: "Tokens Saved",
    value: "0",
    icon: TrendingDown,
    color: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
  },
  {
    label: "Injections",
    value: "0",
    icon: Zap,
    color: "text-accent-violet",
    bg: "bg-accent-violet/10",
  },
  {
    label: "Cost Saved",
    value: "$0.00",
    icon: BarChart3,
    color: "text-accent-amber",
    bg: "bg-accent-amber/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-navy-400 mt-1">
          Welcome back! Here&apos;s your AI context transfer overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 hover:border-toffee-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
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
                <p className="text-xs text-navy-500">Token savings & usage stats</p>
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

          {/* Empty State */}
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
        </div>
      </div>
    </div>
  );
}
