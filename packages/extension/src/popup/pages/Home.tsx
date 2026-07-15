
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Search, FileText, ArrowRightLeft } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';

export default function Home() {
  const { bundles, searchQuery, setSearchQuery } = useLibraryStore();

  return (
    <div className="pt-2 pb-6 space-y-5">
      {/* Search */}
      <div className="relative group">
        <div className="absolute inset-0 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative glass-pill flex items-center px-4 py-2 ring-1 ring-white/10 group-focus-within:ring-[#F59E0B]/50 transition-all">
          <Search className="w-4 h-4 text-white/50 mr-2" />
          <input
            id="search-bundles"
            type="text"
            placeholder="Search your memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button id="btn-new-capture" className="flex-1 relative group overflow-hidden rounded-2xl p-[1px]">
          <div className="absolute inset-0 toffee-gradient opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative h-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl group-hover:bg-[#0A0A0A]/60 transition-colors duration-300">
            <Plus className="w-4 h-4 text-[#F59E0B]" />
            <span className="text-sm font-semibold text-white">Capture</span>
          </div>
        </button>
        <button id="btn-import-bundle" className="flex-1 glass-card flex items-center justify-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors duration-300">
          <FolderOpen className="w-4 h-4 text-white/60" />
          <span className="text-sm font-medium text-white/80">Import</span>
        </button>
      </div>

      {/* Bundle List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
            Memories ({bundles.length})
          </h2>
        </div>

        {bundles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                className="group relative"
              >
                {/* Crystal Glow Effect behind card */}
                <div className="absolute inset-0 toffee-gradient opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl" />
                
                <div className="relative glass-card p-4 cursor-pointer hover:ring-[#F59E0B]/30 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <FileText className="w-5 h-5 text-white/80" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate group-hover:text-[#F59E0B] transition-colors">
                          {bundle.displayName || 'Untitled Memory'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                            {bundle.sourcePlatform}
                          </span>
                          <span className="text-[10px] text-white/40">
                            {bundle.tokenCountBundle.toLocaleString()} tokens
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                      <ArrowRightLeft className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 px-4 relative"
    >
      <div className="absolute inset-0 bg-[#F59E0B] blur-[100px] opacity-10 rounded-full animate-pulse" />
      <div className="relative w-16 h-16 mx-auto rounded-2xl glass-card flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <FileText className="w-8 h-8 text-[#F59E0B]" />
      </div>
      <div className="relative">
        <p className="text-base font-semibold text-white">No memories yet</p>
        <p className="text-xs text-white/50 mt-2 leading-relaxed max-w-[200px] mx-auto">
          Visit any AI platform and click <strong className="text-[#F59E0B] font-medium">Capture</strong> to extract your first memory crystal.
        </p>
      </div>
    </motion.div>
  );
}
