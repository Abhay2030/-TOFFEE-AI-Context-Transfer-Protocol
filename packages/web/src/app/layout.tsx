import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: "Toffee — AI Context Transfer Protocol",
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
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import DynamicBackground from "@/components/ui/DynamicBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans min-h-screen bg-navy-950 text-navy-100 antialiased relative overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DynamicBackground />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
