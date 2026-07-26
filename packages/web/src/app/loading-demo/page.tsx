"use client";

import { useState } from "react";
import ToffeeLoader from "@/components/ui/ToffeeLoader";

export default function LoadingDemoPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [key, setKey] = useState(0);

  const restart = () => {
    setShowLoader(false);
    setTimeout(() => {
      setKey((k) => k + 1);
      setShowLoader(true);
    }, 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      {showLoader && (
        <ToffeeLoader
          key={key}
          onComplete={() => setShowLoader(false)}
        />
      )}

      {/* Controls */}
      <div className="fixed bottom-6 right-6 z-[10000] flex gap-3">
        {showLoader && (
          <button
            onClick={() => setShowLoader(false)}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg backdrop-blur-sm transition-all duration-200"
            style={{
              background: "rgba(30,41,59,0.8)",
              border: "1px solid rgba(71,85,105,0.5)",
              color: "#94a3b8",
            }}
          >
            Skip
          </button>
        )}
        {!showLoader && (
          <button
            onClick={restart}
            className="px-4 py-2 text-xs font-mono font-medium rounded-lg backdrop-blur-sm transition-all duration-200"
            style={{
              background: "rgba(30,41,59,0.8)",
              border: "1px solid rgba(71,85,105,0.5)",
              color: "#94a3b8",
            }}
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}
