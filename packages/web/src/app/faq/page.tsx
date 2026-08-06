import { Metadata } from 'next';
import { HelpCircle, Terminal, Shield, Lock, Search, ChevronDown, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";
import { JsonLd, faqJsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'FAQ & Knowledge Base | Toffee AI',
  description: 'Frequently asked questions about Toffee AI, semantic compression, context transfer, security, and enterprise integration.',
};

const SITE_URL = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';

const FAQS = [
  {
    category: "General",
    questions: [
      {
        q: "What is AI Context Transfer?",
        a: "AI context transfer is the process of capturing the knowledge, decisions, and preferences accumulated during a conversation with one AI model and porting that information to another AI session or platform, preserving continuity without manually re-explaining everything."
      },
      {
        q: "Which AI platforms are supported?",
        a: "Toffee currently supports ChatGPT (GPT-4o, o1), Anthropic Claude (Sonnet 3.5, Opus), Google Gemini (1.5 Pro), Microsoft Copilot, and Perplexity AI. We are actively adding support for Grok and local models like Llama 3."
      },
      {
        q: "Is Toffee a browser extension or an API?",
        a: "Both. The easiest way to use Toffee is via our browser extension for Chrome, Edge, and Brave. For developers and enterprises, we provide an API to integrate our semantic compression engine directly into your applications."
      }
    ]
  },
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Does Toffee see my AI conversations?",
        a: "By default, no. Toffee operates on a local-first architecture. When you capture and compress a conversation using the browser extension, all processing happens locally on your device. Data is stored in your browser's IndexedDB."
      },
      {
        q: "How does Cloud Sync work securely?",
        a: "If you opt-in to Cloud Sync to access your bundles across devices, your data is encrypted on your device using AES-256-GCM before being sent to our servers. We cannot read the contents of your synchronized context bundles."
      },
      {
        q: "Is Toffee compliant with enterprise security policies?",
        a: "Yes. Our enterprise tier includes SSO, SAML integration, detailed audit logs, and the ability to deploy the compression engine in your own VPC or private cloud infrastructure."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "How much does semantic compression reduce token usage?",
        a: "On average, Toffee's semantic compression reduces conversation token usage by 60-80% while preserving over 95% of actionable context (decisions, entities, code, and preferences)."
      },
      {
        q: "What happens to code blocks during transfer?",
        a: "Toffee identifies the final, working version of any code artifact. Intermediate attempts, debugging iterations, and superseded implementations are discarded to save tokens, but the final solution and its context are preserved perfectly."
      },
      {
        q: "Can I self-host the Toffee API?",
        a: "Yes, self-hosting is available for our Enterprise customers. Please contact our sales team at enterprise@toffee.ai for more information."
      }
    ]
  }
];

// Flatten for JSON-LD
const flatFaqs = FAQS.flatMap(cat => 
  cat.questions.map(q => ({ question: q.q, answer: q.a }))
);

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(flatFaqs)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: SITE_URL },
        { name: 'FAQ', url: `${SITE_URL}/faq` },
      ])} />

      <PageTransition>
      <div className="min-h-screen bg-navy-950 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-navy-400 max-w-2xl mx-auto">
              Everything you need to know about the product, billing, security, and how the Toffee AI context protocol works.
            </p>
          </div>

          <div className="space-y-12">
            {FAQS.map((category, idx) => (
              <section key={idx}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-b border-navy-800 pb-3">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, fIdx) => (
                    <GlassCard key={fIdx} className="p-6 border-navy-800">
                      <h3 className="text-lg font-bold text-white mb-3">{faq.q}</h3>
                      <p className="text-navy-300 leading-relaxed">{faq.a}</p>
                    </GlassCard>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-2xl bg-gradient-to-br from-toffee-900/40 to-navy-900 border border-toffee-500/20 text-center">
            <MessageSquare className="w-10 h-10 text-toffee-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-navy-300 mb-6">Our support team is ready to help you with any technical or billing issues.</p>
            <Link href="/contact" className="btn-primary py-3 px-8 inline-flex items-center gap-2">
              Contact Support
            </Link>
          </div>

        </div>
      </div>
      </PageTransition>
    </>
  );
}
