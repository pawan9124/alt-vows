'use client';

import React, { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import niches from '@/data/niches.json';
import { Gatekeeper } from '@/components/themes/vintage-vinyl/Gatekeeper';
import { Player } from '@/components/themes/vintage-vinyl/Player';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';

/**
 * Theme Preview Page — read-only version of the demo
 * Shows Gatekeeper → Player without the editor sidebar.
 * Used for prospective buyers to see what they're about to purchase.
 */
export default function ThemePreviewPage() {
    const params = useParams<{ slug: string }>();
    const slug = params.slug;

    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Build config from niches.json
    const niche = useMemo(() => niches.find((n) => n.slug === slug), [slug]);

    if (!niche) return notFound();

    const config = mergeConfig(niche);
    const theme = config.theme || {};
    const pages = (theme as any).pages || {};

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            {/* Preview Banner — separate header, NOT overlaid */}
            <div className="flex-shrink-0 bg-gradient-to-r from-purple-600/90 via-indigo-500/90 to-purple-600/90 backdrop-blur-sm text-center py-2.5 px-4 flex items-center justify-center gap-3 z-[90]">
                <p className="text-white text-xs font-bold uppercase tracking-wider">
                    👁️ Preview Mode — This is how your site will look
                </p>
                <Link
                    href="/redeem"
                    className="px-4 py-1 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] rounded-full transition-all uppercase tracking-wider border border-white/20"
                >
                    Get This Theme — $49
                </Link>
            </div>

            {/* Theme content — fills remaining height */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {!isInviteOpen ? (
                        <motion.div key="gatekeeper-wrapper" className="absolute inset-0 z-20">
                            <Gatekeeper
                                config={{ ...config, ...pages.gatekeeper, weddingId: `preview/${slug}`, isEditorOpen: true }}
                                onOpen={() => setIsInviteOpen(true)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="player-wrapper" className="absolute inset-0 z-30">
                            <Player
                                config={{ ...config, ...pages.player, weddingId: `preview/${slug}`, isEditorOpen: true }}
                                onClose={() => setIsInviteOpen(false)}
                                isDemo={true}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Powered by Alt-Vows footer */}
                <div className="absolute bottom-0 left-0 right-0 z-[80] text-center py-2.5 bg-black/40 backdrop-blur-sm border-t border-white/5">
                    <Link
                        href="/"
                        target="_blank"
                        className="text-white/25 hover:text-white/50 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors"
                    >
                        Made with Alt-Vows ⚡
                    </Link>
                </div>
            </div>
        </div>
    );
}
