import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Scan, Zap, BarChart3, Settings, Sparkles } from 'lucide-react';
import Home from './pages/Home';
import Capture from './pages/Capture';
import Inject from './pages/Inject';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import { auth } from '../lib/firebase';
import { User } from 'firebase/auth';

type Tab = 'home' | 'capture' | 'inject' | 'analytics' | 'settings';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Library', icon: Library },
  { id: 'capture', label: 'Capture', icon: Scan },
  { id: 'inject', label: 'Inject', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home': return <Home />;
      case 'capture': return <Capture />;
      case 'inject': return <Inject />;
      case 'analytics': return <Analytics />;
      case 'settings': return <SettingsPage />;
    }
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-navy-950">
        <div className="w-8 h-8 rounded-full border-2 border-toffee-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[600px]">
        <Login />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-navy-950">
      {/* ── Header ──────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-navy-100 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg toffee-gradient flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-base font-bold toffee-gradient-text">Toffee</h1>
        </div>
        <span className="badge badge-profile text-2xs">v1.0.0</span>
      </header>

      {/* ── Page Content ────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom Navigation ───────────────────────────── */}
      <nav className="flex items-center justify-around px-2 py-2 border-t border-navy-100 dark:border-navy-800 bg-white/90 dark:bg-navy-950/90 backdrop-blur-sm">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`nav-tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`
                flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-150
                ${isActive
                  ? 'text-toffee-600 dark:text-toffee-400'
                  : 'text-navy-400 dark:text-navy-500 hover:text-navy-600 dark:hover:text-navy-300'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-2xs font-medium">{label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 w-6 h-0.5 rounded-full toffee-gradient"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
