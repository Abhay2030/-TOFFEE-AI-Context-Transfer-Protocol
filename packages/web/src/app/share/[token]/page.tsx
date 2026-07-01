"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Eye,
  Lock,
  Download,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Image from "next/image";

export default function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [password, setPassword] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bundle, setBundle] = useState<{
    display_name: string;
    source_platform: string;
    compression_profile: string;
    token_count_bundle: number;
    expiresAt: string;
    expiresInHours: number;
    accessCount: number;
  } | null>(null);
  const [error, setError] = useState("");

  const fetchBundle = async (pwd?: string) => {
    setLoading(true);
    setError("");
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/v1/share/${token}`
      );
      if (pwd) url.searchParams.set("password", pwd);

      const res = await fetch(url.toString());
      if (res.status === 401) {
        setNeedsPassword(true);
        setError("This bundle is password-protected");
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load bundle");
      }

      const data = await res.json();
      setBundle({
        display_name: data.bundle.display_name,
        source_platform: data.bundle.source_platform,
        compression_profile: data.bundle.compression_profile,
        token_count_bundle: data.bundle.token_count_bundle,
        expiresAt: data.expiresAt,
        expiresInHours: Math.ceil((new Date(data.expiresAt).getTime() - Date.now()) / 3600000),
        accessCount: data.accessCount,
      });
      setNeedsPassword(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-navy-400 hover:text-navy-200 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Toffee
        </Link>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative w-14 h-14 mx-auto rounded-2xl overflow-hidden shadow-lg border border-navy-700/50 mb-4">
              <Image src="/logo.png" alt="Toffee Logo" fill className="object-cover" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">
              Shared Toffee Bundle
            </h1>
            <p className="text-sm text-navy-400">
              Someone shared an AI context bundle with you
            </p>
          </div>

          {/* Not loaded yet */}
          {!bundle && !needsPassword && !error && (
            <button
              onClick={() => fetchBundle()}
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  View Bundle
                </>
              )}
            </button>
          )}

          {/* Password Gate */}
          {needsPassword && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-amber/5 border border-accent-amber/10">
                <Lock className="w-4 h-4 text-accent-amber" />
                <p className="text-sm text-navy-300">
                  This bundle is password-protected
                </p>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 transition-all"
                />
              </div>
              <button
                onClick={() => fetchBundle(password)}
                disabled={loading || !password}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock Bundle"}
              </button>
            </div>
          )}

          {/* Error */}
          {error && !needsPassword && (
            <div className="px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose text-center">
              {error}
            </div>
          )}

          {/* Bundle Display */}
          {bundle && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-navy-800/30 border border-navy-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-toffee-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-toffee-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {bundle.display_name || "Untitled Bundle"}
                    </p>
                    <p className="text-xs text-navy-400">
                      {bundle.source_platform} • {bundle.compression_profile} profile
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-navy-800/50">
                    <p className="text-lg font-bold text-white font-mono">
                      {bundle.token_count_bundle.toLocaleString()}
                    </p>
                    <p className="text-xs text-navy-500">Tokens</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-navy-800/50">
                    <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-navy-400" />
                      {bundle.expiresInHours}h
                    </p>
                    <p className="text-xs text-navy-500">Expires</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-navy-800/50">
                    <p className="text-lg font-bold text-white">
                      {bundle.accessCount}
                    </p>
                    <p className="text-xs text-navy-500">Views</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary w-full py-3">
                <Download className="w-4 h-4" />
                Download .toffee Bundle
              </button>
            </div>
          )}
        </div>

        {/* Token Display */}
        <p className="text-center text-xs text-navy-600 mt-4 font-mono">
          Share ID: {token.substring(0, 12)}...
        </p>
      </div>
    </div>
  );
}
