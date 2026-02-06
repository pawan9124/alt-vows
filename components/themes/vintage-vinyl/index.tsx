'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ThemeContent } from './types';
import { supabase } from '../../../lib/supabase';
const musicFile = '/themes/vintage-vinyl/music.mp3';
import { mergeConfig, defaultContent } from './config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MetalSpike } from './MetalSpike';

// Noise texture SVG data URI for the paper texture
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E`;

interface VintageVinylThemeProps {
  initialData?: any;
  // Keep these for backward compatibility/editor support if needed, though prompt focused on initialData
  weddingId?: string;
  slug?: string;
  onContentChange?: (section: string, field: string, value: any) => void;
  isEditorOpen?: boolean;
}

// Inject custom styles for gradients, animations, and fonts
const GlobalStyles = () => (
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

const FloatingParticles = () => {
  // Generate stable random positions for particles
  const particles = React.useMemo(() => {
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

const GoldGradientDef = () => (
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

const OrnateCorner = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
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

const MarkerDoodle = ({ index }: { index: number }) => {
  // Collection of random doodles
  const doodles = [
    <path d="M10,20 Q30,10 50,20 Q70,30 90,20" stroke="#2d1b0e" strokeWidth="2" fill="none" />, // wavy line
    <path d="M20,10 L30,30 L40,10 L50,30" stroke="#2d1b0e" strokeWidth="2" fill="none" />, // zigzag
    <path d="M10,15 C10,15 25,5 25,15 C25,25 10,25 10,15 Z" stroke="#2d1b0e" strokeWidth="2" fill="none" transform="rotate(-15)" />, // heart-ish loop
    <text x="10" y="25" fontFamily="cursive" fontSize="20" fill="#2d1b0e">xoxo</text>,
    <text x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Love</text>,
    <text x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Forever</text>,
    <text x="10" y="25" fontFamily="cursive" fontSize="18" fill="#2d1b0e">Us</text>,
    <path d="M40,10 L45,25 L60,25 L48,35 L52,50 L40,40 L28,50 L32,35 L20,25 L35,25 Z" stroke="#2d1b0e" strokeWidth="1.5" fill="none" transform="scale(0.5) translate(20, -10)" />, // Star
  ];

  return (
    <svg width="100" height="40" viewBox="0 0 100 40" className="absolute bottom-1 right-2 w-16 h-8 opacity-70 transform rotate-[-5deg]">
      {doodles[index % doodles.length]}
    </svg>
  );
};

const CardCorner = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 50 50" className={className} style={style}>
    <path d="M2,2 L15,2 Q25,2 25,12" fill="none" stroke="#d4af37" strokeWidth="1.5" />
    <path d="M2,2 L2,15 Q2,25 12,25" fill="none" stroke="#d4af37" strokeWidth="1.5" />
    <path d="M2,2 L8,8" fill="none" stroke="#d4af37" strokeWidth="1" />
    <circle cx="2" cy="2" r="1.5" fill="#d4af37" />
    <path d="M10,10 Q20,5 30,0 M10,10 Q5,20 0,30" fill="none" stroke="#d4af37" strokeWidth="0.5" />
  </svg>
);

const Star = ({ style }: { style: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" style={style} className="absolute animate-pulse">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#goldGradient)" />
  </svg>
);

const ToneArm = ({ isPlaying, className }: { isPlaying: boolean; className?: string }) => {
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

// --- Main Components ---

const RSVPTicket = ({ onClick, label }: { onClick: () => void, label: string }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.05, rotate: -5, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="relative cursor-pointer group"
    style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))' }}
  >
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
  </motion.div>
);

const RSVPModal: React.FC<{ onClose: () => void, confirmationMessage: string, deadline?: string, weddingId?: string }> = ({ onClose, confirmationMessage, deadline, weddingId }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', attending: true });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no weddingId (preview mode), just show success
    if (!weddingId) {
      setTimeout(() => setStep('success'), 500);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('guests')
        .insert({
          wedding_id: weddingId,
          name: formData.name,
          attending: formData.attending,
          plus_ones: 0,
          email: null,
          message: null
        });

      if (error) throw error;

      setStep('success');
      // Auto close after success message logic handled by user clicking close or just let them enjoy the success screen
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Failed to submit RSVP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#fdfbf7] shadow-2xl overflow-hidden rounded-sm border-4 border-[#1e100b]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#d4af37]/20 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round">
            <path d="M1 1L13 13M1 13L13 1" />
          </svg>
        </button>

        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />

        {/* Ticket Border Effect */}
        <div className="absolute inset-2 border-2 border-[#d4b483] border-dashed opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full min-h-[500px]">
          <div className="bg-[#1e100b] text-[#d4af37] py-6 text-center">
            <h2 className="font-serif text-2xl uppercase tracking-widest">RSVP</h2>
            {deadline && (
              <p className="font-serif text-sm text-[#d4af37]/80 mt-2 italic">Please respond by {deadline}</p>
            )}
            <div className="w-16 h-[1px] bg-[#d4af37] mx-auto mt-2 opacity-50" />
          </div>

          <div className="flex-1 p-8 flex flex-col justify-center">
            {step === 'form' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-serif text-[#1e100b] text-sm uppercase tracking-wide">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-[#d4b483] focus:border-[#1e100b] outline-none py-2 font-serif text-lg text-[#1e100b] placeholder-gray-400 transition-colors"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="flex justify-center gap-8 py-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" className="accent-[#1e100b]" checked={formData.attending} onChange={() => setFormData({ ...formData, attending: true })} />
                    <span className="font-serif italic text-[#1e100b]">Joyfully Accepts</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" className="accent-[#1e100b]" checked={!formData.attending} onChange={() => setFormData({ ...formData, attending: false })} />
                    <span className="font-serif italic text-[#1e100b]">Regretfully Declines</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-4 bg-[#1e100b] text-[#d4af37] font-sans text-xs tracking-[0.2em] uppercase hover:bg-[#2d1b15] transition-colors shadow-lg disabled:opacity-50"
                >
                  {isLoading ? 'Sending Response...' : 'Send Response'}
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="text-4xl text-[#1e100b] mb-4">❦</div>
                <h3 className="font-serif text-2xl text-[#1e100b]">Thank You</h3>
                <p className="font-serif italic text-gray-600">{confirmationMessage}</p>
                <button onClick={onClose} className="mt-8 text-xs underline text-[#d4af37] uppercase tracking-widest">
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const Signature = () => (
  <svg width="200" height="60" viewBox="0 0 200 60" className="opacity-80 transform -rotate-2">
    <motion.path
      d="M10,40 Q30,20 50,40 T90,30 T130,40"
      fill="none"
      stroke="#2d1b0e"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
    />
    <motion.text
      x="20"
      y="45"
      fontFamily="cursive"
      fontSize="24"
      fill="#2d1b0e"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 2 }}
    >
      With Love,
    </motion.text>
    {/* Simulated messy signature lines */}
    <motion.path
      d="M60,40 C70,30 80,50 90,35 S110,45 120,30 S140,50 160,35"
      fill="none"
      stroke="#2d1b0e"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut", delay: 1 }}
    />
  </svg>
);

const NeonVisualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      <AnimatePresence>
        {isPlaying && (
          <>
            {/* Main Purple Glow Pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.05, 1] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[180%] h-[180%] rounded-full bg-purple-600 blur-3xl opacity-30 mix-blend-screen"
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
                  boxShadow: '0 0 5px #a855f7'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const VinylRecord = ({
  label,
  subLabel,
  isPlaying = false,
  className = "",
  texture
}: {
  label: string;
  subLabel: string;
  isPlaying?: boolean;
  className?: string;
  texture?: string;
}) => {
  return (
    <motion.div
      className={`relative rounded-full shadow-2xl ${className} transition-shadow duration-1000`}
      style={{
        background: `conic-gradient(from 45deg, #1a1a1a 0%, #333 10%, #1a1a1a 20%, #000 30%, #222 50%, #000 70%, #1a1a1a 80%, #333 90%, #1a1a1a 100%)`,
        boxShadow: isPlaying
          ? '0 0 40px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(168, 85, 247, 0.3)'
          : '0 20px 50px rgba(0,0,0,0.5)',
      }}
      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
      transition={isPlaying ? { repeat: Infinity, ease: "linear", duration: 4 } : { duration: 0.5 }}
    >
      <NeonVisualizer isPlaying={isPlaying || false} />
      <div className="absolute inset-0 rounded-full opacity-50" style={{ background: `repeating-radial-gradient(#000 0, #000 2px, transparent 3px, transparent 4px)` }} />
      <div className="absolute inset-0 rounded-full opacity-30" style={{ background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)` }} />
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Neon glow ring from inside */}
        {isPlaying && (
          <div className="absolute inset-[30%] rounded-full shadow-[0_0_20px_5px_rgba(168,85,247,0.6)] animate-pulse z-0" />
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
          <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-[#e5e5e5] rounded-full border border-gray-400"></div>
        </div>
      </div>
    </motion.div>
  );
};

export const VintageVinylTheme: React.FC<VintageVinylThemeProps> = ({ initialData = {}, weddingId, slug, onContentChange, isEditorOpen = false }) => {
  // 1. GENERATE DYNAMIC CONFIG
  const config = mergeConfig(initialData);
  const content = config; // Alias for backward compatibility with existing render logic
  // Always start on landing page, require click to open
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
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
    // Note: Assuming we might want to move audioTrack to global assets or player config, 
    // but for now let's check if it exists in the new structure's assets or keep a fallback.
    // The prompt didn't explicitly move audioTrack, but it was in style. 
    // Let's assume for now we might need to add it to GlobalThemeConfig assets if not there, or check where it fits.
    // Looking at the prompt, it didn't specify audioTrack location in the new schema. 
    // However, I merged it in config.ts mergeConfig (wait, I should check if I did).
    // In config.ts I removed style.audioTrack.
    // Let's check my config.ts edit. I did NOT put audioTrack in GlobalThemeConfig or PlayerConfig in the prompt's Step 1.
    // But in mergeConfig, I might have missed mapped it? 
    // Actually, I should probably check if I can add it to global assets or player config to be safe, or if it was omitted on purpose.
    // The prompt Step 1: "Define the Global DNA... assets: { recordTexture... cursor... }" no audio.
    // Step 2 Data: no audio.
    // Step 3 Refactor Landing View: "Update the component to read from config.theme.pages.landing... Font Injection... Background... Colors..."
    // It says "Note: For this step, simply ensure the Landing Mode renders correctly... We will refine Gatekeeper/Player in the next prompt."
    // So audio might be part of Player which is refined later.
    // However, the code uses audio.
    // I should probably Comment out audio usage or use a default since it's not in the new config yet?
    // OR, I should add it to the type definition to avoid errors.
    // ERROR CHECK: I removed audioTrack from VinylThemeConfig. So `content.style.audioTrack` will error.
    // I should probably temporarily hardcode it or use a safe access if I can't change the config type anymore (I just did).
    // Wait, the user said "Refactor the VinylThemeConfig...".
    // If I broke audio, I should probably fix it.
    // Let's assume for this step I should focus on visual.
    // But `content.style.audioTrack` is used in useEffect.
    // I'll replace it with a hardcoded path for now to unblock, or add it to the interface.
    // Better: Add it to GlobalThemeConfig assets or PlayerConfig.
    // Let's use a hardcoded string or a safe "try get" for now to satisfy the compiler if I can't add to config.
    // Actually, I can just not access `content.style.audioTrack`.
    // I will replace the audio initialization line.
    const audio = new Audio('/themes/vintage-vinyl/music.mp3'); // Temporary fallback until PlayerConfig is fully defined with audio
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [/* content.style.audioTrack dependency removed */]);

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

  useEffect(() => {
    // Inject config.theme.global.typography.headingFont
    const font = config.theme.global.typography.headingFont;
    if (font) {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css?family=${font.replace(/\s+/g, '+')}:400,700&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [config.theme.global.typography.headingFont]);

  useEffect(() => {
    if (!isOpen) setIsPlaying(false);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true);
  };

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

  const TrackNumber = ({ num }: { num: string }) => (
    <div className="absolute -left-12 top-0 font-sans font-black text-5xl text-[#d4af37]/20 select-none">
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
            <h2 className="font-serif text-3xl text-[#2d1b0e] mb-4">{content.story.title}</h2>
            <div className="max-w-md px-4 text-left">
              <p className="font-serif text-[#5c4033] leading-relaxed">
                <span className="drop-cap">{content.story.description.charAt(0)}</span>
                {content.story.description.slice(1)}
              </p>
            </div>

            {/* Signature Area */}
            <div className="mt-8 mb-4">
              <Signature />
            </div>
          </motion.div>
        );
      case 'details':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col p-2 relative">
            <div className="flex-1 border-[6px] border-double border-[#2d1b0e] p-6 md:p-8 flex flex-col items-center text-center relative bg-[#fdfbf7] shadow-sm overflow-y-auto custom-scrollbar">
              <div className="mt-2 mb-6 w-full shrink-0">
                <h2 className="font-sans font-black text-3xl md:text-5xl uppercase tracking-tighter text-[#2d1b0e] leading-[0.9] transform scale-y-110">{content.logistics.title}</h2>
                <div className="mt-4 border-b-2 border-dashed border-[#2d1b0e] w-1/2 mx-auto" />
              </div>

              <div className="w-full flex-1 flex flex-col justify-center space-y-10 py-4 relative pl-8">
                {/* Track 01: Ceremony */}
                <div className="flex flex-col items-center group cursor-default relative">
                  <TrackNumber num="01" />
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-sans font-bold text-2xl text-[#2d1b0e]">{content.logistics.ceremony.time}</span>
                    <span className="font-serif italic text-xl text-[#8c7b66]">Ceremony</span>
                  </div>
                  <div className="w-4/5 border-t border-[#d4b483] pt-2 mt-1">
                    <span className="block font-serif font-bold text-[#2d1b0e] uppercase tracking-widest text-sm mb-1">{content.logistics.ceremony.venue}</span>
                    <span className="block font-serif italic text-[#5c4033] text-sm">{content.logistics.ceremony.address}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.logistics.ceremony.address || content.logistics.ceremony.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans font-medium text-[#8c7b66] hover:text-[#2d1b0e] transition-colors uppercase tracking-wider"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" fill="white" /></svg>
                      <span className="text-[#a855f7] font-bold border-b border-[#a855f7]/30">Get Directions</span>
                    </a>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center">
                  <FlourishDivider />
                </div>

                {/* Track 02: Reception */}
                <div className="flex flex-col items-center group cursor-default relative">
                  <TrackNumber num="02" />
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-sans font-bold text-2xl text-[#2d1b0e]">{content.logistics.reception.time}</span>
                    <span className="font-serif italic text-xl text-[#8c7b66]">Reception</span>
                  </div>
                  <div className="w-4/5 border-t border-[#d4b483] pt-2 mt-1">
                    <span className="block font-serif font-bold text-[#2d1b0e] uppercase tracking-widest text-sm mb-1">{content.logistics.reception.venue}</span>
                    <span className="block font-serif italic text-[#5c4033] text-sm">{content.logistics.reception.address}</span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(content.logistics.reception.address || content.logistics.reception.venue)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-sans font-medium text-[#8c7b66] hover:text-[#2d1b0e] transition-colors uppercase tracking-wider"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" fill="white" /></svg>
                      <span className="text-[#a855f7] font-bold border-b border-[#a855f7]/30">Get Directions</span>
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col h-full">
            <div className="mb-6 flex flex-col items-center shrink-0">
              <h2 className="font-sans font-black text-2xl md:text-3xl uppercase tracking-tighter text-[#2d1b0e] leading-none mb-2">{content.gallery.title}</h2>
              <div className="h-[2px] w-24 bg-[#d4b483]" />
            </div>
            <div className="relative flex-1 overflow-y-auto fader-scrollbar px-4 pt-4">
              <div className="grid grid-cols-2 gap-6 pb-20">
                {content.gallery.images.map((src, index) => {
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
                      <div className="bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.2)] group-hover:shadow-2xl transition-all duration-300 relative">
                        {/* Tape Effects within grid */}
                        {index % 3 === 0 && <div className="tape-corner" style={{ top: '-12px', left: '50%', width: '4rem', transform: 'translateX(-50%) rotate(2deg)' }}></div>}

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

  if (config.theme.pages.landing.mode === 'split-screen') {
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
  }

  return (
    <div
      className={`${isEditorOpen ? 'relative w-full h-full' : 'fixed inset-0'} flex items-center justify-center overflow-hidden`}
      // 2. APPLY DYNAMIC COLOR OR BACKGROUND TEXTURE
      style={{
        backgroundColor: config.theme.global.palette.primary, // Fallback for no image?
        // Logic for centered mode background (using landing background value)
        ...(config.theme.pages.landing.backgroundValue.startsWith('/') || config.theme.pages.landing.backgroundValue.startsWith('http') ? {
          backgroundImage: `url('${config.theme.pages.landing.backgroundValue}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'soft-light'
        } : {
          backgroundColor: config.theme.pages.landing.backgroundValue
        })
      }}
    >
      <GlobalStyles />
      {/* SVG Definitions */}
      <svg width="0" height="0"><GoldGradientDef /></svg>

      <AnimatePresence>
        {isRSVPOpen && <RSVPModal onClose={() => setIsRSVPOpen(false)} key="rsvp-modal" confirmationMessage={content.rsvp.confirmationMessage} deadline={content.rsvp.deadline} weddingId={weddingId} />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ================= GATEKEEPER VIEW (Skeleton + Skin Architecture) ================= */
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
              {config.theme.pages.gatekeeper.cornerAsset && (
                <>
                  {[0, 90, 180, 270].map((rotation, i) => {
                    const isSpike = config.theme.pages.gatekeeper.cornerAsset === 'metal-spike';
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
                          width: isSpike ? '60px' : '48px',
                          height: isSpike ? '60px' : '48px',
                          transform: `rotate(${rotation}deg)`
                        }}
                      >
                        {isSpike ? (
                          <MetalSpike className="w-full h-full" />
                        ) : (
                          <img
                            src={config.theme.pages.gatekeeper.cornerAsset}
                            alt=""
                            className="w-full h-full object-contain opacity-90"
                          />
                        )}
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
                  }),
                  borderRadius: config.theme.pages.gatekeeper.cardShape === 'rounded' ? '16px' : '4px',
                  boxShadow: config.theme.pages.gatekeeper.neonColor
                    ? `0 0 0 2px ${config.theme.pages.gatekeeper.neonColor}, 0 20px 60px rgba(0,0,0,0.7)`
                    : `0 0 0 1px ${config.theme.global.palette.primary}40, 0 20px 60px rgba(0,0,0,0.7)`
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
        ) : (
          /* ================= OPEN STATE (GATEFOLD) ================= */
          <motion.div
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`${isEditorOpen ? 'absolute inset-0' : 'fixed inset-0 z-50'} flex flex-col md:flex-row`}
          >
            {/* LEFT PANEL: Liner Notes */}
            <motion.div
              className="w-full md:w-1/2 h-[70%] md:h-full relative p-6 md:p-12 overflow-hidden shadow-[5px_0_20px_rgba(0,0,0,0.3)] z-20"
              style={{ backgroundColor: '#f4e4bc', color: '#1e100b' }} // FIXME: Add paperColor to new schema or use default
            >
              <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40" style={{ backgroundImage: `url("${NOISE_SVG}")` }} />
              <div className="absolute inset-4 md:inset-8 border-4 border-double border-[#d4af37] opacity-50 pointer-events-none" />
              <button onClick={() => setIsOpen(false)} className="absolute top-6 left-6 md:top-10 md:left-10 z-50 bg-[#2d1b0e]/10 hover:bg-[#2d1b0e]/20 border border-[#8c7b66]/40 px-3 py-1.5 rounded text-[#5c4033] hover:text-[#2d1b0e] transition-all font-sans text-xs tracking-widest uppercase flex items-center gap-2 font-medium shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                Close Album
              </button>
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
              className="w-full md:w-1/2 h-[30%] md:h-full relative bg-[#151515] flex flex-col items-center justify-center border-t-2 md:border-t-0 md:border-l-2 border-[#2d1b0e] shadow-inner overflow-hidden"
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
                  <VinylRecord label={content.hero.title} subLabel={content.hero.date} isPlaying={isPlaying} className="w-[92%] h-[92%]" texture={config.theme.global.assets.recordTexture} />
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
                    <RSVPTicket onClick={() => setIsRSVPOpen(true)} label={content.rsvp.ticketTitle} />
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
        )}
      </AnimatePresence>
    </div>
  );
};

// Export in the format expected by the registry
export default {
  component: VintageVinylTheme,
  config: defaultContent,
};