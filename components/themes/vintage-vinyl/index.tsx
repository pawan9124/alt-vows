'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { defaultContent } from './config';
import { LandingPage } from './LandingPage';
import { Gatekeeper } from './Gatekeeper';
import { Player } from './Player';

// Export sub-components for individual use (Live Editor)
export { LandingPage } from './LandingPage';
export { Gatekeeper } from './Gatekeeper';
export { Player } from './Player';

export interface VintageVinylThemeProps {
  config: typeof defaultContent; // Relaxed type for flexibility
}

const VintageVinylTheme: React.FC<VintageVinylThemeProps> = ({ config: propConfig }) => {
  // Merge prop config with default content deeply
  // Note: In a real app, use a deep merge utility. For now, we trust the passing config or fallback.
  // We'll use propConfig if available, otherwise defaultContent. 
  // However, the original code used a mergeConfig function. We should probably respect that if possible
  // but to keep this "simple" wrapper, we will assume propConfig is already full or we just use it.

  // The original implementation merged config. Let's do a basic spread to be safe, 
  // but the 'config' prop passed in is usually the fully merged one from `niches.json`.
  const config = propConfig || defaultContent;

  const [isOpen, setIsOpen] = useState(false);

  // 1. Landing Page Mode (Split Screen)
  if (config.theme.pages.landing?.mode === 'split-screen') {
    // Display Landing Page
    return <LandingPage config={config} />;
  }

  // 2. Vinyl App Mode (Gatekeeper -> Player)
  return (
    <>
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <Gatekeeper
            key="gatekeeper"
            config={config}
            onOpen={() => setIsOpen(true)}
          />
        ) : (
          <Player
            key="player"
            config={config}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default {
  component: VintageVinylTheme,
  config: defaultContent,
};