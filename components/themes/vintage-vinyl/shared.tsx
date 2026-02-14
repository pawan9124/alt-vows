'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// --- Shared Assets ---

// Noise texture SVG data URI for the paper texture
export const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;

// Inject custom styles for gradients, animations, and fonts
export const GlobalStyles = () => (
    <style>{`
      @keyframes shine {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      .animate-shine {
        background-size: 200% auto;
        animation: shine 4s linear infinite;
      }
      .gold-foil-text {
        background: linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0px 2px 0px rgba(40, 20, 10, 0.5));
      }
      .gold-foil-bg {
        background: linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
      }
      .gold-border-gradient {
        border-image: linear-gradient(to bottom right, #bf953f, #fcf6ba, #b38728) 1;
      }
      .bg-ornate {
        background-color: #1e100b;
        background-image: 
          radial-gradient(circle at 50% 50%, rgba(200, 150, 50, 0.05), transparent 80%),
          url("${NOISE_SVG}");
      }
      @keyframes equalizer {
        0%, 100% { height: 4px; }
        50% { height: 12px; }
      }
      .eq-bar { animation: equalizer 0.4s ease-in-out infinite; }
      .eq-bar:nth-child(2) { animation-delay: 0.1s; }
      .eq-bar:nth-child(3) { animation-delay: 0.2s; }
      
      .drop-cap {
        float: left;
        font-size: 3.5rem;
        line-height: 0.8;
        padding-right: 0.5rem;
        padding-top: 0.1rem;
        font-family: serif;
        font-weight: bold;
        color: #d4af37;
      }
  
      .tape-corner {
        position: absolute;
        width: 3rem;
        height: 1rem;
        background-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 1px 1px rgba(0,0,0,0.1);
        transform: rotate(-45deg);
        z-index: 10;
        backdrop-filter: blur(1px);
        border: 1px solid rgba(255,255,255,0.2);
      }
      
      @keyframes float-particle {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
      }
      .particle {
        position: absolute;
        background: #d4af37;
        border-radius: 50%;
        pointer-events: none;
      }
  
      /* Custom Fader Scrollbar */
      .fader-scrollbar::-webkit-scrollbar {
        width: 16px;
        background-color: #fdfbf7;
        border-left: 1px solid #d4b483;
      }
      .fader-scrollbar::-webkit-scrollbar-track {
        background: 
          linear-gradient(90deg, transparent 45%, #d4b483 45%, #d4b483 55%, transparent 55%),
          repeating-linear-gradient(0deg, transparent, transparent 10px, #e5e5e5 10px, #e5e5e5 11px);
      }
      .fader-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #333 0%, #666 50%, #333 100%);
        border: 2px solid #111;
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        min-height: 40px;
      }
      .fader-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #444 0%, #777 50%, #444 100%);
      }
    `}</style>
);

export const FloatingParticles = () => {
    // Generate stable random positions for particles
    const particles = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 3 + 1 + 'px',
            duration: Math.random() * 10 + 10 + 's',
            delay: Math.random() * 5 + 's',
            opacity: Math.random() * 0.5 + 0.1
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        opacity: p.opacity,
                        animation: `float-particle ${p.duration} linear infinite`,
                        animationDelay: `-${p.delay}` // Negative delay to start mid-animation
                    }}
                />
            ))}
        </div>
    );
};

// --- SVG Components for Decoration ---

export const GoldGradientDef = () => (
    <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="25%" stopColor="#fcf6ba" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="75%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
        </linearGradient>
    </defs>
);

export const OrnateCorner = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 100 100" className={className} style={style}>
        <path
            d="M10,10 C10,10 30,10 40,20 Q60,40 40,60 Q20,80 10,10 M10,10 C10,10 10,30 20,40 Q40,60 60,40 Q80,20 10,10"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M5,5 L25,5 L5,25 Z M95,5 L75,5 Q85,15 95,25 M5,95 L5,75 Q15,85 25,95"
            fill="url(#goldGradient)"
        />
        <path
            d="M30,30 Q50,10 80,5 M30,30 Q10,50 5,80"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="1.5"
        />
        <circle cx="20" cy="20" r="2" fill="url(#goldGradient)" />
        <circle cx="80" cy="5" r="1.5" fill="url(#goldGradient)" />
        <circle cx="5" cy="80" r="1.5" fill="url(#goldGradient)" />
    </svg>
);

export const MarkerDoodle = ({ index }: { index: number }) => {
    // Collection of random doodles
    const doodles = [
        <path key="1" d="M10,20 Q30,10 50,20 Q70,30 90,20" stroke="#2d1b0e" strokeWidth="2" fill="none" />, // wavy line
        <path key="2" d="M20,10 L30,30 L40,10 L50,30" stroke="#2d1b0e" strokeWidth="2" fill="none" />, // zigzag
        <path key="3" d="M10,15 C10,15 25,5 25,15 C25,25 10,25 10,15 Z" stroke="#2d1b0e" strokeWidth="2" fill="none" transform="rotate(-15)" />, // heart-ish loop
        <text key="4" x="10" y="25" fontFamily="cursive" fontSize="20" fill="#2d1b0e">xoxo</text>,
        <text key="5" x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Love</text>,
        <text key="6" x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Forever</text>,
        <text key="7" x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Us</text>,
        <path key="8" d="M40,10 L45,25 L60,25 L48,35 L52,50 L40,40 L28,50 L32,35 L20,25 L35,25 Z" stroke="#2d1b0e" strokeWidth="1.5" fill="none" transform="scale(0.5) translate(20, -10)" />, // Star
    ];

    return (
        <svg width="100" height="40" viewBox="0 0 100 40" className="absolute bottom-1 right-2 w-16 h-8 opacity-70 transform rotate-[-5deg]">
            {doodles[index % doodles.length]}
        </svg>
    );
};

export const CardCorner = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg viewBox="0 0 50 50" className={className} style={style}>
        <path d="M2,2 L15,2 Q25,2 25,12" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        <path d="M2,2 L2,15 Q2,25 12,25" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        <path d="M2,2 L8,8" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="2" cy="2" r="1.5" fill="#d4af37" />
        <path d="M10,10 Q20,5 30,0 M10,10 Q5,20 0,30" fill="none" stroke="#d4af37" strokeWidth="0.5" />
    </svg>
);

export const Star = ({ style }: { style: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" style={style} className="absolute animate-pulse">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#goldGradient)" />
    </svg>
);

export const ToneArm = ({ isPlaying, className }: { isPlaying: boolean; className?: string }) => {
    return (
        <motion.div
            className={className}
            initial={{ rotate: 0 }}
            animate={{ rotate: isPlaying ? 25 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "75% 15%" }} // Pivot point coordinate (150, 60) relative to 200x400
        >
            <svg viewBox="0 0 200 400" className="w-full h-full drop-shadow-2xl" style={{ overflow: 'visible' }}>
                <defs>
                    <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#555" />
                        <stop offset="30%" stopColor="#fff" />
                        <stop offset="50%" stopColor="#999" />
                        <stop offset="100%" stopColor="#555" />
                    </linearGradient>
                    <radialGradient id="pivotMetallic" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
                        <stop offset="0%" stopColor="#fff" />
                        <stop offset="100%" stopColor="#333" />
                    </radialGradient>
                </defs>

                {/* Counterweight (Behind pivot) */}
                <rect x="138" y="20" width="24" height="40" rx="2" fill="#333" stroke="#111" />

                {/* Base/Pivot Assembly */}
                <circle cx="150" cy="60" r="25" fill="#1a1a1a" stroke="#111" strokeWidth="2" />
                <circle cx="150" cy="60" r="20" fill="url(#pivotMetallic)" />
                <circle cx="150" cy="60" r="5" fill="#111" />

                {/* The Arm Tube (S-Curve) */}
                <path
                    d="M150,60 L145,260 Q145,310 100,320"
                    fill="none"
                    stroke="url(#silverGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Headshell */}
                <g transform="translate(100, 320) rotate(10)">
                    <path d="M0,-5 L40,-5 L45,15 L5,15 Z" fill="#111" stroke="#333" strokeWidth="1" />
                    <rect x="10" y="10" width="20" height="8" fill="#222" /> {/* Cartridge body */}
                    <rect x="18" y="18" width="4" height="6" fill="#ddd" /> {/* Stylus */}
                </g>
            </svg>
        </motion.div>
    );
};

export const NeonVisualizer = ({ isPlaying, color = '#9333ea' }: { isPlaying: boolean; color?: string }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
            <AnimatePresence>
                {isPlaying && (
                    <>
                        {/* Main Glow Pulse */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute w-[180%] h-[180%] rounded-full blur-3xl opacity-30 mix-blend-screen"
                            style={{ backgroundColor: color }}
                        />

                        {/* Animated Equalizer Bars - Radial */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 10, opacity: 0 }}
                                animate={{
                                    height: [20, 60 + Math.random() * 40, 20],
                                    opacity: 0.8,
                                    backgroundColor: ['#a855f7', '#d8b4fe', '#a855f7']
                                }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    duration: 0.5 + Math.random() * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.1
                                }}
                                style={{
                                    position: 'absolute',
                                    width: '6px',
                                    bottom: '50%',
                                    transformOrigin: 'bottom center',
                                    transform: `rotate(${i * 30}deg) translateY(-60px)`, // Push out from center (reduced distance)
                                    borderRadius: '2px',
                                    backgroundColor: color,
                                    boxShadow: `0 0 5px ${color}`
                                }}
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export const VinylRecord = ({
    label,
    subLabel,
    isPlaying = false,
    className = "",
    texture,
    glowColor = "#a855f7"
}: {
    label: string;
    subLabel: string;
    isPlaying?: boolean;
    className?: string;
    texture?: string;
    glowColor?: string;
}) => {
    return (
        <motion.div
            className={`relative rounded-full shadow-2xl ${className} transition-shadow duration-1000`}
            style={{
                background: `conic-gradient(from 45deg, #1a1a1a 0%, #333 10%, #1a1a1a 20%, #000 30%, #222 50%, #000 70%, #1a1a1a 80%, #333 90%, #1a1a1a 100%)`,
                boxShadow: isPlaying
                    ? `0 0 40px ${glowColor}66, inset 0 0 60px ${glowColor}4d`
                    : '0 20px 50px rgba(0,0,0,0.5)',
            }}
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={isPlaying ? { repeat: Infinity, ease: "linear", duration: 4 } : { duration: 0.5 }}
        >
            <NeonVisualizer isPlaying={isPlaying || false} color={glowColor} />
            <div className="absolute inset-0 rounded-full opacity-50" style={{ background: `repeating-radial-gradient(#000 0, #000 2px, transparent 3px, transparent 4px)` }} />
            <div className="absolute inset-0 rounded-full opacity-30" style={{ background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)` }} />
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Neon glow ring from inside */}
                {isPlaying && (
                    <div className="absolute inset-[30%] rounded-full animate-pulse z-0" style={{ boxShadow: `0 0 20px 5px ${glowColor}99` }} />
                )}

                <div
                    className="w-[35%] h-[35%] rounded-full border-4 border-[#1a1a1a] flex flex-col items-center justify-center shadow-inner relative overflow-hidden z-10 bg-cover bg-center"
                    style={{
                        backgroundColor: '#8B0000', // Fallback color
                        backgroundImage: texture ? `url("${texture}")` : `url("${NOISE_SVG}")`
                    }}
                >
                    {!texture && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />}
                    <div className="relative z-10 text-center px-2">
                        <span className="block text-[#d4b483] text-[0.4rem] md:text-[0.6rem] font-bold tracking-widest uppercase mb-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">{label}</span>
                        {isPlaying ? (
                            <div className="flex items-end justify-center gap-[2px] h-3">
                                <div className="w-[3px] bg-[#d4b483] rounded-sm eq-bar"></div>
                                <div className="w-[3px] bg-[#d4b483] rounded-sm eq-bar"></div>
                                <div className="w-[3px] bg-[#d4b483] rounded-sm eq-bar"></div>
                            </div>
                        ) : (
                            <span className="block text-white text-[0.3rem] md:text-[0.5rem] font-serif italic opacity-90 leading-tight">{subLabel}</span>
                        )}
                    </div>
                    <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-[#e5e5e5] rounded-full border border border-gray-400"></div>
                </div>
            </div>
        </motion.div>
    );
};

export const RSVPTicket = ({ onClick, label, imageSrc }: { onClick: () => void, label: string, imageSrc?: string }) => (
    <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.05, rotate: -5, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer group"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
    >
        {imageSrc ? (
            <div className="relative w-36 h-auto flex items-center justify-center">
                <img
                    src={imageSrc}
                    alt={label}
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </div>
        ) : (
            <div className="relative w-36 h-16 bg-[#e6d2b5] flex flex-col items-center justify-center overflow-hidden rounded-sm">
                {/* Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />

                {/* Perforation Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#151515] rounded-full -translate-x-2 shadow-inner" />
                {/* Perforation Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#151515] rounded-full translate-x-2 shadow-inner" />

                {/* Inner Border */}
                <div className="absolute inset-1.5 border-2 border-dashed border-[#8c7b66]/60 rounded-sm" />

                {/* Text */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-0.5 opacity-70">
                        <span className="w-2 h-2 rounded-full border border-[#5c4033]"></span>
                        <span className="font-sans text-[0.5rem] tracking-[0.2em] text-[#5c4033] uppercase">{label}</span>
                        <span className="w-2 h-2 rounded-full border border-[#5c4033]"></span>
                    </div>
                    <span className="font-serif text-2xl font-black text-[#2d1b0e] tracking-widest leading-none group-hover:text-[#b08d55] transition-colors">RSVP</span>
                </div>
            </div>
        )}
    </motion.div>
);

export const Signature = ({ color = '#2d1b0e' }: { color?: string }) => (
    <div className="opacity-80" style={{ color: color }}>
        <svg width="150" height="40" viewBox="0 0 150 40">
            <path
                d="M10,25 Q30,5 40,20 T70,20 T100,10 T130,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M20,30 Q40,35 60,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
            />
        </svg>
    </div>
);

export const RSVPModal = ({ onClose, confirmationMessage, deadline, weddingId }: { onClose: () => void, confirmationMessage: string, deadline: string, weddingId?: string }) => {
    const [name, setName] = useState('');
    const [attending, setAttending] = useState(true);
    const [guestCount, setGuestCount] = useState(1);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    // Check if already submitted
    useEffect(() => {
        if (weddingId) {
            try {
                const submitted = localStorage.getItem(`rsvp_submitted_${weddingId}`);
                if (submitted) setStatus('success');
            } catch { /* localStorage unavailable */ }
        }
    }, [weddingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (!weddingId) {
            setStatus('error');
            setErrorMsg('Unable to submit RSVP. Please try again later.');
            return;
        }

        setStatus('loading');
        try {
            const { error } = await supabase
                .from('guests')
                .insert({
                    wedding_id: weddingId,
                    name: name.trim(),
                    email: null,
                    attending,
                    plus_ones: attending ? Math.max(0, guestCount - 1) : 0,
                    message: message.trim() || null,
                });

            if (error) throw error;
            setStatus('success');
            // Remember this RSVP so we don't show the form again
            try { localStorage.setItem(`rsvp_submitted_${weddingId}`, 'true'); } catch { /* ok */ }
        } catch (err: any) {
            console.error('RSVP error:', err);
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="w-full max-w-md bg-[#fdfbf7] p-8 md:p-12 relative shadow-2xl transform rotate-1"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundImage: `url("${NOISE_SVG}")`
                }}
            >
                {/* Corner Tape */}
                <div className="absolute -top-4 -left-4 w-24 h-8 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm transform -rotate-45 pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-24 h-8 bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm transform -rotate-45 pointer-events-none" />

                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl text-[#2d1b0e] mb-2">RSVP</h2>
                    <div className="h-[2px] w-12 bg-[#d4af37] mx-auto mb-4" />
                    <p className="font-sans text-xs uppercase tracking-widest text-[#8c7b66]">Deadline: {deadline}</p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h3 className="font-serif text-2xl text-[#2d1b0e] mb-2">Thank You!</h3>
                        <p className="font-serif italic text-sm text-[#8c7b66]">{confirmationMessage}</p>
                    </motion.div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="space-y-1">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-[#5c4033]">Your Name *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-b border-[#d4b483] py-2 focus:outline-none focus:border-[#d4af37] font-serif text-lg text-[#2d1b0e] placeholder-[#2d1b0e]/30"
                                placeholder="Your full name"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Attending Choice */}
                        <div className="space-y-2">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-[#5c4033]">Will You Attend?</label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border border-[#8c7b66] flex items-center justify-center transition-colors ${attending ? 'bg-[#2d1b0e] border-[#2d1b0e]' : 'bg-transparent'}`}>
                                        {attending && <div className="w-1.5 h-1.5 bg-[#fdfbf7] rounded-full" />}
                                    </div>
                                    <input type="radio" name="attending" className="sr-only" checked={attending} onChange={() => setAttending(true)} />
                                    <span className="font-serif text-sm text-[#2d1b0e] group-hover:text-[#5c4033] transition-colors">Joyfully Accept</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border border-[#8c7b66] flex items-center justify-center transition-colors ${!attending ? 'bg-[#2d1b0e] border-[#2d1b0e]' : 'bg-transparent'}`}>
                                        {!attending && <div className="w-1.5 h-1.5 bg-[#fdfbf7] rounded-full" />}
                                    </div>
                                    <input type="radio" name="attending" className="sr-only" checked={!attending} onChange={() => setAttending(false)} />
                                    <span className="font-serif text-sm text-[#2d1b0e] group-hover:text-[#5c4033] transition-colors">Regretfully Decline</span>
                                </label>
                            </div>
                        </div>

                        {/* Guest Count — only show if attending */}
                        {attending && (
                            <div className="space-y-1">
                                <label className="block font-sans text-[10px] uppercase tracking-wider text-[#5c4033]">Number of Guests (including yourself)</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                        className="w-8 h-8 rounded-full border border-[#d4b483] text-[#2d1b0e] font-bold text-lg flex items-center justify-center hover:bg-[#2d1b0e] hover:text-[#fdfbf7] transition-colors"
                                        disabled={status === 'loading'}
                                    >−</button>
                                    <span className="font-serif text-2xl text-[#2d1b0e] w-8 text-center">{guestCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                                        className="w-8 h-8 rounded-full border border-[#d4b483] text-[#2d1b0e] font-bold text-lg flex items-center justify-center hover:bg-[#2d1b0e] hover:text-[#fdfbf7] transition-colors"
                                        disabled={status === 'loading'}
                                    >+</button>
                                </div>
                            </div>
                        )}

                        {/* Message / Dietary Requirements */}
                        <div className="space-y-1">
                            <label className="block font-sans text-[10px] uppercase tracking-wider text-[#5c4033]">Message or Dietary Requirements</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={2}
                                className="w-full bg-transparent border border-[#d4b483] rounded p-2 focus:outline-none focus:border-[#d4af37] font-serif text-sm text-[#2d1b0e] placeholder-[#2d1b0e]/30 resize-none"
                                placeholder="Any allergies, song requests, or a note for the couple..."
                                disabled={status === 'loading'}
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-600 text-sm font-sans text-center">{errorMsg}</p>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-[#2d1b0e] text-[#fdfbf7] py-4 font-sans font-bold uppercase tracking-widest hover:bg-[#4a3b2a] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? 'Sending...' : 'Confirm Attendance'}
                            </button>
                            <p className="text-center mt-4 font-serif italic text-sm text-[#8c7b66]">{confirmationMessage}</p>
                        </div>
                    </form>
                )}

                <button onClick={onClose} className="absolute top-4 right-4 text-[#8c7b66] hover:text-[#2d1b0e]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </motion.div>
        </motion.div>
    );
};
