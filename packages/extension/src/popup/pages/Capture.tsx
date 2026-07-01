
import { Scan, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useCaptureStore } from '../stores/captureStore';
import { db } from '../../db/dexie';
import { generateToffeeBundle } from '../../core/bundleGenerator';

export default function Capture() {
  const { status, detectedPlatform, messageCount, progress } = useCaptureStore();

  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2 py-4">
        <div className={`
          w-16 h-16 mx-auto rounded-2xl flex items-center justify-center
          ${status === 'idle' ? 'bg-navy-100 dark:bg-navy-800' : ''}
          ${status === 'detecting' ? 'toffee-gradient animate-pulse-soft' : ''}
          ${status === 'capturing' ? 'toffee-gradient' : ''}
          ${status === 'complete' ? 'bg-emerald-100 dark:bg-emerald-900/30' : ''}
          ${status === 'error' ? 'bg-rose-100 dark:bg-rose-900/30' : ''}
        `}>
          {status === 'idle' && <Scan className="w-8 h-8 text-navy-400" />}
          {status === 'detecting' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {status === 'capturing' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
          {status === 'complete' && <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-rose-600 dark:text-rose-400" />}
        </div>

        <h2 className="text-lg font-semibold text-navy-900 dark:text-navy-100">
          {status === 'idle' && 'Ready to Capture'}
          {status === 'detecting' && 'Detecting Platform...'}
          {status === 'capturing' && 'Extracting Conversation...'}
          {status === 'complete' && 'Capture Complete!'}
          {status === 'error' && 'Capture Failed'}
        </h2>

        {detectedPlatform && (
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Platform: <span className="badge-platform">{detectedPlatform}</span>
          </p>
        )}
      </div>

      {/* Progress */}
      {status === 'capturing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-2xs text-navy-500">
            <span>Extracting messages...</span>
            <span>{messageCount} found</span>
          </div>
          <div className="w-full h-1.5 bg-navy-100 dark:bg-navy-800 rounded-full overflow-hidden">
            <div
              className="h-full toffee-gradient rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {(status === 'idle' || status === 'error') && (
          <button
            id="btn-start-capture"
            className="btn-primary w-full flex items-center justify-center gap-2"
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
            <Scan className="w-4 h-4" />
            Start Capture
          </button>
        )}

        {status === 'idle' && (
          <button id="btn-selective-capture" className="btn-secondary w-full text-sm">
            Selective Capture (choose messages)
          </button>
        )}

        {status === 'complete' && (
          <>
            <button 
              id="btn-generate-bundle" 
              className="btn-primary w-full"
              onClick={async () => {
                const { setStatus, setError } = useCaptureStore.getState();
                setStatus('capturing');
                try {
                  // Get the latest conversation from DB (the background script saved it)
                  const conversations = await db.conversations.orderBy('capturedAt').reverse().limit(1).toArray();
                  if (conversations.length === 0) throw new Error('No captured conversation found in DB');
                  
                  const conversation = conversations[0];
                  
                  // Generate bundle
                  const storedBundle = await generateToffeeBundle(conversation, { profile: 'standard' });
                  
                  // Save bundle to DB
                  await db.bundles.put(storedBundle);
                  
                  // Mark conversation as processed
                  await db.conversations.update(conversation.id, { processed: true });
                  
                  setStatus('idle');
                  alert('Bundle generated and saved to library!');
                } catch (e: any) {
                  console.error(e);
                  setError(e.message);
                }
              }}
            >
              Generate .toffee Bundle
            </button>
            <button className="btn-ghost w-full text-sm">
              Preview Extracted Data
            </button>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="glass-card p-3 space-y-1">
        <p className="text-2xs font-medium text-navy-600 dark:text-navy-300">💡 Tip</p>
        <p className="text-2xs text-navy-400">
          Navigate to a ChatGPT, Claude, or Gemini conversation before capturing.
          Toffee will automatically detect the platform.
        </p>
      </div>
    </div>
  );
}
