"use client";

import { Check, Zap } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Toffee",
    features: [
      "5 bundles per month",
      "Standard compression",
      "Local storage only",
      "6 AI platforms",
      "Basic analytics",
    ],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users who live in AI",
    features: [
      "Unlimited bundles",
      "Full compression profile",
      "Cloud sync across devices",
      "Secure sharing links",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    cta: "Start Pro Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For teams sharing AI context",
    features: [
      "Everything in Pro",
      "5 team members",
      "Shared bundle library",
      "Team analytics dashboard",
      "Admin controls",
      "SSO integration",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: "#",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-toffee-400 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-navy-400 max-w-2xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "bg-gradient-to-b from-toffee-500/10 to-accent-violet/5 border-2 border-toffee-500/30 shadow-xl shadow-toffee-500/10"
                  : "glass-card"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-toffee-500 to-accent-violet text-white text-xs font-semibold">
                    <Zap className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-navy-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-sm text-navy-400">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted
                          ? "bg-toffee-500/20"
                          : "bg-navy-800"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          plan.highlighted ? "text-toffee-400" : "text-navy-400"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-navy-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={`w-full text-center block py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
