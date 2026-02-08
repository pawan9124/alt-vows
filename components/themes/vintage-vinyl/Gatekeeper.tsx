'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlobalStyles, FloatingParticles, VinylRecord, NOISE_SVG, GoldGradientDef } from './shared';

interface GatekeeperProps {
    config: any; // Using 'any' for speed as per original file usage, but ideally typed
    onOpen?: () => void;
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ config, onOpen }) => {
    const content = config; // Alias

    // Handle open action if provided
    const handleOpen = () => {
        if (onOpen) onOpen();
    };

    return (
        <motion.div
            key="gatekeeper"
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            style={{
                // Layer 1: The Wall (Background)
                backgroundColor: config.theme.pages.gatekeeper.backgroundColor || '#1a1a1a',
                ...(config.theme.pages.gatekeeper.backgroundTexture && {
                    backgroundImage: `url('${config.theme.pages.gatekeeper.backgroundTexture}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                })
            }}
        >
            <GlobalStyles />
            {/* SVG Definitions */}
            <svg width="0" height="0"><GoldGradientDef /></svg>

            {/* --- Layer 3: Corner Decorations (The Jewelry) --- */}


            {/* Atmospheric Particles */}
            <FloatingParticles />

            {/* === Z-INDEX 10: VINYL BACKDROP (The Halo) === */}
            {config.theme.pages.gatekeeper.showVinylBackdrop && (
                <motion.div
                    className="absolute z-10 w-[95vw] max-w-[550px] aspect-square"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 360
                    }}
                    transition={{
                        opacity: { duration: 1, delay: 0.3 },
                        scale: { duration: 1, delay: 0.3 },
                        rotate: { duration: 100, repeat: Infinity, ease: "linear" }
                    }}
                    style={{
                        // Neon glow ring effect
                        filter: config.theme.pages.gatekeeper.neonColor
                            ? `drop-shadow(0 0 30px ${config.theme.pages.gatekeeper.neonColor}) drop-shadow(0 0 60px ${config.theme.pages.gatekeeper.neonColor}80)`
                            : 'none'
                    }}
                >
                    <VinylRecord
                        label=""
                        subLabel=""
                        className="w-full h-full opacity-90"
                        texture={config.theme.global.assets.recordTexture}
                    />
                    {/* Sheen Overlay - Makes the spin visible */}
                    <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: 'conic-gradient(from 90deg, transparent 0%, rgba(255,255,255,0.08) 15%, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 65%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                            mixBlendMode: 'overlay'
                        }}
                    />
                </motion.div>
            )}

            {/* === Z-INDEX 20: THE INVITE CARD === */}
            <motion.div
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={{
                    initial: { opacity: 0, scale: 0.95, y: 20 },
                    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: "easeOut", delay: 0.5 } },
                    hover: { scale: 1.02, transition: { duration: 0.3 } }
                }}
                className="relative z-20 w-[85vw] max-w-[450px] aspect-[4/5] md:aspect-square cursor-pointer"
                onClick={handleOpen}
            >
                {/* === CORNER DECORATIONS (Z-30, overhanging the card) === */}
                {config.theme.pages.gatekeeper.cornerShape && (
                    <>
                        {[0, 90, 180, 270].map((rotation, i) => {
                            const { path, viewBox, size, color } = config.theme.pages.gatekeeper.cornerShape!;
                            const positionStyle = i === 0 ? { top: '-8px', left: '-8px' } :
                                i === 1 ? { top: '-8px', right: '-8px' } :
                                    i === 2 ? { bottom: '-8px', right: '-8px' } :
                                        { bottom: '-8px', left: '-8px' };

                            return (
                                <div
                                    key={i}
                                    className="absolute z-30 pointer-events-none"
                                    style={{
                                        ...positionStyle,
                                        width: size || '60px',
                                        height: size || '60px',
                                        transform: `rotate(${rotation}deg)`
                                    }}
                                >
                                    <svg
                                        viewBox={viewBox}
                                        className="w-full h-full drop-shadow-lg"
                                        style={{
                                            fill: color || config.theme.global.palette.primary,
                                            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.8))'
                                        }}
                                    >
                                        <path d={path} />
                                    </svg>
                                </div>
                            );
                        })}
                    </>
                )}
                {/* The Front Card (Visuals) */}
                <div
                    className="relative z-20 w-full h-full p-8 md:p-12 flex flex-col items-center justify-center text-center"
                    style={{
                        // Layer 2: Card texture or color
                        backgroundColor: config.theme.pages.gatekeeper.cardColor || '#f9f5eb',
                        ...(config.theme.pages.gatekeeper.cardTexture && {
                            backgroundImage: `url('${config.theme.pages.gatekeeper.cardTexture}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay'
                        }),
                        borderRadius: config.theme.pages.gatekeeper.cardShape === 'rounded' ? '16px' : '4px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)' // Heavy Material Shadow
                    }}
                >
                    {/* Texture Overlay for richness */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />

                    {/* Inner Border using primary color */}
                    <div
                        className="absolute inset-4 border opacity-60 pointer-events-none"
                        style={{ borderColor: config.theme.global.palette.primary }}
                    />
                    <div
                        className="absolute inset-6 border opacity-40 pointer-events-none"
                        style={{ borderColor: config.theme.global.palette.primary }}
                    />

                    {/* --- Layer 4: Text Content (Dynamic Font) --- */}
                    <div className="relative z-20 flex flex-col items-center justify-between h-full py-4">
                        <div className="mt-4">
                            <span
                                className="italic text-xl md:text-2xl tracking-wide opacity-80"
                                style={{
                                    fontFamily: config.theme.global.typography.headingFont || 'serif',
                                    color: config.theme.global.palette.text || '#8c7b66'
                                }}
                            >
                                {content.hero.title}
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-0 my-4">
                            <h1
                                className="flex flex-col items-center leading-none"
                                style={{ fontFamily: config.theme.global.typography.headingFont || 'serif' }}
                            >
                                <span
                                    className="text-6xl md:text-8xl tracking-tight"
                                    style={{ color: config.theme.global.palette.primary }}
                                >
                                    {(content.hero.names?.split('&')[0] || '').trim() || 'Name'}
                                </span>
                                <span
                                    className="italic text-4xl md:text-5xl my-2"
                                    style={{ color: config.theme.global.palette.primary }}
                                >
                                    &
                                </span>
                                <span
                                    className="text-6xl md:text-8xl tracking-tight"
                                    style={{ color: config.theme.global.palette.primary }}
                                >
                                    {(content.hero.names?.split('&')[1] || '').trim() || 'Name'}
                                </span>
                            </h1>
                        </div>

                        <div className="mb-4 flex flex-col items-center gap-3">
                            <div
                                className="w-16 h-[2px] opacity-80"
                                style={{ backgroundColor: config.theme.global.palette.primary }}
                            />
                            <span
                                className="text-base md:text-lg tracking-[0.15em] font-bold uppercase"
                                style={{ color: config.theme.global.palette.text || '#1e100b' }}
                            >
                                {content.hero.date}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- Layer 5: The Button (Dynamic Style, Shape & Color) --- */}
            <motion.button
                onClick={handleOpen}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, type: "spring" }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: config.theme.pages.gatekeeper.buttonStyle === 'glow'
                        ? `0 0 30px ${config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary}, 0 0 60px ${config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary}80`
                        : `0 0 25px ${config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary}80`
                }}
                className={`absolute bottom-10 md:bottom-16 z-30 px-10 py-4 flex items-center gap-3 group transition-all ${config.theme.pages.gatekeeper.buttonShape === 'pill' ? 'rounded-full' :
                    config.theme.pages.gatekeeper.buttonShape === 'rectangle' ? 'rounded-none' :
                        'rounded-lg'
                    }`}
                style={{
                    // buttonStyle: solid | glow | outline
                    ...(config.theme.pages.gatekeeper.buttonStyle === 'outline' ? {
                        backgroundColor: 'transparent',
                        border: `2px solid ${config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary}`,
                        color: config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary
                    } : {
                        backgroundColor: config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary || '#bf953f',
                        boxShadow: config.theme.pages.gatekeeper.buttonStyle === 'glow'
                            ? `0 0 20px ${config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary}80`
                            : 'none'
                    })
                }}
            >
                <span className={`font-sans font-bold text-xs md:text-sm tracking-[0.25em] uppercase ${config.theme.pages.gatekeeper.buttonStyle === 'outline' ? '' : 'text-white'
                    }`} style={{
                        color: config.theme.pages.gatekeeper.buttonStyle === 'outline'
                            ? (config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary)
                            : 'white'
                    }}>Click to Open</span>
                <span className={`w-2 h-2 border-t-2 border-r-2 transform rotate-45 group-hover:translate-x-1 transition-transform`} style={{
                    borderColor: config.theme.pages.gatekeeper.buttonStyle === 'outline'
                        ? (config.theme.pages.gatekeeper.buttonColor || config.theme.global.palette.primary)
                        : 'white'
                }} />
            </motion.button>

        </motion.div>
    );
};
