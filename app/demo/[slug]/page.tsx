'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import niches from '@/data/niches.json';
import { LandingPage } from '@/components/themes/vintage-vinyl/LandingPage';
import { Gatekeeper } from '@/components/themes/vintage-vinyl/Gatekeeper';
import { Player } from '@/components/themes/vintage-vinyl/Player';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { useEditorStore } from '@/store/useEditorStore';
import { mergeConfig } from '@/components/themes/vintage-vinyl/config';

// Force dynamic rendering since we are using a simple JSON lookup
export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
    // Unwrap params using React.use()
    const { slug } = React.use(params);

    // 1. Find the static config based on URL
    const staticConfig = niches.find((n) => n.slug === slug);

    // 2. Hook into the Live Store
    const { activeTheme, setTheme } = useEditorStore();

    // 3. Local State for "Invite" -> "Player" transition
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // 4. Initialize Store on Mount
    useEffect(() => {
        if (staticConfig) {
            setTheme(mergeConfig(staticConfig));
        }
    }, [staticConfig, setTheme]);

    // 5. Safety Check
    if (!staticConfig) return notFound();

    // 6. DECISION: Render from Store (if ready) or Static (SSR fallback)
    const currentConfig = activeTheme || mergeConfig(staticConfig);

    // 7. Extract theme parts (Universal Helper)
    const theme = currentConfig.theme || {};
    const pages = theme.pages || currentConfig.pages || {}; // Handle both structures (Rock vs Jazz legacy)
    const hero = currentConfig.hero || {};

    return (
        <main className="relative min-h-screen bg-black overflow-hidden">
            {/* THE LIVE EDITOR SIDEBAR */}
            <EditorSidebar />

            {/* 
        NOTE: Landing Page is currently HIDDEN for the demo route per user request.
        The user wants the "Invite Link" experience (Gatekeeper -> Player).
        Uncomment this section if a full site demo is needed.
      */}
            {/* 
      <section className="min-h-screen relative z-10">
        <LandingPage config={{ ...currentConfig, ...hero, ...pages.invite }} />
      </section>
      */}

            {/* APP EXPERIENCE: Gatekeeper -> Player */}
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
        </main>
    );
}



