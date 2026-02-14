'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

// Pages where we DON'T want the nav bar
const HIDDEN_NAV_PATHS = ['/demo/', '/s/'];

export const NavBar = () => {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    // Hide nav on demo pages (full-screen experience)
    if (HIDDEN_NAV_PATHS.some((p) => pathname.startsWith(p))) {
        return null;
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Left: Logo */}
                <Link
                    href="/"
                    className="text-white font-bold tracking-tight text-lg hover:text-yellow-400 transition-colors"
                >
                    Alt Vows
                </Link>

                {/* Right: Auth state */}
                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : user ? (
                        <>
                            <span className="text-white/30 text-xs hidden sm:inline">
                                {user.email}
                            </span>
                            <Link
                                href="/dashboard"
                                className="px-3.5 py-1.5 text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/auth"
                            className="px-4 py-1.5 text-xs font-bold text-black bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-all uppercase tracking-wide"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
