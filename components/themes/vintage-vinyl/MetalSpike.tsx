import React from 'react';

export const MetalSpike = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg
        viewBox="0 0 100 100"
        className={className}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
    >
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#555', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#222', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#000', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4" />
                </feComponentTransfer>
            </filter>
        </defs>

        {/* Base Corner Bracket (Grip) */}
        <path
            d="M0,0 L50,0 L55,15 L15,15 L15,55 L0,50 Z"
            fill="url(#grad1)"
            stroke="#111"
            strokeWidth="1"
        />

        {/* Texture Overlay */}
        <path
            d="M0,0 L50,0 L55,15 L15,15 L15,55 L0,50 Z"
            fill="transparent"
            style={{ filter: 'url(#noise)', opacity: 0.3 }}
        />

        {/* The Aggressive Spike (Diagonal) */}
        <path
            d="M10,10 L30,30 L90,90 L35,45 L10,10 Z"
            fill="#333"
            stroke="#000"
            strokeWidth="1"
        />
        <path
            d="M10,10 L90,90 L45,35 L10,10 Z"
            fill="#1a1a1a" // Shadow side
        />

        {/* Bolts/Rivets */}
        <circle cx="25" cy="8" r="3" fill="#111" />
        <circle cx="25" cy="8" r="1.5" fill="#444" />

        <circle cx="8" cy="25" r="3" fill="#111" />
        <circle cx="8" cy="25" r="1.5" fill="#444" />

        {/* Scratch Marks */}
        <path d="M5,5 L20,8" stroke="#777" strokeWidth="0.5" opacity="0.6" />
        <path d="M40,10 L50,12" stroke="#777" strokeWidth="0.5" opacity="0.6" />
    </svg>
);
