'use client';

import React, { useEffect, useState } from 'react';
import { notFound, redirect } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEditorStore } from '@/store/useEditorStore';
import { supabase } from '@/lib/supabase';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';
import { Gatekeeper } from '@/components/themes/vintage-vinyl/Gatekeeper';
import { Player } from '@/components/themes/vintage-vinyl/Player';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export default function ProductionSitePage({ params }: Props) {
    const { slug } = React.use(params);
    const { activeTheme, setTheme } = useEditorStore();

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [is404, setIs404] = useState(false);
    const [shouldRedirectDemo, setShouldRedirectDemo] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function hydrate() {
            try {
                const { data, error } = await supabase
                    .from('websites')
                    .select('content, theme_id, status')
                    .eq('slug', slug)
                    .maybeSingle();

                if (error) {
                    console.error('[Site] Supabase fetch error:', error.message);
                }

                if (!cancelled) {
                    if (data?.content) {
                        if (data.status !== 'production') {
                            // Not published yet — redirect to demo
                            setShouldRedirectDemo(true);
                        } else {
                            setTheme(data.content);
                        }
                    } else {
                        setIs404(true);
                    }
                }
            } catch (err) {
                console.error('[Site] Unexpected error:', err);
                if (!cancelled) setIs404(true);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        hydrate();
        return () => { cancelled = true; };
    }, [slug, setTheme]);

    // Redirect demo sites
    if (shouldRedirectDemo) {
        redirect(`/demo/${slug}`);
    }

    // 404 state
    if (is404) return notFound();

    // Loading state
    if (isLoading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-white/40 text-sm tracking-wider uppercase">Loading…</p>
                </div>
            </main>
        );
    }

    const currentConfig = activeTheme || mergeConfig(null);
    const theme = currentConfig.theme || {};
    const pages = theme.pages || currentConfig.pages || {};

    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* NO editor, NO watermark — this is a production site */}

            <AnimatePresence mode="wait">
                {!isInviteOpen ? (
                    <motion.div key="gatekeeper-wrapper" className="absolute inset-0 z-20">
                        <Gatekeeper
                            config={{ ...currentConfig, ...pages.gatekeeper, weddingId: slug }}
                            onOpen={() => setIsInviteOpen(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div key="player-wrapper" className="absolute inset-0 z-30">
                        <Player
                            config={{ ...currentConfig, ...pages.player, weddingId: slug }}
                            onClose={() => setIsInviteOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Powered by Alt-Vows footer */}
            <div className="fixed bottom-0 left-0 right-0 z-[80] text-center py-2.5 bg-black/40 backdrop-blur-sm border-t border-white/5">
                <Link
                    href="/"
                    target="_blank"
                    className="text-white/25 hover:text-white/50 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors"
                >
                    Made with Alt-Vows ⚡
                </Link>
            </div>
        </main>
    );
}
