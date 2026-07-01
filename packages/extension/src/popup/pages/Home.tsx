
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Search, FileText, ArrowRightLeft } from 'lucide-react';
import { useLibraryStore } from '../stores/libraryStore';

export default function Home() {
  const { bundles, searchQuery, setSearchQuery } = useLibraryStore();

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          id="search-bundles"
          type="text"
          placeholder="Search bundles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button id="btn-new-capture" className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-sm">
          <Plus className="w-4 h-4" />
          Capture
        </button>
        <button id="btn-import-bundle" className="btn-secondary flex-1 flex items-center justify-center gap-1.5 text-sm">
          <FolderOpen className="w-4 h-4" />
          Import
        </button>
      </div>

      {/* Bundle List */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider">
          Your Bundles ({bundles.length})
        </h2>

        {bundles.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-3 cursor-pointer hover:border-toffee-300 dark:hover:border-toffee-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="mt-0.5 w-8 h-8 rounded-lg bg-toffee-100 dark:bg-toffee-900/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-toffee-600 dark:text-toffee-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-900 dark:text-navy-100 truncate">
                        {bundle.displayName || 'Untitled Bundle'}
                      </p>
                      <p className="text-2xs text-navy-400 mt-0.5">
                        <span className="badge-platform mr-1">{bundle.sourcePlatform}</span>
                        {bundle.tokenCountBundle.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-navy-400" />
                  </button>
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
    <div className="text-center py-8 space-y-3">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-navy-100 dark:bg-navy-800 flex items-center justify-center">
        <FileText className="w-6 h-6 text-navy-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-navy-600 dark:text-navy-300">No bundles yet</p>
        <p className="text-2xs text-navy-400 mt-1">
          Visit any AI platform and click &quot;Capture&quot; to create your first .toffee bundle
        </p>
      </div>
    </div>
  );
}
