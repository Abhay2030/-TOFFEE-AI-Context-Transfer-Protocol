"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Github, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "@/utils/firebase/firebase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getFirebaseErrorMessage = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('auth/popup-blocked')) return 'Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.';
    if (msg.includes('auth/popup-closed-by-user')) return 'Sign-in was cancelled. Please try again.';
    if (msg.includes('auth/unauthorized-domain')) return 'This domain is not authorized for sign-in. Please contact the administrator.';
    if (msg.includes('auth/internal-error')) return 'Google sign-in is temporarily unavailable. Please try email/password login.';
    if (msg.includes('auth/network-request-failed')) return 'Network error. Please check your internet connection.';
    if (msg.includes('access_denied') || msg.includes('Access blocked')) return 'Access blocked by Google. The app owner needs to publish the OAuth consent screen. Please try email/password login.';
    return msg;
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      setError("");
      const authProvider = provider === 'google' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth!, authProvider);
      const idToken = await result.user.getIdToken();
      localStorage.setItem("toffee_access_token", idToken);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth!, email, password);

      // Set display name on the Firebase user profile
      if (name) {
        await updateProfile(result.user, { displayName: name });
      }

      const idToken = await result.user.getIdToken();
      localStorage.setItem("toffee_access_token", idToken);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-navy-700/50">
              <Image src="/logo.png" alt="Toffee Logo" fill className="object-cover" />
            </div>
            <span className="text-2xl font-bold text-white">Toffee</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-sm text-navy-400">
            Start transferring AI context for free
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => handleOAuth('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-navy-700/50 text-sm font-medium text-navy-200 hover:bg-white/10 hover:border-navy-600 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <button 
              onClick={() => handleOAuth('github')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-navy-700/50 text-sm font-medium text-navy-200 hover:bg-white/10 hover:border-navy-600 transition-all disabled:opacity-50"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-navy-700/50" />
            <span className="text-xs text-navy-500 uppercase">or</span>
            <div className="flex-1 h-px bg-navy-700/50" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-navy-300 mb-1.5 block">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  id="register-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 focus:border-toffee-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-navy-300 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 focus:border-toffee-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-navy-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 focus:border-toffee-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
            </button>

            <p className="text-xs text-navy-500 text-center">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-navy-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-toffee-400 hover:text-toffee-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
