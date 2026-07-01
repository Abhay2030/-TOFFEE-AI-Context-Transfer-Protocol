"use client";

import { User, Shield, Moon, Globe, Bell, CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-navy-400 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-toffee-500 to-accent-violet flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">User</p>
            <p className="text-sm text-navy-400">user@example.com</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-navy-400 mb-1.5 block">Display Name</label>
            <input
              type="text"
              defaultValue="User"
              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-navy-400 mb-1.5 block">Email</label>
            <input
              type="email"
              defaultValue="user@example.com"
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-navy-800/30 border border-navy-700/30 text-sm text-navy-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Plan */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy-200">Subscription</h2>
          <span className="px-2.5 py-1 rounded-lg bg-navy-800 text-xs font-semibold text-navy-300 uppercase tracking-wider">
            Free Plan
          </span>
        </div>
        <p className="text-sm text-navy-400 mb-4">
          You&apos;re on the free plan with 5 bundles per month. Upgrade for unlimited bundles, cloud sync, and more.
        </p>
        <button className="btn-primary text-sm py-2.5 px-5">
          <CreditCard className="w-4 h-4" />
          Upgrade to Pro
        </button>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-4">Preferences</h2>
        <div className="divide-y divide-navy-800/50">
          <SettingToggle
            icon={<Moon className="w-4 h-4 text-accent-violet" />}
            label="Dark Mode"
            description="Use dark theme across the platform"
            enabled={darkMode}
            onToggle={() => setDarkMode(!darkMode)}
          />
          <SettingToggle
            icon={<Bell className="w-4 h-4 text-accent-amber" />}
            label="Notifications"
            description="Get notified about bundle activity"
            enabled={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-accent-teal" />
              <div>
                <p className="text-sm font-medium text-navy-200">Language</p>
                <p className="text-xs text-navy-500">Interface language</p>
              </div>
            </div>
            <select className="text-sm bg-navy-800/50 border border-navy-700/50 rounded-lg px-3 py-1.5 text-navy-300 focus:outline-none">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-4">Security</h2>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-emerald/5 border border-accent-emerald/10">
          <Shield className="w-5 h-5 text-accent-emerald" />
          <div>
            <p className="text-sm font-medium text-navy-200">End-to-End Encryption</p>
            <p className="text-xs text-navy-400">AES-256-GCM • All bundles encrypted locally</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-accent-rose/20">
        <h2 className="text-sm font-semibold text-accent-rose mb-4">Danger Zone</h2>
        <p className="text-sm text-navy-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm font-medium text-accent-rose hover:bg-accent-rose/20 transition-all">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

function SettingToggle({
  icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-navy-200">{label}</p>
          <p className="text-xs text-navy-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-10 h-5.5 rounded-full transition-colors ${
          enabled ? "bg-toffee-500" : "bg-navy-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
