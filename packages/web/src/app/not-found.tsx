import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-navy-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <PageTransition>
          <div className="max-w-xl w-full text-center">
            <GlassCard className="p-12 border-toffee-500/20 bg-navy-900/50">
              <div className="w-20 h-20 bg-toffee-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-10 h-10 text-toffee-400" />
              </div>
              
              <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">404</h1>
              <h2 className="text-2xl font-bold text-white mb-4">Context Not Found</h2>
              
              <p className="text-navy-300 mb-10 text-lg">
                The page you are looking for has been lost in the latent space. It might have been moved, deleted, or never existed.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/" className="btn-primary py-3 px-8 flex items-center gap-2 w-full sm:w-auto justify-center">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <Link href="/blog" className="btn-secondary py-3 px-8 w-full sm:w-auto justify-center">
                  Read our Blog
                </Link>
              </div>
            </GlassCard>
          </div>
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
