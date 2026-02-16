'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Pages where we DON'T want the nav bar
const HIDDEN_NAV_PATHS = ['/demo/', '/s/'];

// Sections to link on the landing page
const NAV_LINKS = [
    { label: 'Themes', href: '#themes' },
    { label: 'Pricing', href: '#pricing' },
];

export const NavBar = () => {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Track scroll for glassmorphism effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Hide nav on demo/production pages (full-screen experience)
    if (HIDDEN_NAV_PATHS.some((p) => pathname.startsWith(p))) {
        return null;
    }

    const isLandingPage = pathname === '/';

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'glass border-b border-[var(--border-subtle)]'
                    : 'bg-transparent'
                    }`}
            >
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Left: Logo */}
                    <Link
                        href="/"
                        className="font-[var(--font-playfair)] text-[var(--gold)] font-bold text-xl tracking-tight hover:text-[var(--gold-hover)] transition-colors"
                        style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                        Alt Vows
                    </Link>

                    {/* Center: Nav Links (desktop only, landing page only) */}
                    {isLandingPage && (
                        <div className="hidden md:flex items-center gap-8">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link
                                href="/redeem"
                                className="text-[var(--gold)] text-sm font-medium hover:text-[var(--gold-hover)] transition-colors tracking-wide"
                            >
                                Redeem Code
                            </Link>
                        </div>
                    )}

                    {/* Right: Auth + CTA (desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-[var(--border-subtle)] border-t-[var(--gold)] rounded-full animate-spin" />
                        ) : user ? (
                            <>
                                <span className="text-[var(--text-tertiary)] text-xs hidden lg:inline">
                                    {user.email}
                                </span>
                                <Link
                                    href="/dashboard"
                                    className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] rounded-xl transition-all border border-[var(--border-subtle)]"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth"
                                    className="px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth"
                                    className="px-5 py-2 text-xs font-bold text-[var(--bg-deep)] bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl transition-all uppercase tracking-wide"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile: Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
                        aria-label="Toggle menu"
                    >
                        <motion.span
                            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-[2px] bg-[var(--text-primary)] block origin-center"
                        />
                        <motion.span
                            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-5 h-[2px] bg-[var(--text-primary)] block"
                        />
                        <motion.span
                            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className="w-5 h-[2px] bg-[var(--text-primary)] block origin-center"
                        />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-0 z-40 bg-[var(--bg-deep)] pt-20"
                    >
                        <div className="flex flex-col items-center gap-6 px-8 py-8">
                            {isLandingPage && (
                                <>
                                    {NAV_LINKS.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="text-[var(--text-primary)] text-lg font-medium"
                                        >
                                            {link.label}
                                        </a>
                                    ))}
                                    {/* Mobile Redeem Link */}
                                    <Link
                                        href="/redeem"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-[var(--gold)] text-lg font-medium"
                                    >
                                        Redeem Code
                                    </Link>
                                </>
                            )}
                            <div className="w-12 h-px bg-[var(--border-subtle)]" />
                            {loading ? null : user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setMobileOpen(false)}
                                    className="text-[var(--text-primary)] text-lg font-medium"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-[var(--text-primary)] text-lg font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth"
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full max-w-xs text-center px-6 py-3 text-sm font-bold text-[var(--bg-deep)] bg-[var(--gold)] hover:bg-[var(--gold-hover)] rounded-xl transition-all uppercase tracking-wide"
                                    >
                                        Get Started Free
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
