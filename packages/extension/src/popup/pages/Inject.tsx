
import { useState, useEffect } from 'react';
import { Zap, ChevronDown, FileText, Gauge, Loader2 } from 'lucide-react';
import { db, type StoredBundle } from '../../db/database';
import { optimizeBundleForInjection } from '../../core/injection/tokenOptimizer';
import { gunzipString, base64ToUint8Array } from '../../core/compression';

export default function Inject() {
  const [bundles, setBundles] = useState<StoredBundle[]>([]);
  const [selectedBundleId, setSelectedBundleId] = useState<string>('');
  const [mode, setMode] = useState<'auto' | 'manual' | 'clipboard'>('auto');
  const [tokenBudget, setTokenBudget] = useState(4096);
  const [isInjecting, setIsInjecting] = useState(false);

  useEffect(() => {
    db.bundles.orderBy('createdAt').reverse().toArray().then((results) => {
      setBundles(results);
      if (results.length > 0) setSelectedBundleId(results[0].id);
    });
  }, []);
  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2 py-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-teal/10 flex items-center justify-center">
          <Zap className="w-7 h-7 text-accent-teal" />
        </div>
        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-100">Inject Context</h2>
        <p className="text-sm text-navy-500 dark:text-navy-400">
          Transfer a .toffee bundle into your current AI conversation
        </p>
      </div>

      {/* Bundle Selector */}
      <div className="space-y-2">
        <div className="relative">
          <select 
            id="btn-select-bundle" 
            className="input-field w-full appearance-none pl-10 pr-8"
            value={selectedBundleId}
            onChange={(e) => setSelectedBundleId(e.target.value)}
          >
            {bundles.length === 0 && <option value="">No bundles available</option>}
            {bundles.map(b => (
              <option key={b.id} value={b.id}>{b.displayName} ({b.tokenCountBundle} tokens)</option>
            ))}
          </select>
          <FileText className="w-4 h-4 text-toffee-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-4 h-4 text-navy-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Injection Mode */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-navy-600 dark:text-navy-300">Injection Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {(['auto', 'manual', 'clipboard'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`glass-card p-2.5 text-center transition-colors ${mode === m ? 'border-toffee-500 bg-toffee-500/10' : 'hover:border-toffee-300 dark:hover:border-toffee-700'}`}
            >
              <p className={`text-xs font-medium capitalize ${mode === m ? 'text-toffee-600 dark:text-toffee-400' : 'text-navy-700 dark:text-navy-200'}`}>{m}</p>
              <p className="text-2xs text-navy-400 mt-0.5">
                {m === 'auto' && 'Prepend'}
                {m === 'manual' && 'On trigger'}
                {m === 'clipboard' && 'Copy'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Token Budget */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-navy-600 dark:text-navy-300 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            Token Budget
          </label>
          <span className="text-2xs font-mono text-toffee-600 dark:text-toffee-400">{tokenBudget.toLocaleString()}</span>
        </div>
        <input
          id="token-budget-slider"
          type="range"
          min="100"
          max="128000"
          value={tokenBudget}
          onChange={(e) => setTokenBudget(parseInt(e.target.value))}
          step="100"
          className="w-full accent-toffee-500"
        />
        <div className="flex justify-between text-2xs text-navy-400">
          <span>100</span>
          <span>128K</span>
        </div>
      </div>

      {/* Inject Button */}
      <button 
        id="btn-inject-context" 
        className="btn-primary w-full flex items-center justify-center gap-2"
        disabled={isInjecting || !selectedBundleId}
        onClick={async () => {
          setIsInjecting(true);
          try {
            const bundleRecord = bundles.find(b => b.id === selectedBundleId);
            if (!bundleRecord) throw new Error("Bundle not found");
            
            // Decompress
            const decompressedJson = await gunzipString(base64ToUint8Array(bundleRecord.bundleData));
            const rawBundle = JSON.parse(decompressedJson);
            
            // Optimize
            const { optimizedBundle } = optimizeBundleForInjection(rawBundle, {
              targetModel: 'gpt-4o', // Can be detected dynamically later
              maxAbsoluteTokens: tokenBudget
            });
            
            // Format for prompt
            const formattedPrompt = `[TOFFEE_CONTEXT_BUNDLE v1]\n${JSON.stringify(optimizedBundle, null, 2)}\n[/TOFFEE_CONTEXT_BUNDLE]\n\nPlease use the above context for our conversation.`;
            
            const response = await chrome.runtime.sendMessage({ 
              type: 'INJECT_REQUEST', 
              payload: { 
                formattedPrompt, 
                options: { mode, tokenBudget } 
              } 
            });
            
            if (response?.success) {
              alert(mode === 'clipboard' ? 'Copied to clipboard!' : 'Injected successfully!');
            } else {
              alert('Failed: ' + (response?.error || 'Unknown error'));
            }
          } catch (e: any) {
            alert('Error: ' + e.message);
          } finally {
            setIsInjecting(false);
          }
        }}
      >
        {isInjecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {isInjecting ? 'Injecting...' : 'Inject Context'}
      </button>
    </div>
  );
}
