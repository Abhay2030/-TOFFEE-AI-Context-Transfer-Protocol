import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingDown, Coins, ArrowRightLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { db } from '../../db/database';

interface AnalyticsData {
  tokensConsumed: number;
  tokensSaved: number;
  totalTransfers: number;
  platformUsage: Record<string, number>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const bundles = await db.bundles.toArray();
        
        let tokensConsumed = 0;
        let tokensSaved = 0;
        const platformUsage: Record<string, number> = {};

        for (const bundle of bundles) {
          tokensConsumed += bundle.tokenCountOriginal || 0;
          tokensSaved += (bundle.tokenCountOriginal || 0) - (bundle.tokenCountBundle || 0);
          
          const platform = bundle.sourcePlatform || 'unknown';
          platformUsage[platform] = (platformUsage[platform] || 0) + (bundle.tokenCountOriginal || 0);
        }

        setData({
          tokensConsumed,
          tokensSaved: Math.max(0, tokensSaved),
          totalTransfers: bundles.length,
          platformUsage,
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-6 h-6 text-toffee-500 animate-spin" />
      </div>
    );
  }

  const { tokensConsumed, tokensSaved, totalTransfers, platformUsage } = data || {
    tokensConsumed: 0,
    tokensSaved: 0,
    totalTransfers: 0,
    platformUsage: {}
  };

  // Rough estimate: $10.00 per 1M tokens (GPT-4o input/output blended avg)
  const estSavings = (tokensSaved / 1000000) * 10.00;

  const platforms = Object.entries(platformUsage)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: tokensConsumed > 0 ? Math.round((count / tokensConsumed) * 100) : 0
    }));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-6 pb-28"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white tracking-wide">Usage Analytics</h2>
        <div className="px-2.5 py-1 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-[10px] font-bold text-toffee-400 tracking-widest uppercase">
          Live Data
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<BarChart3 className="w-4 h-4 text-toffee-500" />}
          label="Tokens Consumed"
          value={tokensConsumed.toLocaleString()}
          subtext="Total captured"
          delay={0.1}
        />
        <StatCard
          icon={<TrendingDown className="w-4 h-4 text-emerald-400" />}
          label="Tokens Saved"
          value={tokensSaved.toLocaleString()}
          subtext="Via compression"
          delay={0.2}
        />
        <StatCard
          icon={<Coins className="w-4 h-4 text-amber-400" />}
          label="Est. Savings"
          value={`$${estSavings.toFixed(2)}`}
          subtext="USD saved"
          delay={0.3}
        />
        <StatCard
          icon={<ArrowRightLeft className="w-4 h-4 text-violet-400" />}
          label="Total Transfers"
          value={totalTransfers.toLocaleString()}
          subtext="Context injected"
          delay={0.4}
        />
      </div>

      {/* Usage by Platform */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Platform Distribution
        </h3>
        
        {platforms.length > 0 ? (
          <div className="glass-card p-4 space-y-4">
            {platforms.map((platform, i) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/80 capitalize font-medium">{platform.name}</span>
                  <span className="text-white/50">{platform.percentage}% ({platform.count.toLocaleString()})</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${platform.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-toffee-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                      i === 1 ? 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]' :
                      'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 toffee-gradient opacity-5" />
            <p className="text-sm font-medium text-white/80">No usage data yet</p>
            <p className="text-xs text-white/50 mt-2">
              Start transferring context between AIs to see your analytics dashboard come alive.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, subtext, delay }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  delay: number;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="glass-card p-4 space-y-2 group hover:bg-white/5 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center gap-2 relative z-10">
        <div className="p-1.5 rounded-lg bg-black/30 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white relative z-10">{value}</p>
      <p className="text-[10px] text-white/40 relative z-10">{subtext}</p>
    </motion.div>
  );
}
