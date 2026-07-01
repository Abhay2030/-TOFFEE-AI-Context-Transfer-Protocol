import { type ReactNode } from 'react';
import { User, Cloud, Shield, Moon, Globe, LogOut } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsPage() {
  const { cloudSync, darkMode, language, toggleCloudSync, toggleDarkMode, setLanguage } = useSettingsStore();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Account Section */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
          Account
        </h2>
        <div className="glass-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-toffee-100 dark:bg-toffee-900/30 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-toffee-600 dark:text-toffee-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-navy-900 dark:text-navy-100">
                {user?.displayName || 'Toffee User'}
              </p>
              <p className="text-2xs text-navy-400">{user?.email}</p>
            </div>
          </div>
          <button 
            id="btn-sign-out" 
            onClick={handleSignOut}
            className="p-2 text-navy-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
          Preferences
        </h2>
        <div className="glass-card divide-y divide-navy-100 dark:divide-navy-800">
          <SettingRow
            icon={<Cloud className="w-4 h-4 text-toffee-500" />}
            label="Cloud Sync"
            description="Sync bundles across devices"
          >
            <Toggle id="toggle-cloud-sync" enabled={cloudSync} onChange={toggleCloudSync} />
          </SettingRow>
          <SettingRow
            icon={<Moon className="w-4 h-4 text-accent-violet" />}
            label="Dark Mode"
            description="Follow system preference"
          >
            <Toggle id="toggle-dark-mode" enabled={darkMode} onChange={toggleDarkMode} />
          </SettingRow>
          <SettingRow
            icon={<Globe className="w-4 h-4 text-accent-teal" />}
            label="Language"
            description="Interface language"
          >
            <select
              id="select-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-transparent text-navy-600 dark:text-navy-300 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </SettingRow>
        </div>
      </section>

      {/* Security */}
      <section className="space-y-2">
        <h2 className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
          Security
        </h2>
        <div className="glass-card p-3 flex items-center gap-3">
          <Shield className="w-4 h-4 text-accent-emerald" />
          <div className="flex-1">
            <p className="text-sm font-medium text-navy-900 dark:text-navy-100">Encryption</p>
            <p className="text-2xs text-navy-400">AES-256-GCM • All bundles encrypted locally</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-2xs text-navy-400">
          Toffee v1.0.0 • Made with ⚡ for AI power users
        </p>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, description, children }: {
  icon: ReactNode;
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-navy-900 dark:text-navy-100">{label}</p>
          <p className="text-2xs text-navy-400">{description}</p>
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
        relative w-9 h-5 rounded-full transition-colors duration-200
        ${enabled ? 'bg-toffee-500' : 'bg-navy-300 dark:bg-navy-600'}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm
          transition-transform duration-200
          ${enabled ? 'translate-x-4' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
