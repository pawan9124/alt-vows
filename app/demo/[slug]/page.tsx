'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import niches from '@/data/niches.json';
import { LandingPage } from '@/components/themes/vintage-vinyl/LandingPage';
import { Gatekeeper } from '@/components/themes/vintage-vinyl/Gatekeeper';
import { Player } from '@/components/themes/vintage-vinyl/Player';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { useEditorStore } from '@/store/useEditorStore';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
    const { slug } = React.use(params);

    const { activeTheme, setTheme } = useEditorStore();
    const { user } = useAuth();

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [is404, setIs404] = useState(false);
    const [siteStatus, setSiteStatus] = useState<string>('demo');
    const [isOwner, setIsOwner] = useState(false);

    // On mount: Supabase first → niches.json fallback → 404
    useEffect(() => {
        let cancelled = false;

        async function hydrate() {
            try {
                // 1. Try Supabase first (user-created sites + saved demos)
                const { data, error } = await supabase
                    .from('websites')
                    .select('content, theme_id, status, owner_id')
                    .eq('slug', slug)
                    .maybeSingle();

                if (error) {
                    console.error('[Demo] Supabase fetch error:', error.message);
                }

                if (!cancelled) {
                    if (data?.content) {
                        // Supabase row found → use saved content
                        console.log('[Demo] Loaded saved data from Supabase for:', slug);
                        setTheme(data.content);
                        setSiteStatus(data.status || 'demo');
                        setIsOwner(!!user && data.owner_id === user.id);
                    } else {
                        // 2. No Supabase row → try niches.json fallback
                        const staticConfig = niches.find((n) => n.slug === slug);

                        if (staticConfig) {
                            console.log('[Demo] Using niches.json defaults for:', slug);
                            setTheme(mergeConfig(staticConfig));
                            setSiteStatus('demo');
                        } else {
                            // 3. Not found anywhere → 404
                            console.log('[Demo] Slug not found anywhere:', slug);
                            setIs404(true);
                        }
                    }
                }
            } catch (err) {
                console.error('[Demo] Unexpected error during hydration:', err);
                // On error, try niches.json as last resort
                if (!cancelled) {
                    const staticConfig = niches.find((n) => n.slug === slug);
                    if (staticConfig) {
                        setTheme(mergeConfig(staticConfig));
                    } else {
                        setIs404(true);
                    }
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        hydrate();
        return () => { cancelled = true; };
    }, [slug, setTheme, user]);

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

    // Render from store
    const currentConfig = activeTheme || mergeConfig(null);

    const theme = currentConfig.theme || {};
    const pages = theme.pages || currentConfig.pages || {};

    const isDemo = siteStatus !== 'production';
    const showEditor = isOwner || isDemo; // Show editor for owners and demo mode

    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* Editor sidebar — only for site owners */}
            {showEditor && <EditorSidebar />}

            {/* Demo Watermark Banner */}
            {isDemo && (
                <div className="fixed top-0 left-0 right-0 z-[90] bg-gradient-to-r from-yellow-600/90 via-yellow-500/90 to-yellow-600/90 backdrop-blur-sm text-center py-2 px-4">
                    <p className="text-black text-xs font-bold uppercase tracking-wider">
                        ⚡ This is a demo preview —{' '}
                        <span className="underline underline-offset-2">
                            Publish to go live
                        </span>
                    </p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!isInviteOpen ? (
                    <motion.div key="gatekeeper-wrapper" className="absolute inset-0 z-20">
                        <Gatekeeper
                            config={{ ...currentConfig, ...pages.gatekeeper }}
                            onOpen={() => setIsInviteOpen(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div key="player-wrapper" className="absolute inset-0 z-30">
                        <Player
                            config={{ ...currentConfig, ...pages.player }}
                            onClose={() => setIsInviteOpen(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Powered by Alt-Vows footer — viral loop */}
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
