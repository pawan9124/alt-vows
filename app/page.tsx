'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

/* ─── Data ─── */

const THEMES = [
  {
    name: 'Rock & Roll',
    slug: 'rock-n-roll-wedding',
    tagline: 'Leather, neon & power chords',
    gradient: 'from-red-900/60 via-red-800/30 to-black',
    accentColor: '#e02e2e',
    image: '/themes/theme-rock.jpeg',
    features: ['♪ Music', '✦ Animations', '📱 Mobile'],
  },
  {
    name: 'Jazz Lounge',
    slug: 'jazz-lounge-wedding',
    tagline: 'Gold, velvet & smooth sax',
    gradient: 'from-amber-900/60 via-yellow-900/30 to-black',
    accentColor: '#d4af37',
    image: '/themes/theme-jazz.jpeg',
    features: ['♪ Music', '✦ Animations', '📱 Mobile'],
  },
  {
    name: 'Cyberpunk',
    slug: 'cyberpunk-wedding',
    tagline: 'Neon lights & digital love',
    gradient: 'from-cyan-900/60 via-blue-900/30 to-black',
    accentColor: '#00f0ff',
    image: '/themes/theme-cyber.jpeg',
    features: ['♪ Music', '✦ Animations', '📱 Mobile'],
  },
];

const FEATURES = [
  'All themes included',
  'Unlimited edits',
  'RSVP management',
  'Guest messaging',
  'Music & animations',
  'Mobile-optimized',
  'No ads. Ever.',
  'Live for 1 year',
];

const FAQ_ITEMS = [
  {
    q: 'Can my guests see the site without signing up?',
    a: 'Yes! Guests just tap the link — no accounts, no apps, no friction. It works instantly on any phone or browser.',
  },
  {
    q: "I'm not tech-savvy. Is this hard?",
    a: "If you can type your name and pick a photo, you can do this. Our live editor handles the rest. Most couples finish in under 5 minutes.",
  },
  {
    q: 'Do you show ads on my wedding page?',
    a: "Never. Not now, not ever. Your wedding is sacred, not ad space. We make money from the one-time fee, not from your guests' data.",
  },
  {
    q: 'Can I change things after I publish?',
    a: "Absolutely. Unlimited edits, even after publishing. Change photos, update details, swap themes — it's your site.",
  },
];

const TESTIMONIALS = [
  {
    quote: 'This was hands down the coolest wedding invite I\'ve ever received. Every guest was talking about it.',
    name: 'Sarah M.',
    role: 'Wedding Guest',
  },
  {
    quote: 'We wanted something that felt like US, not a cookie-cutter template. Alt Vows nailed it.',
    name: 'Raj & Priya',
    role: 'Couple',
  },
  {
    quote: 'The music, the animations, the reveal — my guests thought we hired a designer. It took 10 minutes.',
    name: 'Alex T.',
    role: 'Groom',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Pick Your Vibe',
    desc: 'Choose from stunning animated themes. Gothic? Cyberpunk? Vintage vinyl? You do you.',
    icon: '🎨',
  },
  {
    num: '02',
    title: 'Edit Your Story',
    desc: 'Add your names, photos, love story, and event details. Our live editor makes it effortless.',
    icon: '✏️',
  },
  {
    num: '03',
    title: 'Share the Link',
    desc: 'Send via WhatsApp. 150 guests get an experience, not just an invite.',
    icon: '🔗',
  },
];

const COMPARISON = {
  them: [
    'Static pages',
    'Same template as 10,000 other couples',
    'Ads on YOUR wedding page',
    'Your data sold to vendors',
    'Boring RSVP form',
  ],
  us: [
    'Animated & interactive',
    'Music & sound effects',
    'Unique themes nobody else has',
    'Zero ads. Zero tracking',
    '"Holy shit" RSVP rituals',
  ],
};

const FEATURE_SHOWCASE = [
  {
    title: 'The Reveal',
    desc: 'Your guests don\'t just see an invite. They OPEN one. A tap-to-reveal moment that makes your invite unforgettable before they read a single word.',
    icon: '🔮',
  },
  {
    title: 'Your Wedding Has a Soundtrack',
    desc: 'Background music transforms a website into an experience. Choose from curated ambient tracks that match your theme. Your guests won\'t just see your invite — they\'ll HEAR it.',
    icon: '🎵',
  },
  {
    title: 'Tell Your Story',
    desc: 'Not a timeline with dots. A scroll-driven love story with chapter titles, your photos, and page-turn animations. Because your story deserves more than bullet points.',
    icon: '📖',
  },
  {
    title: 'RSVP as a Ritual',
    desc: 'Forget Google Forms. Your guests seal their acceptance with a gold stamp, pick their party size, and send you a personal message. Then confetti.',
    icon: '✨',
  },
  {
    title: 'Built for Phones',
    desc: '85% of your guests will open this on their phone via WhatsApp. Every animation, every interaction, every pixel is designed for the screen in their hand.',
    icon: '📱',
  },
];

/* ─── Reusable Animated Section ─── */

function Section({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── FAQ Accordion Item ─── */

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-[var(--border-subtle)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[var(--text-primary)] font-medium text-sm sm:text-base pr-4">
          {q}
        </span>
        <span
          className={`text-[var(--gold)] text-xl flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''
            }`}
        >
          +
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed pb-5">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Phone Mockup ─── */

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px] md:w-[300px]">
      {/* Gold glow behind phone */}
      <div className="absolute inset-0 -inset-x-8 -inset-y-8 bg-[var(--gold)] opacity-[0.07] blur-[60px] rounded-full" />

      {/* Phone frame */}
      <div className="relative bg-[#1a1a1a] rounded-[40px] p-3 shadow-2xl border border-white/10">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="rounded-[28px] overflow-hidden bg-black aspect-[9/16] relative">
          {/* Animated gradient background mimicking a wedding site */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/80 via-black to-black" />

          {/* Mock content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
            {/* Decorative ring */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1, type: 'spring' }}
              className="w-16 h-16 rounded-full border-2 border-[var(--gold)]/40 flex items-center justify-center mb-6"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-[var(--gold-muted)] text-[10px] uppercase tracking-[0.3em] mb-3"
            >
              You&apos;re Invited
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-[var(--text-primary)] text-lg font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Raj & Priya
            </motion.h3>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="w-12 h-px bg-[var(--gold)] my-3"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-[var(--text-tertiary)] text-[11px] tracking-wider"
            >
              DECEMBER 14, 2026
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="mt-8 px-6 py-2 border border-[var(--gold)]/40 rounded-full"
            >
              <span className="text-[var(--gold)] text-[10px] uppercase tracking-[0.2em]">
                Open Invite
              </span>
            </motion.div>
          </div>

          {/* Subtle floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[var(--gold)] rounded-full opacity-20"
              initial={{
                x: 30 + i * 50,
                y: 300 + i * 30,
              }}
              animate={{
                y: [300 + i * 30, 50 + i * 20, 300 + i * 30],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Gold Particle Background ─── */

function GoldParticles({ count = 8 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[var(--gold)] rounded-full"
          style={{
            left: `${10 + (i * 80) / count}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -400 - i * 50],
            opacity: [0, 0.25, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 1.5,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════ */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg-deep)] overflow-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 md:pb-24">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--gold)] opacity-[0.04] rounded-full blur-[100px]" />
        </div>

        <GoldParticles count={6} />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Copy */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-full"
            >
              <span className="text-[var(--gold)] text-xs">◉</span>
              <span
                className="text-[var(--text-tertiary)] text-[11px] font-semibold tracking-[0.15em] uppercase"
                style={{ fontFamily: 'var(--font-jetbrains)' }}
              >
                Wedding Invites, Remixed
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold leading-[1.1] mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              <span className="text-[var(--text-primary)]">Not Your Grandma&apos;s </span>
              <span className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] bg-clip-text text-transparent">
                Wedding Website
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-[var(--text-secondary)] text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-4 leading-relaxed"
            >
              Animated. Interactive. Unforgettable.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-[var(--text-tertiary)] text-sm mb-8"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              One-time $49 · No subscriptions · No ads
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link
                href="/themes/rock-n-roll-wedding"
                className="px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-active)] rounded-xl transition-all tracking-wide"
              >
                See It In Action →
              </Link>
              <Link
                href="/auth"
                className="px-7 py-3.5 text-sm font-bold text-[var(--bg-deep)] bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl transition-all uppercase tracking-wide"
              >
                Get Started Free
              </Link>
            </motion.div>
          </div>

          {/* Right: Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, type: 'spring', damping: 20 }}
            className="flex-shrink-0"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        >
          <span className="text-[var(--text-tertiary)] text-[10px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-jetbrains)' }}>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-[var(--border-subtle)] flex items-start justify-center p-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-[var(--gold)]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <Section className="py-16 md:py-20 px-4 border-y border-[var(--border-subtle)]/50">
        <div className="max-w-[1200px] mx-auto">
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6"
              >
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                    <span className="text-[var(--gold)] text-xs font-bold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] text-sm font-medium">{t.name}</p>
                    <p className="text-[var(--text-tertiary)] text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔥</span>
              <span className="text-[var(--text-secondary)] text-sm">
                <strong className="text-[var(--text-primary)]">237</strong> couples have created sites
              </span>
            </div>
            <span className="text-[var(--border-subtle)]">·</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className="text-[var(--text-secondary)] text-sm">
                <strong className="text-[var(--text-primary)]">4.9</strong>/5 rating
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── THEME SHOWCASE ─── */}
      <Section id="themes" className="py-24 md:py-32 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <p
              className="text-[var(--gold-muted)] text-xs font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              ✦ Choose Your Vibe ✦
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Themes That Slap
            </h2>
            <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto">
              Every theme is animated, interactive, and mobile-perfect. Pick one — or preview them all.
            </p>
          </div>

          {/* Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THEMES.map((theme, i) => (
              <motion.div
                key={theme.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  href={`/themes/${theme.slug}`}
                  className="group block bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden hover:border-[var(--gold)]/50 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    boxShadow: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${theme.accentColor}15, 0 8px 32px rgba(0,0,0,0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Preview area */}
                  <div
                    className={`h-48 sm:h-56 relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}
                  >
                    {/* Actual theme screenshot */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={theme.image}
                      alt={`${theme.name} theme preview`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Theme accent glow */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
                      style={{ background: theme.accentColor }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-1">
                      {theme.name}
                    </h3>
                    <p className="text-[var(--text-tertiary)] text-sm mb-4">
                      {theme.tagline}
                    </p>

                    {/* Feature pills */}
                    <div className="flex gap-2 mb-4">
                      {theme.features.map((f) => (
                        <span
                          key={f}
                          className="text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-elevated)] px-2 py-1 rounded-md"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>

                    <span className="text-[var(--gold-muted)] text-xs font-semibold uppercase tracking-wider group-hover:text-[var(--gold)] transition-colors">
                      View Demo →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[var(--text-tertiary)] text-sm mt-8">
            + More themes coming soon
          </p>
        </div>
      </Section>

      {/* ─── HOW IT WORKS ─── */}
      <Section id="how-it-works" className="py-24 md:py-32 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              How It Works
            </h2>
            <p className="text-[var(--text-secondary)] text-base">
              3 minutes. Seriously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center md:text-left"
              >
                {/* Step number */}
                <span
                  className="text-[var(--gold)] text-xs font-bold tracking-wider mb-4 block"
                  style={{ fontFamily: 'var(--font-jetbrains)' }}
                >
                  STEP {step.num}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 mx-auto md:mx-0">
                  <span className="text-2xl">{step.icon}</span>
                </div>

                <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {step.desc}
                </p>

                {/* Connector line (desktop, between columns) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-4 w-8 h-px bg-[var(--border-subtle)]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── COMPARISON ─── */}
      <Section className="py-24 md:py-32 px-4">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Free Sites vs. <span className="text-[var(--gold)]">This.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              There&apos;s &ldquo;good enough&rdquo; and there&apos;s unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* THEM */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 opacity-70"
            >
              <h3 className="text-[var(--text-tertiary)] font-semibold text-lg mb-6">Free Sites</h3>
              <div className="space-y-4">
                {COMPARISON.them.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-red-400/60 text-sm mt-0.5">✕</span>
                    <span className="text-[var(--text-tertiary)] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-[var(--text-tertiary)] text-sm">
                  Free <span className="text-[var(--text-tertiary)] text-xs">(your guests see ads)</span>
                </p>
              </div>
            </motion.div>

            {/* US */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--bg-surface)] border border-[var(--gold)]/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
            >
              {/* Gold subtle glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold)] opacity-[0.04] blur-[40px] rounded-full" />

              <h3 className="text-[var(--gold)] font-semibold text-lg mb-6">Alt Vows</h3>
              <div className="space-y-4 relative z-10">
                {COMPARISON.us.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-[var(--gold)] text-sm mt-0.5">✦</span>
                    <span className="text-[var(--text-primary)] text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-4 border-t border-[var(--gold)]/10 relative z-10">
                <p className="text-[var(--text-primary)] text-sm font-semibold">
                  $49 once. <span className="text-[var(--text-secondary)] text-xs font-normal">Keep it forever.</span>
                </p>
              </div>
            </motion.div>
          </div>

          <p className="text-center text-[var(--text-tertiary)] text-sm mt-8 italic">
            That&apos;s less than one centerpiece flower.
          </p>
        </div>
      </Section>

      {/* ─── FEATURE SHOWCASE ─── */}
      <Section id="features" className="py-24 md:py-32 px-4">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-[var(--gold-muted)] text-xs font-semibold tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-jetbrains)' }}
            >
              What&apos;s Inside
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Not Just Pretty. Powerful.
            </h2>
          </div>

          <div className="space-y-20">
            {FEATURE_SHOWCASE.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                {/* Icon block */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center">
                    <span className="text-4xl">{feature.icon}</span>
                  </div>
                </div>

                {/* Text */}
                <div className={`text-center ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                  <h3 className="text-[var(--text-primary)] font-bold text-xl sm:text-2xl mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-lg">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── PRICING ─── */}
      <Section id="pricing" className="py-24 md:py-32 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              One Price. No Games.
            </h2>
            <p className="text-[var(--text-secondary)] text-base max-w-md mx-auto">
              Create your site free. Pay only when you&apos;re ready to publish.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 -inset-x-4 -inset-y-4 bg-[var(--gold)] opacity-[0.06] blur-[40px] rounded-3xl" />

            <div className="relative bg-[var(--bg-surface)] border border-[var(--gold)]/20 rounded-2xl p-8 sm:p-10">
              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    className="text-6xl sm:text-7xl font-bold text-[var(--gold)]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    $49
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm mt-2">
                  one-time payment
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <span className="text-[var(--gold)] text-sm">✦</span>
                    <span className="text-[var(--text-primary)] text-sm">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/auth"
                className="block w-full text-center px-6 py-4 text-sm font-bold text-[var(--bg-deep)] bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl transition-all uppercase tracking-wide"
              >
                Get Started Free →
              </Link>

              <p className="text-center text-[var(--text-tertiary)] text-xs mt-4">
                Create your site free. Pay when you publish.
              </p>
            </div>
          </div>

          {/* Price reframe */}
          <p className="text-center text-[var(--text-tertiary)] text-sm mt-8 italic">
            That&apos;s $0.33 per guest for a 150-person wedding. Less than a stamp.
          </p>
        </div>
      </Section>

      {/* ─── FAQ ─── */}
      <Section className="py-24 md:py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] text-center mb-12"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Quick Answers
          </h2>
          <div>
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative py-24 md:py-32 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--gold)] opacity-[0.05] rounded-full blur-[80px]" />
        </div>

        <GoldParticles count={5} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Your Wedding Deserves Better{' '}
            <span className="text-[var(--gold)]">Than a Template.</span>
          </h2>

          <Link
            href="/auth"
            className="inline-block px-8 py-4 text-sm font-bold text-[var(--bg-deep)] bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl transition-all uppercase tracking-wide mb-4"
          >
            Create Your Site →
          </Link>

          <p className="text-[var(--text-tertiary)] text-sm">
            Free to start. 3 minutes to &ldquo;wow.&rdquo;
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--border-subtle)] py-16 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1">
              <h3
                className="text-[var(--gold)] font-bold text-lg mb-2"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Alt Vows
              </h3>
              <p className="text-[var(--text-tertiary)] text-sm">
                Wedding sites that slap.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-4">
                Product
              </h4>
              <div className="space-y-2">
                <a href="#themes" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Themes
                </a>
                <a href="#pricing" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Pricing
                </a>
                <Link href="/themes/rock-n-roll-wedding" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Live Demo
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-4">
                Themes
              </h4>
              <div className="space-y-2">
                {THEMES.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/themes/${t.slug}`}
                    className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider mb-4">
                Account
              </h4>
              <div className="space-y-2">
                <Link href="/auth" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Sign In
                </Link>
                <Link href="/auth" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Create Account
                </Link>
                <Link href="/redeem" className="block text-[var(--text-tertiary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                  Redeem Code
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[var(--border-subtle)] pt-8 text-center">
            <p className="text-[var(--text-tertiary)] text-xs">
              © {new Date().getFullYear()} Alt Vows. Made with 🖤 for couples who break the mold.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}