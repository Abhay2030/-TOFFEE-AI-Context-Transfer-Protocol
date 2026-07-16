import { type ReactNode, useEffect } from 'react';
import { User, Cloud, Shield, Moon, Globe, LogOut, ChevronRight, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsPage() {
  const {
    cloudSync, darkMode, language, syncStatus, lastSyncAt,
    toggleCloudSync, toggleDarkMode, setLanguage,
    loadFromStorage, triggerManualSync,
  } = useSettingsStore();
  const user = auth.currentUser;

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="pt-2 pb-28 space-y-8 relative">
      {/* Ambient Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[#F59E0B]/5 rounded-full blur-[60px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-[50px] -z-10 pointer-events-none" />

      {/* Account Section */}
      <section className="space-y-3 relative z-10">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-2">
          Account
        </h2>
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-glass rounded-2xl p-4 flex items-center justify-between overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
            
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full flex items-center justify-center p-[2px] bg-gradient-to-tr from-[#F59E0B] to-[#EC4899]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-white/90 font-display">
                  {user?.displayName || 'Toffee User'}
                </p>
                <p className="text-[11px] text-white/50 font-light tracking-wide">{user?.email}</p>
              </div>
            </div>
            <button 
              id="btn-sign-out" 
              onClick={handleSignOut}
              className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-3 relative z-10">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-2">
          Preferences
        </h2>
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-glass rounded-2xl overflow-hidden divide-y divide-white/5">
          <SettingRow
            icon={<Cloud className="w-4 h-4 text-[#38BDF8]" />}
            iconBg="bg-[#38BDF8]/10"
            label="Cloud Sync"
            description={cloudSync
              ? syncStatus === 'syncing'
                ? 'Syncing...'
                : lastSyncAt
                  ? `Last synced ${new Date(lastSyncAt).toLocaleTimeString()}`
                  : 'Enabled — waiting for first sync'
              : 'Sync bundles across devices'
            }
          >
            <div className="flex items-center gap-2">
              {cloudSync && (
                <button
                  id="btn-sync-now"
                  onClick={() => triggerManualSync()}
                  disabled={syncStatus === 'syncing'}
                  className="p-1.5 rounded-lg text-white/40 hover:text-[#38BDF8] hover:bg-[#38BDF8]/10 transition-all duration-300 disabled:opacity-40"
                  title="Sync Now"
                >
                  {syncStatus === 'syncing' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : syncStatus === 'success' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : syncStatus === 'error' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              <Toggle id="toggle-cloud-sync" enabled={cloudSync} onChange={toggleCloudSync} />
            </div>
          </SettingRow>
          
          <SettingRow
            icon={<Moon className="w-4 h-4 text-[#A78BFA]" />}
            iconBg="bg-[#A78BFA]/10"
            label="Dark Mode"
            description="Follow system preference"
          >
            <Toggle id="toggle-dark-mode" enabled={darkMode} onChange={toggleDarkMode} />
          </SettingRow>
          
          <SettingRow
            icon={<Globe className="w-4 h-4 text-[#34D399]" />}
            iconBg="bg-[#34D399]/10"
            label="Language"
            description="Interface language"
          >
            <div className="relative group/select">
              <select
                id="select-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none text-xs font-medium bg-white/5 border border-white/10 text-white/80 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all cursor-pointer hover:bg-white/10"
              >
                <option value="en" className="bg-[#1A1A1A]">English</option>
                <option value="es" className="bg-[#1A1A1A]">Español</option>
                <option value="fr" className="bg-[#1A1A1A]">Français</option>
                <option value="de" className="bg-[#1A1A1A]">Deutsch</option>
                <option value="ja" className="bg-[#1A1A1A]">日本語</option>
                <option value="zh" className="bg-[#1A1A1A]">中文</option>
              </select>
              <ChevronRight className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover/select:text-white/70 transition-colors" />
            </div>
          </SettingRow>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-3 relative z-10">
        <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-2">
          Security
        </h2>
        <div className="group relative">
          <div className="absolute inset-0 bg-[#10B981]/5 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-glass rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
              <Shield className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white/90">End-to-End Encryption</p>
              <p className="text-[11px] text-white/50 font-light">AES-256-GCM • Secured locally</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-6 pb-2 relative z-10 space-y-1">
        <p className="text-[10px] text-white/40 font-medium tracking-wider">
          Toffee • The Universal AI Context Transfer Platform
        </p>
        <p className="text-[9px] text-white/30 tracking-wider">
          Created & Built by Abhay Sachin Donde
        </p>
      </div>
    </div>
  );
}

function SettingRow({ icon, iconBg, label, description, children }: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 shadow-inner ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-[13px] font-medium text-white/90">{label}</p>
          <p className="text-[11px] text-white/40 font-light mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ id, enabled, onChange }: { id: string; enabled: boolean; onChange: () => void }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 outline-none
        border border-white/5 shadow-inner
        ${enabled ? 'bg-gradient-to-r from-[#F59E0B] to-[#EC4899] shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-white/10 hover:bg-white/15'}
      `}
    >
      <span
        className={`
          absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white 
          transition-all duration-300 ease-spring
          ${enabled ? 'translate-x-5 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'translate-x-0 shadow-sm opacity-80'}
        `}
      />
    </button>
  );
}
