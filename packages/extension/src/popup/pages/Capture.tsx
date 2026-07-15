
import { Scan, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCaptureStore } from '../stores/captureStore';
import { db } from '../../db/database';
import { generateToffeeBundle } from '../../core/bundleGenerator';

export default function Capture() {
  const { status, detectedPlatform, messageCount, progress } = useCaptureStore();

  return (
    <div className="pt-2 pb-6 space-y-6">
      <div className="text-center space-y-3 py-6 relative">
        {/* Animated Radar Background */}
        {(status === 'detecting' || status === 'capturing') && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
            <div className="absolute inset-0 border-2 border-[#F59E0B] rounded-full animate-ping opacity-20" />
            <div className="absolute inset-2 border border-[#F59E0B] rounded-full animate-ping opacity-40" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <div className={`
          relative w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500 z-10
          ${status === 'idle' ? 'bg-white/5 border border-white/10 shadow-inner' : ''}
          ${status === 'detecting' ? 'toffee-gradient shadow-[0_0_40px_rgba(245,158,11,0.4)]' : ''}
          ${status === 'capturing' ? 'toffee-gradient shadow-[0_0_40px_rgba(245,158,11,0.4)] scale-110' : ''}
          ${status === 'complete' ? 'bg-emerald-500/20 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : ''}
          ${status === 'error' ? 'bg-rose-500/20 border border-rose-500/50 shadow-[0_0_30px_rgba(225,29,72,0.3)]' : ''}
        `}>
          {status === 'idle' && <Scan className="w-8 h-8 text-white/50" />}
          {status === 'detecting' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {status === 'capturing' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {status === 'complete' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-rose-400" />}
        </div>

        <div className="relative z-10 mt-6">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {status === 'idle' && 'Ready to Extract'}
            {status === 'detecting' && 'Detecting AI Interface...'}
            {status === 'capturing' && 'Extracting Memory Crystal...'}
            {status === 'complete' && 'Extraction Successful'}
            {status === 'error' && 'Extraction Failed'}
          </h2>
        </div>

        {detectedPlatform && (
          <p className="text-sm text-white/50 mt-1">
            Target: <span className="text-[10px] uppercase font-bold tracking-widest text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full ml-1">{detectedPlatform}</span>
          </p>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 text-center shadow-lg backdrop-blur-md">
            {useCaptureStore.getState().errorMessage === 'Content script not available on this page' 
              ? <span><strong>Tab is stale!</strong> Please press F5 to refresh this page so the extension can connect.</span>
              : useCaptureStore.getState().errorMessage || 'Unknown error occurred'}
          </div>
        )}
      </div>

      {/* Progress */}
      {status === 'capturing' && (
        <div className="space-y-3 glass-card p-4">
          <div className="flex justify-between text-xs text-white/60 font-medium">
            <span className="animate-pulse">Parsing DOM...</span>
            <span className="text-[#F59E0B]">{messageCount} nodes found</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full toffee-gradient rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 mt-4">
        {(status === 'idle' || status === 'error') && (
          <button
            id="btn-start-capture"
            className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
            onClick={async () => {
              const { setStatus, setMessageCount, setError } = useCaptureStore.getState();
              setStatus('capturing');
              
              try {
                const response = await chrome.runtime.sendMessage({ type: 'CAPTURE_REQUEST', payload: { selective: false } });
                
                if (response?.success) {
                  setMessageCount(response.messageCount);
                  setStatus('complete');
                } else {
                  setError(response?.error || 'Failed to capture conversation');
                }
              } catch (e: any) {
                setError(e.message);
              }
            }}
          >
            <div className="absolute inset-0 toffee-gradient opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2 px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl group-hover:bg-transparent transition-colors duration-300">
              <Scan className="w-5 h-5 text-white" />
              <span className="text-base font-semibold text-white tracking-wide">Extract Context</span>
            </div>
          </button>
        )}

        {status === 'idle' && (
          <button id="btn-selective-capture" className="w-full glass-card py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-300">
            Selective Extraction
          </button>
        )}

        {status === 'complete' && (
          <div className="space-y-3">
            <button 
              id="btn-generate-bundle" 
              className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
              onClick={async () => {
                const { setStatus, setError } = useCaptureStore.getState();
                setStatus('capturing');
                try {
                  const conversations = await db.conversations.orderBy('capturedAt').reverse().limit(1).toArray();
                  if (conversations.length === 0) throw new Error('No captured conversation found in DB');
                  const conversation = conversations[0];
                  const storedBundle = await generateToffeeBundle(conversation, { profile: 'standard' });
                  await db.bundles.put(storedBundle);
                  await db.conversations.update(conversation.id, { processed: true });
                  setStatus('idle');
                } catch (e: any) {
                  console.error(e);
                  setError(e.message);
                }
              }}
            >
              <div className="absolute inset-0 bg-emerald-500 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2 px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl rounded-2xl group-hover:bg-transparent transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-base font-semibold text-white tracking-wide">Save to Memory</span>
              </div>
            </button>
            <button className="w-full glass-card py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-300">
              Preview Extracted Data
            </button>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="glass-card p-4 space-y-2 mt-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F59E0B]/20 transition-colors" />
        <p className="text-xs font-bold text-[#F59E0B] tracking-wider uppercase">💡 Pro Tip</p>
        <p className="text-xs text-white/60 leading-relaxed relative z-10">
          Navigate to a ChatGPT, Claude, or Gemini conversation. Toffee automatically syncs with the active neural link.
        </p>
      </div>
    </div>
  );
}
