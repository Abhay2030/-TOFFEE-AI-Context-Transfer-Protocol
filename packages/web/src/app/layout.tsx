import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import DynamicBackground from "@/components/ui/DynamicBackground";
import { PageTransition } from "@/components/ui/PageTransition";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import GoogleAdSense from "@/components/monetization/GoogleAdSense";
import { Analytics } from "@vercel/analytics/react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Toffee — AI Context Transfer Protocol",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Toffee",
  },
  description:
    "Capture, compress, and transfer AI conversation context between ChatGPT, Claude, Gemini, Copilot, Grok, and Perplexity. Never re-explain yourself to an AI again.",
  keywords: [
    "AI",
    "context transfer",
    "ChatGPT",
    "Claude",
    "Gemini",
    "browser extension",
    "LLM",
    "prompt",
    "conversation",
  ],
  openGraph: {
    title: "Toffee — AI Context Transfer Protocol",
    description:
      "Never re-explain yourself to an AI again. Transfer context seamlessly between AI platforms.",
    type: "website",
  },
  other: {
    "google-adsense-account": "ca-pub-2490258091963191",
    "google-site-verification": "tmgivPVV3EFNvmmLqUEvwmClA7hOTQb34ZS3UTE0H-M",
  },
};

// Metadata and fonts are defined above

import { JsonLd, organizationJsonLd, websiteJsonLd, softwareAppJsonLd } from "@/components/seo/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SITE_URL = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-navy-950 text-navy-100 antialiased relative overflow-x-hidden`}>
        <JsonLd data={organizationJsonLd(SITE_URL)} />
        <JsonLd data={websiteJsonLd(SITE_URL)} />
        <JsonLd data={softwareAppJsonLd(SITE_URL)} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GlobalLoader />
          <GoogleAdSense publisherId="ca-pub-2490258091963191" />
          <ServiceWorkerRegister />
          <DynamicBackground />
          <SmoothScroll>
            <PageTransition>
              {children}
            </PageTransition>
          </SmoothScroll>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
