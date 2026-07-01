import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-navy-950 text-navy-100 antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
