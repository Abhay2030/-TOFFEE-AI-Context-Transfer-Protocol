"use client";

import { User, Shield, Moon, Globe, Bell, CreditCard, Trash2, LogOut, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { auth } from "@/utils/firebase/firebase";
import { updateProfile, signOut, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Profile Form State
  const [displayName, setDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preferences
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || "");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile(user, { displayName });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-toffee-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-navy-400 mt-1">Manage your account and preferences</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-sm font-medium text-white transition-colors"
        >
          <LogOut className="w-4 h-4 text-navy-400" />
          Sign Out
        </button>
      </div>

      {/* Profile */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-6">Profile</h2>
        
        <div className="flex items-center gap-5 mb-8">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-toffee-500 to-accent-violet flex items-center justify-center ring-4 ring-navy-900 shadow-xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.displayName || "Toffee User"}</p>
            <p className="text-sm text-navy-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-navy-400 mb-1.5 block">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-white focus:outline-none focus:border-toffee-500/50 transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-navy-400 mb-1.5 block">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-navy-900/50 border border-navy-800/50 text-sm text-navy-500 cursor-not-allowed"
              />
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isSaving || displayName === user?.displayName}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-toffee-500 hover:bg-toffee-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold text-navy-950 transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saveSuccess ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Plan */}
      <div className="glass-card p-6 border-toffee-500/10 hover:border-toffee-500/30 transition-colors group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-navy-200">Subscription</h2>
          <span className="px-2.5 py-1 rounded-lg bg-navy-800 text-xs font-bold text-toffee-400 uppercase tracking-wider shadow-sm">
            Free Plan
          </span>
        </div>
        <p className="text-sm text-navy-400 mb-5 leading-relaxed">
          You&apos;re currently on the free plan with 5 context bundles per month. Upgrade to Pro for unlimited bundles, advanced AI models, and priority support.
        </p>
        <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-sm font-medium text-white rounded-xl transition-all shadow-sm">
          <CreditCard className="w-4 h-4 text-toffee-400" />
          Upgrade to Pro
        </Link>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-navy-200 mb-2">Preferences</h2>
        <div className="divide-y divide-navy-800/50">
          <SettingToggle
            icon={<Moon className="w-4 h-4 text-accent-violet" />}
            label="Dark Mode"
            description="Toggle between light and dark themes"
            enabled={theme === 'dark' || theme === 'system'}
            onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
          <SettingToggle
            icon={<Bell className="w-4 h-4 text-accent-amber" />}
            label="Email Notifications"
            description="Receive updates about your account and usage limits"
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
            <select className="text-sm bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-navy-300 focus:outline-none focus:border-toffee-500/50 transition-colors cursor-pointer">
              <option>English</option>
              <option>Español</option>
              <option>Français</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security & Danger Zone */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-navy-200 mb-4">Security</h2>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-emerald/5 border border-accent-emerald/10">
            <Shield className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-accent-emerald mb-1">Account Secure</p>
              <p className="text-xs text-navy-400 leading-relaxed">Secured via Firebase Auth with advanced encryption protocols.</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-accent-rose/10 hover:border-accent-rose/30 transition-colors">
          <h2 className="text-sm font-semibold text-accent-rose mb-4">Danger Zone</h2>
          <p className="text-xs text-navy-400 mb-5 leading-relaxed">
            Permanently delete your account and wipe all your saved context bundles. This cannot be undone.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-rose/10 hover:bg-accent-rose/20 text-sm font-medium text-accent-rose transition-colors w-full justify-center">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
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
    <div className="flex items-center justify-between py-4 group">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-navy-200">{label}</p>
          <p className="text-xs text-navy-500 group-hover:text-navy-400 transition-colors">{description}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 focus:ring-toffee-500 ${
          enabled ? "bg-toffee-500" : "bg-navy-700"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
