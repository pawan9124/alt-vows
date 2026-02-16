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
import { PublishButton } from '@/components/PublishButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string; slug: string }>;
}

export default function DemoPage({ params }: Props) {
    const { id: siteId, slug } = React.use(params);

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
                    .eq('site_id', siteId)
                    .maybeSingle();

                if (error) {
                    console.error('[Demo] Supabase fetch error:', error.message);
                }

                if (!cancelled) {
                    if (data?.content) {
                        // Check ownership
                        const ownerMatch = !!user && data.owner_id === user.id;
                        setIsOwner(ownerMatch);
                        setSiteStatus(data.status || 'demo');

                        if (ownerMatch) {
                            // Owner: show their saved data
                            console.log('[Demo] Owner viewing their site:', siteId);
                            setTheme(data.content);
                        } else {
                            // Visitor: show default template data (not the owner's personalized data)
                            console.log('[Demo] Visitor viewing demo — showing default data');
                            const themeId = data.theme_id || 'vintage-vinyl';
                            const nicheSlug = data.content?.nicheSlug || data.content?.slug;
                            const staticConfig = niches.find((n) => n.slug === nicheSlug);
                            setTheme(mergeConfig(staticConfig || null));
                        }
                    } else {
                        // 2. No Supabase row → try niches.json fallback using the slug
                        const staticConfig = niches.find((n) => n.slug === slug);

                        if (staticConfig) {
                            console.log('[Demo] Using niches.json defaults for:', slug);
                            setTheme(mergeConfig(staticConfig));
                            setSiteStatus('demo');
                        } else {
                            // 3. Not found anywhere → 404
                            console.log('[Demo] Site not found:', siteId, slug);
                            setIs404(true);
                        }
                    }
                }
            } catch (err) {
                console.error('[Demo] Unexpected error during hydration:', err);
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
    }, [siteId, slug, setTheme, user]);

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
    // Show editor for logged-in owner (both demo and production)
    const showEditor = isOwner;

    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* Editor sidebar — only for site owners in demo mode */}
            {showEditor && <EditorSidebar siteStatus={siteStatus} />}

            {/* Demo Banner — different for owner vs visitor */}
            {isDemo && isOwner && (
                <div className="fixed top-0 left-0 right-0 z-[90] h-12 bg-gradient-to-r from-yellow-600/90 via-yellow-500/90 to-yellow-600/90 backdrop-blur-sm flex items-center justify-center gap-4 px-4 shadow-lg">
                    <p className="text-black text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                        ⚡ Demo Preview
                    </p>
                    <div className="w-fit">
                        <PublishButton slug={slug} />
                    </div>
                </div>
            )}

            {/* Visitor CTA — Sign up to customize */}
            {isDemo && !isOwner && (
                <div className="fixed top-4 right-4 z-[90]">
                    <Link
                        href="/auth"
                        className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xs rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all uppercase tracking-wider flex items-center gap-2"
                    >
                        <span>✨</span> Sign up to make this yours
                    </Link>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!isInviteOpen ? (
                    <motion.div key="gatekeeper-wrapper" className="absolute inset-0 z-20">
                        <Gatekeeper
                            config={{ ...currentConfig, ...pages.gatekeeper, weddingId: `${siteId}/${slug}` }}
                            onOpen={() => setIsInviteOpen(true)}
                        />
                    </motion.div>
                ) : (
                    <motion.div key="player-wrapper" className="absolute inset-0 z-30">
                        <Player
                            config={{ ...currentConfig, ...pages.player, weddingId: `${siteId}/${slug}` }}
                            onClose={() => setIsInviteOpen(false)}
                            isDemo={isDemo}
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
