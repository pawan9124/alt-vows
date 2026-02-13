'use client';

import React from 'react';
import Link from 'next/link';

const THEME_PREVIEWS = [
  {
    name: 'Rock & Roll',
    slug: 'rock-n-roll-wedding',
    emoji: '🤘',
    color: '#e02e2e',
    tagline: 'Leather, neon & power chords',
  },
  {
    name: 'Jazz Lounge',
    slug: 'jazz-lounge-wedding',
    emoji: '🎷',
    color: '#d4af37',
    tagline: 'Gold, velvet & smooth sax',
  },
  {
    name: 'Cyberpunk',
    slug: 'cyberpunk-wedding',
    emoji: '⚡',
    color: '#00f0ff',
    tagline: 'Neon lights & digital love',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-white/5 border border-white/10 rounded-full">
            <span className="text-sm">💿</span>
            <span className="text-white/50 text-xs font-medium tracking-wide uppercase">
              Wedding invites, remixed
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Not Your Grandma's{' '}
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Wedding Website
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Animated, interactive wedding sites for couples who break the mold.
            Choose your vibe. Drop the invite.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/demo/rock-n-roll-wedding"
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm rounded-lg transition-all border border-white/10 hover:border-white/20 uppercase tracking-wide"
            >
              See Demo →
            </Link>
            <Link
              href="/auth"
              className="px-8 py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded-lg transition-all uppercase tracking-wide"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Preview Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <h2 className="text-center text-xs uppercase tracking-[0.2em] text-white/30 font-semibold mb-10">
          Choose Your Vibe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {THEME_PREVIEWS.map((theme) => (
            <Link
              key={theme.slug}
              href={`/demo/${theme.slug}`}
              className="group relative bg-[#111] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Color Banner */}
              <div
                className="h-40 relative overflow-hidden"
                style={{
                  background: `linear-gradient(160deg, ${theme.color}30, ${theme.color}08)`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 80%, ${theme.color}, transparent 60%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {theme.emoji}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold text-lg mb-1">
                  {theme.name}
                </h3>
                <p className="text-white/30 text-sm">{theme.tagline}</p>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-yellow-500/60 group-hover:text-yellow-500 transition-colors">
                  View Demo →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <p className="text-center text-white/20 text-xs">
          Alt Vows — Wedding sites that slap. © {new Date().getFullYear()}
        </p>
      </footer>
    </main>
  );
}