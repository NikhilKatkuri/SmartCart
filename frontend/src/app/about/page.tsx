'use client';

import { Mail, Phone, MapPin, Zap, Users, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <section className="space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs text-muted">About</p>
          <h1 className="text-4xl md:text-5xl font-semibold">SmartCart is a calm, AI-native shopping layer.</h1>
          <p className="text-muted max-w-2xl">
            We focus on clarity: real product signal, instant comparisons, and AI insights that are grounded in product data.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Our mission</h2>
            <p className="text-muted leading-relaxed">
              SmartCart exists to make shopping intelligent, intuitive, and personal. We combine fast search,
              structured specs, and AI analysis to help you decide with confidence.
            </p>
          </div>
          <div className="glass-panel rounded-3xl p-8 space-y-3">
            <Target className="w-10 h-10" />
            <h3 className="text-xl font-semibold">Signal over noise</h3>
            <p className="text-muted">Every screen keeps the product and comparison context in focus.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Fast discovery',
              description: 'Virtualized feed, instant filters, and optimized media.',
            },
            {
              icon: Users,
              title: 'Human-centered',
              description: 'Minimalist layout that keeps decisions simple.',
            },
            {
              icon: Target,
              title: 'AI grounded',
              description: 'AI answers are sourced from specs, reviews, and product data.',
            },
          ].map((value, idx) => {
            const Icon = value.icon;
            return (
              <div key={idx} className="glass-panel rounded-3xl p-6 space-y-3">
                <Icon className="w-8 h-8" />
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="text-sm text-muted">{value.description}</p>
              </div>
            );
          })}
        </section>

        <section className="glass-panel rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold">Core features</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-muted">
            <div className="space-y-3">
              <p>Advanced filtering by category, price, and rating.</p>
              <p>Full-text search across thousands of products.</p>
              <p>Responsive design on every device.</p>
            </div>
            <div className="space-y-3">
              <p>Compare up to 3 products with highlighted differences.</p>
              <p>AI chat to answer product questions quickly.</p>
              <p>Wishlist and cart synced to your device.</p>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-6 space-y-3 text-center">
            <Mail className="w-8 h-8 mx-auto" />
            <h3 className="text-lg font-semibold">Email</h3>
            <Link href="mailto:support@smartcart.com" className="text-sm text-muted hover:text-black">
              support@smartcart.com
            </Link>
          </div>
          <div className="glass-panel rounded-3xl p-6 space-y-3 text-center">
            <Phone className="w-8 h-8 mx-auto" />
            <h3 className="text-lg font-semibold">Phone</h3>
            <Link href="tel:+1234567890" className="text-sm text-muted hover:text-black">
              +1 (234) 567-890
            </Link>
          </div>
          <div className="glass-panel rounded-3xl p-6 space-y-3 text-center">
            <MapPin className="w-8 h-8 mx-auto" />
            <h3 className="text-lg font-semibold">Studio</h3>
            <p className="text-sm text-muted">123 Commerce Street, Tech City</p>
          </div>
        </section>

        <section className="glass-panel rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Ready to explore?</h2>
          <p className="text-muted">Return to discovery and compare smarter.</p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 rounded-full bg-black text-white text-sm"
          >
            Start shopping
          </Link>
        </section>
      </div>
    </div>
  );
}
