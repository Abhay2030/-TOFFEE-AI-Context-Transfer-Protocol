"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Grid3X3,
  List,
  FileText,
  Share2,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { getBundles, deleteBundle, getTags, updateBundleTags } from "@/lib/api";
import type { BundleItem } from "@/lib/api";

const PLATFORM_FILTERS = ["All", "chatgpt", "claude", "gemini", "copilot", "grok", "perplexity"];
const PLATFORM_LABELS: Record<string, string> = {
  All: "All", chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini",
  copilot: "Copilot", grok: "Grok", perplexity: "Perplexity",
};

export default function BundlesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [editingTagsFor, setEditingTagsFor] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const pageSize = 12;

  const loadBundles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBundles({
        page,
        pageSize,
        search: search || undefined,
        tag: platformFilter !== "All" ? platformFilter : undefined,
      });
      setBundles(data.bundles);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bundles");
    } finally {
      setLoading(false);
    }
  }, [page, search, platformFilter]);

  useEffect(() => {
    setTimeout(() => loadBundles(), 0);
  }, [loadBundles]);

  const loadTags = useCallback(async () => {
    try {
      const tags = await getTags();
      // Filter out basic platform tags
      setCustomTags(tags.filter(t => !PLATFORM_FILTERS.includes(t.toLowerCase())));
    } catch (err) {
      console.error("Failed to load tags", err);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Reset page when filters change
  useEffect(() => {
    setTimeout(() => setPage(1), 0);
  }, [search, platformFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bundle permanently?")) return;
    try {
      setDeleting(id);
      await deleteBundle(id);
      setBundles((prev) => prev.filter((b) => b.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bundle");
    } finally {
      setDeleting(null);
    }
  };

  const handleAddTag = async (bundle: BundleItem) => {
    if (!newTagInput.trim()) return;
    const tag = newTagInput.trim().toLowerCase();
    if (bundle.tags?.includes(tag)) return;

    const newTags = [...(bundle.tags || []), tag];
    try {
      // Optimistic update
      setBundles(prev => prev.map(b => b.id === bundle.id ? { ...b, tags: newTags } : b));
      setNewTagInput("");
      setEditingTagsFor(null);
      if (!customTags.includes(tag)) {
        setCustomTags(prev => [...prev, tag]);
      }
      await updateBundleTags(bundle.id, newTags);
    } catch (err) {
      console.error("Failed to update tags");
      loadBundles();
    }
  };

  const handleRemoveTag = async (bundle: BundleItem, tagToRemove: string) => {
    const newTags = bundle.tags?.filter(t => t !== tagToRemove) || [];
    try {
      // Optimistic update
      setBundles(prev => prev.map(b => b.id === bundle.id ? { ...b, tags: newTags } : b));
      await updateBundleTags(bundle.id, newTags);
    } catch (err) {
      console.error("Failed to update tags");
      loadBundles();
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bundle Library</h1>
          <p className="text-sm text-navy-400 mt-1">
            {total > 0 ? `${total} bundle${total !== 1 ? "s" : ""} in your library` : "Manage your captured AI conversation bundles"}
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-rose/10 border border-accent-rose/20 text-sm text-accent-rose">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={loadBundles} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
          <input
            type="text"
            placeholder="Search bundles by name, platform, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/50 border border-navy-700/50 text-sm text-navy-100 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-toffee-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-navy-800/50 rounded-xl p-1 border border-navy-700/50">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-lg transition-all ${
              view === "grid" ? "bg-toffee-500/10 text-toffee-400" : "text-navy-500 hover:text-navy-300"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg transition-all ${
              view === "list" ? "bg-toffee-500/10 text-toffee-400" : "text-navy-500 hover:text-navy-300"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform Filter Chips */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {PLATFORM_FILTERS.map((platform) => (
            <button
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                platformFilter === platform
                  ? "bg-toffee-500/10 text-toffee-400 border border-toffee-500/20"
                  : "bg-navy-800/30 text-navy-400 border border-navy-700/30 hover:border-navy-600 hover:text-navy-300"
              }`}
            >
              {PLATFORM_LABELS[platform] || platform}
            </button>
          ))}
        </div>

        {/* Smart Folders / Tags */}
        {customTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-navy-800/50">
            <span className="text-xs text-navy-500 font-medium mr-1 uppercase tracking-wider">Smart Folders:</span>
            {customTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setPlatformFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  platformFilter === tag
                    ? "bg-accent-violet/10 text-accent-violet border border-accent-violet/20"
                    : "bg-navy-800/30 text-navy-400 border border-navy-700/30 hover:border-navy-600 hover:text-navy-300"
                }`}
              >
                # {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-10 h-10 text-navy-600 animate-spin mx-auto mb-4" />
          <p className="text-sm text-navy-500">Loading bundles...</p>
        </div>
      ) : bundles.length > 0 ? (
        <>
          {/* Bundle Cards */}
          <div className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-3`}>
            {bundles.map((bundle) => (
              <div key={bundle.id} className="glass-card p-4 text-left hover:border-toffee-500/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-toffee-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-toffee-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-200 truncate">
                        {bundle.display_name || `${bundle.source_platform} Conversation`}
                      </p>
                      <p className="text-xs text-navy-500">
                        {bundle.source_platform} • {bundle.token_count_bundle.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-accent-emerald/10 text-accent-emerald font-mono">
                    {bundle.compression_profile}
                  </span>
                  {bundle.tags?.filter(t => !PLATFORM_FILTERS.includes(t.toLowerCase())).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-navy-800/50 text-navy-400 flex items-center gap-1 group">
                      #{tag}
                      <button onClick={() => handleRemoveTag(bundle, tag)} className="hidden group-hover:block text-accent-rose hover:text-red-400">×</button>
                    </span>
                  ))}
                  {editingTagsFor === bundle.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleAddTag(bundle); }} className="flex items-center gap-1">
                      <input 
                        type="text" 
                        value={newTagInput} 
                        onChange={e => setNewTagInput(e.target.value)} 
                        placeholder="new tag..." 
                        autoFocus
                        onBlur={() => { setEditingTagsFor(null); handleAddTag(bundle); }}
                        className="text-xs px-2 py-0.5 rounded-md bg-navy-900 border border-navy-700 text-white w-24 outline-none"
                      />
                    </form>
                  ) : (
                    <button onClick={() => { setEditingTagsFor(bundle.id); setNewTagInput(""); }} className="text-xs px-2 py-0.5 rounded-md border border-dashed border-navy-600 text-navy-500 hover:text-navy-300">
                      + Tag
                    </button>
                  )}
                  <div className="flex-1 min-w-[20px]" />
                  <button className="p-1.5 rounded-lg text-navy-500 hover:text-navy-300 hover:bg-navy-800/50 transition-all">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    disabled={deleting === bundle.id}
                    className="p-1.5 rounded-lg text-navy-500 hover:text-accent-rose hover:bg-accent-rose/5 transition-all disabled:opacity-50"
                  >
                    {deleting === bundle.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-navy-600 mt-2">
                  {new Date(bundle.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-all disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-navy-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-navy-400 hover:text-navy-200 hover:bg-navy-800/50 transition-all disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-navy-800/30 flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-navy-700" />
          </div>
          <h3 className="text-lg font-semibold text-navy-300 mb-2">
            No bundles found
          </h3>
          <p className="text-sm text-navy-500 max-w-sm mx-auto mb-6">
            {search || platformFilter !== "All"
              ? "No bundles match your current filters. Try adjusting your search."
              : "Your captured AI conversation bundles will appear here. Install the Toffee browser extension to start capturing."}
          </p>
          {!search && platformFilter === "All" && (
            <div className="flex items-center justify-center gap-3">
              <Link href="/install" className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Install Extension
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
