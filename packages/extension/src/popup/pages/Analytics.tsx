import React from 'react';
import { BarChart3, TrendingDown, Coins, ArrowRightLeft } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-semibold text-navy-900 dark:text-navy-100">Token Usage</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<BarChart3 className="w-4 h-4 text-toffee-500" />}
          label="Tokens Consumed"
          value="0"
          subtext="This month"
        />
        <StatCard
          icon={<TrendingDown className="w-4 h-4 text-accent-emerald" />}
          label="Tokens Saved"
          value="0"
          subtext="Via compression"
        />
        <StatCard
          icon={<Coins className="w-4 h-4 text-accent-amber" />}
          label="Est. Savings"
          value="$0.00"
          subtext="USD saved"
        />
        <StatCard
          icon={<ArrowRightLeft className="w-4 h-4 text-accent-violet" />}
          label="Transfers"
          value="0"
          subtext="Total injections"
        />
      </div>

      {/* Usage by Platform */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
          By Platform
        </h3>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-navy-400">No usage data yet</p>
          <p className="text-2xs text-navy-400 mt-1">
            Start transferring context to see analytics
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtext }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="glass-card p-3 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-2xs text-navy-500 dark:text-navy-400">{label}</span>
      </div>
      <p className="text-lg font-bold text-navy-900 dark:text-navy-100">{value}</p>
      <p className="text-2xs text-navy-400">{subtext}</p>
    </div>
  );
}
