import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { auth, signInWithGoogle } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-[#0A0A0A] p-4 items-center justify-center relative overflow-hidden">
      {/* Cinematic Background elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F59E0B] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#9333EA] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-sm glass-card p-8 border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#F59E0B] blur-[20px] opacity-40 rounded-full animate-pulse" />
            <div className="relative w-16 h-16 rounded-full glass flex items-center justify-center shadow-lg shadow-[#F59E0B]/20 ring-1 ring-white/20">
              <Sparkles className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Access Toffee</h2>
          <p className="text-sm text-white/50 mt-2 text-center">Synchronize your neural context across all AI models.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 text-center shadow-lg backdrop-blur-md">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-semibold text-sm transition-all duration-300 mb-6 shadow-sm disabled:opacity-50"
        >
          <Chrome className="w-5 h-5 text-white" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6 opacity-50">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">or email</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#F59E0B] transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/50 transition-all shadow-inner"
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#F59E0B] transition-colors" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/50 transition-all shadow-inner"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] mt-2 disabled:opacity-50"
          >
            <div className="absolute inset-0 toffee-gradient opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-xl group-hover:bg-transparent transition-colors duration-300">
              <span className="text-sm font-semibold text-white tracking-wide">
                {loading ? 'Authenticating...' : (isLogin ? 'Initialize Session' : 'Create Access Key')}
              </span>
              {!loading && <LogIn className="w-4 h-4 text-white" />}
            </div>
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs font-medium text-white/40 hover:text-white transition-colors"
          >
            {isLogin ? "No access key? Register" : "Have an access key? Connect"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
