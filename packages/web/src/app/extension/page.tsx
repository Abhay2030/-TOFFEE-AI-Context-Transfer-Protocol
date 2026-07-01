import { Chrome, Download, Shield, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ExtensionPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium mb-6">
              <Chrome className="w-4 h-4" />
              <span>Available for Chrome & Edge</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              The Toffee <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-toffee-400 to-accent-violet">Browser Engine</span>
            </h1>
            
            <p className="text-lg text-navy-400 mb-8 max-w-xl mx-auto lg:mx-0">
              A lightweight, highly-optimized Manifest V3 extension that acts as your universal AI context bridge.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/install" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
                <Download className="w-5 h-5" /> Install Extension
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md relative">
            {/* Glow */}
            <div className="absolute inset-0 bg-toffee-500/20 rounded-full blur-3xl -z-10 animate-pulse-soft" />
            
            {/* Mockup */}
            <div className="glass-card border-toffee-500/30 p-2 rounded-3xl shadow-2xl overflow-hidden aspect-[4/5] bg-navy-900/80 flex flex-col items-center justify-center relative group">
              <div className="w-64 h-96 bg-navy-950 border border-navy-800 rounded-2xl shadow-inner relative overflow-hidden flex flex-col">
                {/* Popup Header */}
                <div className="h-12 border-b border-navy-800 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md toffee-gradient flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white">Toffee</span>
                  </div>
                </div>
                {/* Popup Body */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center mb-2">
                     <Shield className="w-6 h-6 text-accent-emerald" />
                   </div>
                   <p className="text-sm font-semibold text-white">Capture Complete!</p>
                   <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden">
                     <div className="w-full h-full bg-accent-emerald" />
                   </div>
                   <button className="w-full py-2 rounded-lg bg-toffee-500 text-white text-xs font-semibold mt-4">Generate Bundle</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="glass-card p-6 border-l-2 border-l-toffee-500">
            <h3 className="text-white font-bold mb-2">Manifest V3</h3>
            <p className="text-sm text-navy-400">Built on the latest, most secure extension architecture for minimal memory footprint.</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-l-accent-violet">
            <h3 className="text-white font-bold mb-2">Dexie Local DB</h3>
            <p className="text-sm text-navy-400">Uses your browser&apos;s native IndexedDB to store hundreds of `.toffee` bundles totally offline.</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-l-accent-emerald">
            <h3 className="text-white font-bold mb-2">No Tracking</h3>
            <p className="text-sm text-navy-400">We don&apos;t use Google Analytics in the extension. Your context stays strictly on your machine.</p>
          </div>
        </div>

        {/* Creator Note */}
        <div className="mt-16 pt-8 border-t border-navy-800/50 flex justify-center">
          <p className="text-sm text-navy-500 flex items-center gap-2">
            Designed & Developed by <span className="text-toffee-400 font-medium">Abhay</span>
          </p>
        </div>

      </div>
    </div>
  );
}
