'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalStyles, VinylRecord, ToneArm, RSVPTicket, RSVPModal, Signature, NOISE_SVG, GoldGradientDef, MarkerDoodle } from './shared';

interface PlayerProps {
    config: any;
    onClose?: () => void;
    defaultIsPlaying?: boolean;
}

export const Player: React.FC<PlayerProps> = ({ config, onClose, defaultIsPlaying = true }) => {
    const content = config; // Alias
    const [isPlaying, setIsPlaying] = useState(defaultIsPlaying);
    const [isRSVPOpen, setIsRSVPOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<'intro' | 'details' | 'gallery'>('intro');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Initialize audio with local music file
        // Note: Assuming we might want to move audioTrack to global assets or player config, but using fallback for now.
        const audio = new Audio('/themes/vintage-vinyl/music.mp3');
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;

        return () => {
            audio.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        if (isPlaying) {
            setTimeout(() => {
                audioRef.current?.play().catch((e) => console.log("Auto-play prevented:", e));
            }, 100);
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const RubberStamp = () => (
        <div className="absolute bottom-4 right-4 transform rotate-[-15deg] opacity-80 pointer-events-none mix-blend-multiply scale-75 md:scale-100 origin-bottom-right transition-transform">
            <div className="border-2 md:border-4 border-red-800 rounded px-2 py-1 md:px-4 md:py-2 flex flex-col items-center justify-center relative">
                <div className="absolute inset-0 border border-red-800 rounded -m-1" />
                <span className="font-sans font-black text-red-800 text-lg md:text-xl tracking-widest uppercase" style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.5)" }}>One Night Only</span>
                <span className="font-serif italic text-red-800 text-[10px] md:text-xs">Admit One</span>
            </div>
        </div>
    );

    const FlourishDivider = () => (
        <svg width="100" height="30" viewBox="0 0 100 30" className="opacity-60 my-6">
            <path d="M10,15 Q30,5 50,15 T90,15" fill="none" stroke="#2d1b0e" strokeWidth="1" />
            <circle cx="50" cy="15" r="3" fill="#2d1b0e" />
            <path d="M45,15 L55,15" stroke="#2d1b0e" strokeWidth="1" />
        </svg>
    );

    const TrackNumber = ({ num, color = '#2d1b0e' }: { num: string; color?: string }) => (
        <div className="absolute -left-12 top-1 w-8 h-8 rounded-full border border-current flex items-center justify-center font-sans font-bold text-xs opacity-50" style={{ color: color, borderColor: color }}>
            {num}
        </div>
    );

    // --- Render Functions ---

    const renderPanelContent = () => {
        switch (activeSection) {
            case 'intro':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center text-center h-full">
                        <div className="w-48 h-64 bg-white p-2 mb-8 flex items-center justify-center shadow-lg relative border border-gray-100 transform rotate-[-2deg]">
                            {/* Tape Effects */}
                            <div className="tape-corner" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }}></div>
                            <div className="tape-corner" style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)' }}></div>

                            <div className="w-full h-full overflow-hidden bg-neutral-200">
                                <img src={content.story.image} alt="Couple" className="w-full h-full object-cover filter sepia-[0.3] contrast-[1.1]" />
                            </div>
                            <div className="absolute -bottom-6 bg-white px-3 py-1 shadow-md text-xs font-serif italic text-gray-600 transform rotate-[3deg] border border-gray-100">
                                {content.hero.location}
                            </div>
                        </div>
                        <h2 className="font-serif text-3xl mb-4" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.story.title}</h2>
                        <div className="max-w-md px-4 text-left">
                            <p className="font-serif leading-relaxed" style={{ color: config.theme.pages.player.leftPanelColor || '#5c4033' }}>
                                <span className="drop-cap">{content.story.description.charAt(0)}</span>
                                {content.story.description.slice(1)}
                            </p>
                        </div>

                        {/* Signature Area */}
                        <div className="mt-8 mb-4">
                            <Signature color={config.theme.pages.player.leftPanelColor} />
                        </div>
                    </motion.div>
                );
            case 'details':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col p-2 relative">
                        <div className={`flex-1 p-6 md:p-8 flex flex-col items-center text-center relative shadow-none overflow-y-auto custom-scrollbar ${config.theme.pages.player.leftPanelTexture ? 'border-none' : 'border-[6px] border-double border-[#2d1b0e] bg-[#fdfbf7] shadow-sm'}`}>
                            <div className="mt-2 mb-6 w-full shrink-0">
                                <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter leading-[0.9] transform scale-y-110" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.logistics.title}</h2>
                                <div className="mt-4 border-b-2 border-dashed w-1/2 mx-auto" style={{ borderColor: config.theme.pages.player.leftPanelColor || '#2d1b0e' }} />
                            </div>

                            <div className="w-full flex-1 flex flex-col justify-center space-y-10 py-4 relative pl-8">
                                {/* Track 01: Ceremony */}
                                <div className="flex flex-col items-center group cursor-default relative">
                                    <TrackNumber num="01" color={config.theme.pages.player.glowColor} />
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <span className="font-sans font-bold text-2xl" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.logistics.ceremony.time}</span>
                                        <span className="font-serif italic text-xl" style={{ color: config.theme.pages.player.leftPanelColor || '#8c7b66' }}>Ceremony</span>
                                    </div>
                                    <div className="w-4/5 border-t pt-2 mt-1" style={{ borderColor: config.theme.pages.player.glowColor || '#d4b483' }}>
                                        <span className="block font-serif font-bold uppercase tracking-widest text-sm mb-1" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.logistics.ceremony.venue}</span>
                                        <span className="block font-serif italic text-sm" style={{ color: config.theme.pages.player.leftPanelColor || '#5c4033' }}>{content.logistics.ceremony.address}</span>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.logistics.ceremony.address || content.logistics.ceremony.venue)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans font-medium hover:opacity-80 transition-colors uppercase tracking-wider"
                                            style={{ color: config.theme.pages.player.glowColor || '#8c7b66' }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={config.theme.pages.player.glowColor || "#ef4444"} stroke={config.theme.pages.player.glowColor || "#7f1d1d"} strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" fill="white" /></svg>
                                            <span className="font-bold border-b" style={{ color: config.theme.pages.player.glowColor || '#a855f7', borderColor: (config.theme.pages.player.glowColor || '#a855f7') + '4d' }}>Get Directions</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center justify-center">
                                    <FlourishDivider />
                                </div>

                                {/* Track 02: Reception */}
                                <div className="flex flex-col items-center group cursor-default relative">
                                    <TrackNumber num="02" color={config.theme.pages.player.glowColor} />
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <span className="font-sans font-bold text-2xl" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.logistics.reception.time}</span>
                                        <span className="font-serif italic text-xl" style={{ color: config.theme.pages.player.leftPanelColor || '#8c7b66' }}>Reception</span>
                                    </div>
                                    <div className="w-4/5 border-t pt-2 mt-1" style={{ borderColor: config.theme.pages.player.glowColor || '#d4b483' }}>
                                        <span className="block font-serif font-bold uppercase tracking-widest text-sm mb-1" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.logistics.reception.venue}</span>
                                        <span className="block font-serif italic text-sm" style={{ color: config.theme.pages.player.leftPanelColor || '#5c4033' }}>{content.logistics.reception.address}</span>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.logistics.reception.address || content.logistics.reception.venue)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans font-medium hover:opacity-80 transition-colors uppercase tracking-wider"
                                            style={{ color: config.theme.pages.player.glowColor || '#8c7b66' }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={config.theme.pages.player.glowColor || "#ef4444"} stroke={config.theme.pages.player.glowColor || "#7f1d1d"} strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" fill="white" /></svg>
                                            <span className="font-bold border-b" style={{ color: config.theme.pages.player.glowColor || '#a855f7', borderColor: (config.theme.pages.player.glowColor || '#a855f7') + '4d' }}>Get Directions</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Rubber Stamp */}
                            <RubberStamp />
                        </div>
                    </motion.div>
                );
            case 'gallery':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col h-full"
                        style={{ background: 'transparent' }}
                    >
                        <div className="mb-6 flex flex-col items-center shrink-0">
                            <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-2" style={{ color: config.theme.pages.player.leftPanelColor || '#2d1b0e' }}>{content.gallery.title}</h2>
                            <div className="h-[2px] w-24" style={{ backgroundColor: config.theme.pages.player.glowColor || '#d4b483' }} />
                        </div>
                        <div className="relative flex-1 overflow-y-auto fader-scrollbar px-4 pt-4">
                            <div className="grid grid-cols-2 gap-6 pb-20">
                                {content.gallery.images.map((src: any, index: any) => {
                                    // Increased randomness for "scattered" look
                                    const rotate = ((index * 13) % 15) - 7;
                                    const translateY = ((index * 7) % 20); // Push some down

                                    return (
                                        <motion.div
                                            layoutId={`photo-${index}`}
                                            key={`photo-${index}`}
                                            onClick={() => setSelectedImage(src)}
                                            className="cursor-zoom-in relative group"
                                            initial={{ rotate: rotate, y: translateY }}
                                            whileHover={{ scale: 1.05, zIndex: 10, rotate: 0, y: translateY - 5, transition: { duration: 0.2 } }}
                                        >
                                            <div
                                                className={`transition-all duration-300 relative ${config.theme.pages.player.photoFrameStyle === 'minimal' ? 'bg-transparent' :
                                                        config.theme.pages.player.photoFrameStyle === 'gold' ? 'bg-transparent' :
                                                            'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] group-hover:shadow-2xl'
                                                    } ${config.theme.pages.player.photoFrameStyle !== 'gold' ? 'p-3' : ''}`}
                                                style={{
                                                    border: config.theme.pages.player.photoFrameStyle === 'gold' ? `4px solid ${config.theme.pages.player.glowColor || '#d4af37'}` : 'none',
                                                    boxShadow: config.theme.pages.player.photoFrameStyle === 'gold' ? '0 10px 30px rgba(0,0,0,0.5)' : undefined,
                                                }}
                                            >
                                                {/* Tape Effects within grid */}
                                                {config.theme.pages.player.photoFrameStyle === 'tape' && (
                                                    <img
                                                        src="/themes/vintage-vinyl/masking_tape.png"
                                                        alt=""
                                                        className="absolute -top-4 -left-4 w-16 rotate-[-20deg] z-10 drop-shadow-md opacity-90"
                                                    />
                                                )}
                                                {config.theme.pages.player.photoFrameStyle !== 'minimal' && config.theme.pages.player.photoFrameStyle !== 'tape' && index % 3 === 0 && <div className="tape-corner" style={{ top: '-12px', left: '50%', width: '4rem', transform: 'translateX(-50%) rotate(2deg)' }}></div>}

                                                <div className="aspect-[4/5] overflow-hidden bg-neutral-100 relative mb-4">
                                                    <img src={src} alt="Gallery" className="w-full h-full object-cover filter sepia-[0.2] contrast-[1.1]" />
                                                </div>

                                                {/* Marker Scribble */}
                                                <MarkerDoodle index={index} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                            <AnimatePresence>
                                {selectedImage && (
                                    <motion.div
                                        className="fixed inset-0 z-[200] flex flex-col items-start justify-start bg-black/95 backdrop-blur-md overflow-y-auto"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setSelectedImage(null)}
                                    >
                                        {/* Close button at top */}
                                        <button
                                            onClick={() => setSelectedImage(null)}
                                            className="fixed top-4 right-4 z-[201] w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                                            aria-label="Close Photo"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                                <path d="M18 6L6 18M6 6l12 12" />
                                            </svg>
                                        </button>

                                        {/* Image container - starts from top */}
                                        <div className="w-full min-h-screen flex flex-col items-center justify-start pt-16 pb-8 px-4">
                                            <motion.div
                                                layoutId={`photo-${content.gallery.images.indexOf(selectedImage)}`}
                                                className="bg-white p-2 md:p-4 shadow-2xl relative w-full max-w-4xl flex flex-col items-center"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <img
                                                    src={selectedImage}
                                                    alt="Expanded"
                                                    className="w-full h-auto max-h-[85vh] md:max-h-[80vh] object-contain filter sepia-[0.1]"
                                                />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <>
            <GlobalStyles />
            {/* SVG Definitions */}
            <svg width="0" height="0"><GoldGradientDef /></svg>

            <AnimatePresence>
                {isRSVPOpen && <RSVPModal onClose={() => setIsRSVPOpen(false)} key="rsvp-modal" confirmationMessage={content.rsvp.confirmationMessage} deadline={content.rsvp.deadline} weddingId={config.weddingId} />}
            </AnimatePresence>

            <motion.div
                key="open"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${config.isEditorOpen ? 'absolute inset-0' : 'fixed inset-0 z-50'} flex flex-col md:flex-row`}
            >
                {/* LEFT PANEL: Liner Notes */}
                <motion.div
                    className="w-full md:w-1/2 h-[70%] md:h-full relative p-6 md:p-12 overflow-hidden shadow-[5px_0_20px_rgba(0,0,0,0.3)] z-20"
                    style={{
                        backgroundImage: config.theme.pages.player.leftPanelTexture
                            ? `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("${config.theme.pages.player.leftPanelTexture}")`
                            : 'none',
                        backgroundColor: config.theme.pages.player.leftPanelTexture ? 'transparent' : '#f4e4bc',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: config.theme.pages.player.leftPanelColor || '#1e100b',
                        textShadow: config.theme.pages.player.leftPanelTexture ? '0 1px 2px rgba(0,0,0,0.8)' : 'none'
                    }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
                        style={{
                            backgroundImage: `url("${NOISE_SVG}")`,
                            filter: config.theme.pages.player.leftPanelTexture ? 'invert(1) opacity(0.3)' : 'none'
                        }}
                    />
                    <div className="absolute inset-4 md:inset-8 border-4 border-double border-[#d4af37] opacity-50 pointer-events-none" />
                    {onClose && (
                        <button onClick={onClose} className="absolute top-6 left-6 md:top-10 md:left-10 z-50 bg-[#2d1b0e]/10 hover:bg-[#2d1b0e]/20 border border-[#8c7b66]/40 px-3 py-1.5 rounded text-[#5c4033] hover:text-[#2d1b0e] transition-all font-sans text-xs tracking-widest uppercase flex items-center gap-2 font-medium shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            Close Album
                        </button>
                    )}
                    <div className="relative z-10 h-full flex flex-col pt-12">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeSection} className="flex-1 overflow-y-auto custom-scrollbar">
                                {renderPanelContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>


                {/* RIGHT PANEL: Turntable */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
                    className={`w-full md:w-1/2 h-[30%] md:h-full relative flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-2 border-[#2d1b0e] shadow-inner overflow-hidden ${isPlaying ? 'bg-[#1a1a1a]' : 'bg-[#111]'}`}
                    style={{
                        backgroundImage: config.theme.pages.player.rightPanelTexture
                            ? `url("${config.theme.pages.player.rightPanelTexture}")`
                            : 'none',
                        backgroundSize: config.theme.pages.player.rightPanelTexture ? '150px' : 'cover', // Tighter repeat for mesh
                        backgroundPosition: 'center',
                        backgroundColor: config.theme.pages.player.rightPanelTexture ? '#333333' : undefined, // Lightened from #050505 to reveal texture
                        backgroundBlendMode: config.theme.pages.player.rightPanelTexture ? 'multiply' : 'normal',
                        boxShadow: config.theme.pages.player.rightPanelTexture ? 'inset 0 0 80px 20px rgba(0,0,0,0.9)' : 'none' // Deep recession effect
                    }}
                >
                    {/* Mobile indicator - pulsing border highlight */}
                    <motion.div
                        className="absolute inset-0 border-t-2 border-[#d4af37] md:hidden pointer-events-none"
                        animate={{
                            opacity: [0.4, 0.8, 0.4],
                            boxShadow: [
                                '0 0 0px rgba(212, 175, 55, 0)',
                                '0 0 20px rgba(212, 175, 55, 0.4)',
                                '0 0 0px rgba(212, 175, 55, 0)'
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    {/* Mobile indicator - top gradient line */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent md:hidden"
                        animate={{
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    {/* Turntable Assembly Wrapper - locks arm to record */}
                    <div className="relative">
                        <div className="relative w-[35vh] h-[35vh] md:w-[450px] md:h-[450px] bg-[#222] rounded-full border-8 border-[#111] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
                            <VinylRecord
                                label={content.hero.title}
                                subLabel={content.hero.date}
                                isPlaying={isPlaying}
                                className="w-[92%] h-[92%]"
                                texture={config.theme.global.assets.recordTexture}
                                glowColor={config.theme.pages.player.glowColor}
                            />
                        </div>

                        {/* SVG ToneArm Component - Positioned relative to the record wrapper */}
                        <ToneArm
                            isPlaying={isPlaying}
                            className="absolute -top-[5vh] -right-[5vh] w-[15vh] h-[30vh] md:-top-16 md:-right-20 md:w-48 md:h-96 z-30 pointer-events-none"
                        />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#000] to-transparent p-4 md:p-8 flex items-end justify-between">
                        <div className="flex gap-4 md:gap-6 items-end">
                            <div className="flex flex-col gap-2">
                                <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans hidden md:block">Power / Play</div>
                                <button onClick={() => setIsPlaying(!isPlaying)} className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isPlaying ? 'border-[#d4af37] bg-[#d4af37] text-[#1a0f08] shadow-[0_0_20px_rgba(212,180,131,0.4)]' : 'border-neutral-600 text-neutral-600 hover:border-neutral-400 hover:text-neutral-400'}`}>
                                    {isPlaying ? <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
                                </button>
                            </div>
                            {/* Replaced old RSVP button with Ticket Component */}
                            <div className="flex flex-col gap-2 items-center pb-1 -ml-2 transform scale-90 origin-bottom-left md:scale-100">
                                <RSVPTicket
                                    onClick={() => setIsRSVPOpen(true)}
                                    label={content.rsvp.ticketTitle}
                                    imageSrc={config.theme.pages.player.rsvpButtonAsset}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 items-end relative">
                            {/* Animated arrow indicator on mobile - above the track list menu */}
                            <motion.div
                                className="absolute -top-24 right-0 flex flex-col items-end gap-1 md:hidden z-50 pointer-events-none"
                                animate={{
                                    y: [0, 8, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <span className="text-[#d4af37] text-xs font-sans uppercase tracking-wider whitespace-nowrap bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-[#d4af37]/30">Tap to explore</span>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14M19 12l-7 7-7-7" />
                                </svg>
                            </motion.div>
                            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-sans text-right hidden md:block">Select Track</div>
                            <div className="flex flex-col gap-1 items-end font-sans text-xs md:text-sm">
                                {[{ id: 'intro', label: `01. ${content.story?.title || 'Liner Notes'}` }, { id: 'details', label: `02. ${content.logistics?.title || 'Setlist'}` }, { id: 'gallery', label: `03. ${content.gallery?.title || 'Photo Session'}` }].map((track) => (
                                    <button key={track.id} onClick={() => setActiveSection(track.id as any)} className={`uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${activeSection === track.id ? 'text-[#d4af37] font-bold' : 'text-neutral-400 hover:text-neutral-200'}`}>
                                        {activeSection === track.id && <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>}
                                        {track.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};
