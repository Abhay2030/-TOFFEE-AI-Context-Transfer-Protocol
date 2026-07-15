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
    <div className="relative flex flex-col h-[600px] bg-[#0A0A0A] overflow-hidden">
      {/* ── Immersive Ambient Glow ────────────────────────── */}
      <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 bg-[#9333EA] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none" />

      {/* ── Header ──────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full toffee-gradient flex items-center justify-center shadow-lg shadow-[#F59E0B]/20 ring-1 ring-white/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Toffee</h1>
        </div>
        <div className="glass-pill px-3 py-1 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-white/80">v1.0.0</span>
        </div>
      </header>

      {/* ── Page Content ────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto pb-24 px-4 scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Floating Navigation Dock ──────────────────────── */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <nav className="glass-pill flex items-center gap-1 px-2 py-2 pointer-events-auto shadow-2xl shadow-black/80">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={`
                  relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 group
                  ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? '-translate-y-2' : 'group-hover:scale-110'}`} />
                <AnimatePresence>
                  {isActive && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 8 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute text-[10px] font-medium tracking-wide"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="dock-indicator"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
