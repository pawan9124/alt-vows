'use client';

import React from 'react';
import Link from 'next/link';
import { GlobalStyles, VinylRecord, ToneArm } from './shared';

interface LandingPageProps {
    config: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ config }) => {
    const content = config; // Alias for easier access, matching original code structure
    const bgValue = config.theme.pages.landing.backgroundValue;
    const isImage = bgValue.startsWith('/') || bgValue.startsWith('http');

    return (
        <div
            className="w-full h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden relative"
            style={{
                backgroundColor: isImage ? '#000000' : bgValue,
                ...(isImage && {
                    backgroundImage: `url('${bgValue}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'soft-light'
                })
            }}
        >
            <GlobalStyles />
            {/* LEFT COLUMN: Marketing Copy - ensure high z-index */}
            <div className="flex flex-col justify-center p-12 z-50 relative text-white h-full bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none">
                <h1
                    className="text-6xl md:text-8xl font-bold mb-6 leading-none drop-shadow-lg"
                    style={{ fontFamily: config.theme.global.typography.headingFont || 'inherit' }}
                >
                    {content.hero.title}
                </h1>
                <p className="text-2xl opacity-90 mb-8 font-serif drop-shadow-md">{content.hero.date} • {content.hero.location}</p>

                {/* BUTTON WITH LINK - ensure clickable */}
                <Link
                    href={`/demo/${config.slug}`}
                    className="inline-block w-fit z-50 relative"
                >
                    <button
                        className="px-8 py-4 text-black text-xl font-bold rounded-full hover:scale-105 transition-transform uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                        style={{ backgroundColor: config.theme.global.palette.primary || '#ffffff' }}
                    >
                        Get This Theme
                    </button>
                </Link>
            </div>

            {/* RIGHT COLUMN: The Record - add pointer-events-none so it doesn't block clicks */}
            <div className="relative flex items-center justify-center z-10 scale-125 md:scale-150 translate-x-10 md:translate-x-0 opacity-90 md:opacity-100 pointer-events-none">
                <div className="relative w-[30rem] h-[30rem]">
                    <VinylRecord
                        label={content.hero.title}
                        subLabel={content.hero.date}
                        isPlaying={true}
                        className="w-full h-full"
                        texture={config.theme.global.assets.recordTexture}
                    />
                    <ToneArm isPlaying={true} className="absolute -top-10 -right-10 w-48 h-96 pointer-events-none drop-shadow-2xl" />
                </div>
            </div>
        </div>
    );
};
